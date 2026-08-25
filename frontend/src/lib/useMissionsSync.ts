import { useState, useEffect, useCallback, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import client from '../api/client';
import { useAuthStore } from '../store/auth.store';
import { getPending, markTaskSynced, type LocalMissionTask } from './missions-db';
import axios from 'axios';

const RETRY_DELAYS = [1000, 3000, 9000]; // 1s, 3s, 9s

export function useMissionsSync() {
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [pendingCount, setPendingCount] = useState<number>(0);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const orgId = user?.organizationId;
  const userId = user?.id;

  const isSyncingRef = useRef(false);

  const updatePendingCount = useCallback(async () => {
    if (!orgId || !userId) {
      setPendingCount(0);
      return;
    }
    try {
      const pending = await getPending(orgId, userId);
      setPendingCount(pending.length);
    } catch {
      setPendingCount(0);
    }
  }, [orgId, userId]);

  const syncTaskWithRetry = async (task: LocalMissionTask): Promise<boolean> => {
    for (let attempt = 0; attempt <= RETRY_DELAYS.length; attempt++) {
      try {
        await client.patch(`/missions/${task.missionId}/tasks/${task.taskId}`, {
          isCompleted: task.isCompleted,
        });

        await markTaskSynced(task.orgId, task.userId, task.missionId, task.taskId);
        return true;
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          // Handle 409 Conflict: mark as resolved/synced to prevent infinite retries
          if (err.response?.status === 409) {
            await markTaskSynced(task.orgId, task.userId, task.missionId, task.taskId);
            return true;
          }
        }

        // If we still have retry attempts remaining, wait before retrying
        if (attempt < RETRY_DELAYS.length) {
          await new Promise((resolve) => setTimeout(resolve, RETRY_DELAYS[attempt]));
        } else {
          // Exhausted all retries
          return false;
        }
      }
    }
    return false;
  };

  const syncPending = useCallback(async () => {
    if (!orgId || !userId || !navigator.onLine || isSyncingRef.current) {
      return;
    }

    isSyncingRef.current = true;
    setIsSyncing(true);

    try {
      const pending = await getPending(orgId, userId);
      let syncedAny = false;

      for (const task of pending) {
        const success = await syncTaskWithRetry(task);
        if (success) {
          syncedAny = true;
        }
      }

      if (syncedAny) {
        queryClient.invalidateQueries({ queryKey: ['missions'] });
      }
    } finally {
      isSyncingRef.current = false;
      setIsSyncing(false);
      await updatePendingCount();
    }
  }, [orgId, userId, queryClient, updatePendingCount]);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      syncPending();
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    let isMounted = true;
    const init = async () => {
      if (!isMounted) return;
      await updatePendingCount();
      if (navigator.onLine && isMounted) {
        await syncPending();
      }
    };
    void init();

    return () => {
      isMounted = false;
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [syncPending, updatePendingCount]);

  return {
    isOnline,
    pendingCount,
    isSyncing,
    syncPending,
    refreshPendingCount: updatePendingCount,
  };
}
