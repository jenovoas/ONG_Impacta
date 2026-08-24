import { openDB, type DBSchema, type IDBPDatabase } from 'idb';

export interface MissionTask {
  id: string;
  title: string;
  isCompleted: boolean;
  assignedTo?: string;
}

export interface Mission {
  id: string;
  title: string;
  description?: string;
  location?: string;
  startDate: string;
  status: string;
  tasks?: MissionTask[];
  updatedAt?: string;
}

export interface LocalMission {
  key: string; // `${orgId}:${userId}:${id}`
  orgId: string;
  userId: string;
  tenantKey: string; // `${orgId}:${userId}`
  id: string;
  title: string;
  description?: string;
  location?: string;
  startDate: string;
  status: string;
  tasks: MissionTask[];
  updatedAt: string;
}

export interface LocalMissionTask {
  key: string; // `${orgId}:${missionId}:${taskId}`
  orgId: string;
  userId: string;
  tenantKey: string; // `${orgId}:${userId}`
  missionId: string;
  taskId: string;
  title: string;
  isCompleted: boolean;
  assignedTo?: string;
  pendingSync: boolean;
  pendingSyncNum: number; // 1 when true, 0 when false
  updatedAt: string;
}

interface MissionsDBSchema extends DBSchema {
  missions: {
    key: string;
    value: LocalMission;
    indexes: {
      'by-tenant': string;
    };
  };
  missionTasks: {
    key: string;
    value: LocalMissionTask;
    indexes: {
      'by-pending': number;
      'by-tenant': string;
    };
  };
}

const DB_NAME = 'impacta-missions-db';
const DB_VERSION = 1;
const MAX_MISSIONS_PER_TENANT = 50;

let dbPromise: Promise<IDBPDatabase<MissionsDBSchema>> | null = null;

function getDB(): Promise<IDBPDatabase<MissionsDBSchema>> {
  if (!dbPromise) {
    dbPromise = openDB<MissionsDBSchema>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('missions')) {
          const missionStore = db.createObjectStore('missions', { keyPath: 'key' });
          missionStore.createIndex('by-tenant', 'tenantKey');
        }
        if (!db.objectStoreNames.contains('missionTasks')) {
          const taskStore = db.createObjectStore('missionTasks', { keyPath: 'key' });
          taskStore.createIndex('by-pending', 'pendingSyncNum');
          taskStore.createIndex('by-tenant', 'tenantKey');
        }
      },
    });
  }
  return dbPromise;
}

function assertTenant(orgId: string, userId: string): void {
  if (!orgId || !userId) {
    throw new Error('Multi-tenant isolation violation: orgId and userId are required');
  }
}

export async function getAll(orgId: string, userId: string): Promise<Mission[]> {
  assertTenant(orgId, userId);
  const db = await getDB();
  const tenantKey = `${orgId}:${userId}`;

  const localMissions = await db.getAllFromIndex('missions', 'by-tenant', tenantKey);
  const localTasks = await db.getAllFromIndex('missionTasks', 'by-tenant', tenantKey);

  const tasksByMission = new Map<string, LocalMissionTask[]>();
  for (const t of localTasks) {
    const list = tasksByMission.get(t.missionId) || [];
    list.push(t);
    tasksByMission.set(t.missionId, list);
  }

  // Sort missions by startDate descending and limit to 50
  const sortedMissions = localMissions
    .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
    .slice(0, MAX_MISSIONS_PER_TENANT);

  return sortedMissions.map((m) => {
    const storedTasks = tasksByMission.get(m.id) || [];
    let mergedTasks = m.tasks || [];

    if (storedTasks.length > 0) {
      const taskMap = new Map<string, MissionTask>();
      for (const t of mergedTasks) {
        taskMap.set(t.id, t);
      }
      for (const st of storedTasks) {
        const existing = taskMap.get(st.taskId);
        taskMap.set(st.taskId, {
          id: st.taskId,
          title: st.title || existing?.title || 'Tarea',
          isCompleted: st.isCompleted,
          assignedTo: st.assignedTo || existing?.assignedTo,
        });
      }
      mergedTasks = Array.from(taskMap.values());
    }

    return {
      id: m.id,
      title: m.title,
      description: m.description,
      location: m.location,
      startDate: m.startDate,
      status: m.status,
      tasks: mergedTasks,
      updatedAt: m.updatedAt,
    };
  });
}

export async function saveMissions(orgId: string, userId: string, apiMissions: Mission[]): Promise<void> {
  assertTenant(orgId, userId);
  const db = await getDB();
  const tenantKey = `${orgId}:${userId}`;

  const limitedMissions = apiMissions.slice(0, MAX_MISSIONS_PER_TENANT);
  const tx = db.transaction(['missions', 'missionTasks'], 'readwrite');
  const missionStore = tx.objectStore('missions');
  const taskStore = tx.objectStore('missionTasks');

  for (const m of limitedMissions) {
    const missionKey = `${orgId}:${userId}:${m.id}`;
    const tasks: MissionTask[] = m.tasks || [];

    const localMission: LocalMission = {
      key: missionKey,
      orgId,
      userId,
      tenantKey,
      id: m.id,
      title: m.title,
      description: m.description,
      location: m.location,
      startDate: m.startDate,
      status: m.status,
      tasks,
      updatedAt: m.updatedAt || new Date().toISOString(),
    };

    await missionStore.put(localMission);

    for (const t of tasks) {
      const taskKey = `${orgId}:${m.id}:${t.id}`;
      const existingTask = await taskStore.get(taskKey);

      // Preserve local state if currently pending sync
      if (existingTask && existingTask.pendingSync) {
        continue;
      }

      const localTask: LocalMissionTask = {
        key: taskKey,
        orgId,
        userId,
        tenantKey,
        missionId: m.id,
        taskId: t.id,
        title: t.title,
        isCompleted: t.isCompleted,
        assignedTo: t.assignedTo,
        pendingSync: false,
        pendingSyncNum: 0,
        updatedAt: new Date().toISOString(),
      };

      await taskStore.put(localTask);
    }
  }

  await tx.done;
}

export async function putTask(
  orgId: string,
  userId: string,
  missionId: string,
  taskId: string,
  isCompleted: boolean,
  pendingSync: boolean = true,
  taskTitle?: string,
  assignedTo?: string
): Promise<void> {
  assertTenant(orgId, userId);
  const db = await getDB();
  const tenantKey = `${orgId}:${userId}`;
  const taskKey = `${orgId}:${missionId}:${taskId}`;

  const tx = db.transaction(['missions', 'missionTasks'], 'readwrite');
  const taskStore = tx.objectStore('missionTasks');
  const missionStore = tx.objectStore('missions');

  const existingTask = await taskStore.get(taskKey);
  const updatedTask: LocalMissionTask = {
    key: taskKey,
    orgId,
    userId,
    tenantKey,
    missionId,
    taskId,
    title: taskTitle || existingTask?.title || '',
    isCompleted,
    assignedTo: assignedTo || existingTask?.assignedTo,
    pendingSync,
    pendingSyncNum: pendingSync ? 1 : 0,
    updatedAt: new Date().toISOString(),
  };

  await taskStore.put(updatedTask);

  // Also update tasks array in cached mission inside 'missions' store
  const missionKey = `${orgId}:${userId}:${missionId}`;
  const existingMission = await missionStore.get(missionKey);
  if (existingMission) {
    const tasks = existingMission.tasks || [];
    const taskIndex = tasks.findIndex((t) => t.id === taskId);
    if (taskIndex >= 0) {
      tasks[taskIndex] = {
        ...tasks[taskIndex],
        isCompleted,
      };
    } else {
      tasks.push({
        id: taskId,
        title: taskTitle || '',
        isCompleted,
        assignedTo,
      });
    }
    existingMission.tasks = tasks;
    existingMission.updatedAt = new Date().toISOString();
    await missionStore.put(existingMission);
  }

  await tx.done;
}

export async function getPending(orgId?: string, userId?: string): Promise<LocalMissionTask[]> {
  const db = await getDB();
  const pendingTasks = await db.getAllFromIndex('missionTasks', 'by-pending', 1);

  if (orgId && userId) {
    const tenantKey = `${orgId}:${userId}`;
    return pendingTasks.filter((t) => t.tenantKey === tenantKey);
  }

  return pendingTasks;
}

export async function markTaskSynced(
  orgId: string,
  userId: string,
  missionId: string,
  taskId: string
): Promise<void> {
  assertTenant(orgId, userId);
  const db = await getDB();
  const taskKey = `${orgId}:${missionId}:${taskId}`;
  const existing = await db.get('missionTasks', taskKey);
  const isCompleted = existing ? existing.isCompleted : true;
  await putTask(orgId, userId, missionId, taskId, isCompleted, false);
}

export async function clearTenant(orgId: string, userId: string): Promise<void> {
  assertTenant(orgId, userId);
  const db = await getDB();
  const tenantKey = `${orgId}:${userId}`;

  const tx = db.transaction(['missions', 'missionTasks'], 'readwrite');
  const missionStore = tx.objectStore('missions');
  const taskStore = tx.objectStore('missionTasks');

  const missions = await missionStore.index('by-tenant').getAllKeys(tenantKey);
  for (const k of missions) {
    await missionStore.delete(k);
  }

  const tasks = await taskStore.index('by-tenant').getAllKeys(tenantKey);
  for (const k of tasks) {
    await taskStore.delete(k);
  }

  await tx.done;
}
