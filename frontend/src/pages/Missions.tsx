import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  LifeBuoy, 
  Plus, 
  MapPin, 
  Calendar, 
  CheckSquare, 
  Square, 
  X,
  Check,
  Loader2,
  ChevronDown,
  ChevronUp,
  WifiOff,
  RefreshCw,
  CloudOff
} from 'lucide-react';
import client from '../api/client';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../store/auth.store';
import { getAll, saveMissions, putTask, markTaskSynced, type Mission, type MissionTask } from '../lib/missions-db';
import { useMissionsSync } from '../lib/useMissionsSync';

const missionStatusLabels: Record<string, string> = {
  PLANNED: 'Planificada',
  IN_PROGRESS: 'En curso',
  COMPLETED: 'Completada',
  CANCELLED: 'Cancelada',
};

export const Missions: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const { user } = useAuthStore();
  const orgId = user?.organizationId;
  const userId = user?.id;

  const { isOnline, pendingCount, isSyncing, syncPending, refreshPendingCount } = useMissionsSync();

  const { data: missions = [], isLoading, isError } = useQuery<Mission[]>({
    queryKey: ['missions', orgId, userId],
    queryFn: async () => {
      if (isOnline) {
        try {
          const { data } = await client.get('/missions');
          if (orgId && userId && Array.isArray(data)) {
            await saveMissions(orgId, userId, data);
            return await getAll(orgId, userId);
          }
          return data;
        } catch (error) {
          if (orgId && userId) {
            const cached = await getAll(orgId, userId);
            if (cached && cached.length > 0) return cached;
          }
          throw error;
        }
      } else {
        if (orgId && userId) {
          return await getAll(orgId, userId);
        }
        return [];
      }
    },
  });

  const createMutation = useMutation({
    mutationFn: async (newMission: { title: string; location?: string; startDate?: string; description?: string }) => {
      const { data } = await client.post('/missions', newMission);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['missions', orgId, userId] });
      setIsModalOpen(false);
    },
  });

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <div><p className="mb-3 text-sm font-semibold text-primary-fixed-dim">Conservación</p><h1 className="font-headline text-3xl font-semibold tracking-tight text-white sm:text-4xl">Misiones</h1></div>

            {!isOnline ? (
              <div className="flex items-center gap-2 rounded-full bg-tertiary/10 px-3 py-1.5 text-xs font-medium text-tertiary">
                <WifiOff className="h-4 w-4" />
                <span>Sin conexión — guardado local</span>
              </div>
            ) : pendingCount > 0 ? (
              <button
                onClick={() => syncPending()}
                disabled={isSyncing}
                className="flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary-fixed-dim transition-colors hover:bg-primary/20 focus-visible:outline-2 focus-visible:outline-primary"
              >
                <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? 'Sincronizando...' : `Guardado local (${pendingCount} pendiente${pendingCount > 1 ? 's' : ''})`}</span>
              </button>
            ) : null}
          </div>
          <p className="mt-3 max-w-2xl text-on-surface-variant">Coordina el trabajo en terreno y registra el avance de cada actividad.</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          disabled={!isOnline}
          title={!isOnline ? 'Crear misiones requiere conexión a internet' : undefined}
          className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 font-semibold text-on-primary transition-colors hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isOnline ? <Plus className="w-5 h-5" /> : <CloudOff className="w-5 h-5" />}
          Planificar Misión
        </button>
      </header>

      {isLoading ? (
        <div role="status" className="flex justify-center p-20">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      ) : isError ? (
        <p role="alert" className="rounded-2xl bg-error-container/40 p-5 text-sm text-error">No pudimos cargar las misiones guardadas. Comprueba tu conexión e inténtalo de nuevo.</p>
      ) : missions.length === 0 ? (
        <div className="space-y-3 rounded-2xl bg-surface-container px-6 py-12 text-center">
          <LifeBuoy aria-hidden="true" className="mx-auto h-8 w-8 text-primary" />
          <h3 className="font-headline text-lg font-semibold text-white">No hay misiones guardadas</h3>
          <p className="text-sm text-on-surface-variant">
            {!isOnline 
              ? 'No hay misiones almacenadas localmente en este dispositivo.' 
              : 'Crea tu primera misión para comenzar la coordinación.'}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {missions.map((m: Mission) => (
            <MissionItem 
              key={m.id} 
              mission={m} 
              isOnline={isOnline}
              orgId={orgId}
              userId={userId}
              refreshPendingCount={refreshPendingCount}
            />
          ))}
        </div>
      )}

      {/* Modal de Planificación */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-surface-container shadow-2xl"
            >
              <div className="p-8 md:p-12">
                <div className="mb-8 flex items-center justify-between gap-4">
                  <div><p className="text-sm font-semibold text-primary-fixed-dim">Conservación</p><h2 className="mt-1 font-headline text-2xl font-semibold text-white">Planificar misión</h2></div>
                  <button aria-label="Cerrar formulario" onClick={() => setIsModalOpen(false)} className="rounded-xl p-2 text-on-surface-variant transition-colors hover:bg-surface-bright hover:text-white focus-visible:outline-2 focus-visible:outline-primary">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form 
                  onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const title = formData.get('title') as string;
                    const location = formData.get('location') as string;
                    const startDateVal = formData.get('startDate') as string;
                    const description = formData.get('description') as string;

                    createMutation.mutate({
                      title,
                      location: location || undefined,
                      startDate: startDateVal ? new Date(startDateVal).toISOString() : undefined,
                      description: description || undefined,
                    });
                  }} 
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label className="mb-2 block text-sm font-medium text-on-surface">Nombre de la misión</label>
                      <input name="title" required className="w-full rounded-xl bg-surface-container-high px-4 py-3.5 text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary" />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-on-surface">Ubicación</label>
                      <input name="location" className="w-full rounded-xl bg-surface-container-high px-4 py-3.5 text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary" />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-on-surface">Fecha de inicio</label>
                      <input name="startDate" type="date" required className="w-full rounded-xl bg-surface-container-high px-4 py-3.5 text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary" />
                    </div>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-on-surface">Objetivos y descripción</label>
                    <textarea name="description" rows={3} className="w-full resize-y rounded-xl bg-surface-container-high px-4 py-3.5 text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary" />
                  </div>

                  {createMutation.isError && <p role="alert" className="text-sm text-error">No pudimos crear la misión. Revisa los datos e inténtalo de nuevo.</p>}
                  <button
                    disabled={createMutation.isPending || !isOnline}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 font-semibold text-on-primary transition-colors hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50"
                  >
                    {createMutation.isPending ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                      <>
                        <Check className="w-6 h-6" />
                        Confirmar Misión
                      </>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface MissionItemProps {
  mission: Mission;
  isOnline: boolean;
  orgId?: string;
  userId?: string;
  refreshPendingCount: () => void;
}

const MissionItem: React.FC<MissionItemProps> = ({ 
  mission, 
  isOnline, 
  orgId, 
  userId, 
  refreshPendingCount 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const toggleTaskMutation = useMutation({
    mutationFn: async ({ taskId, isCompleted }: { taskId: string; isCompleted: boolean }) => {
      if (orgId && userId) {
        await putTask(orgId, userId, mission.id, taskId, isCompleted, true);
        await refreshPendingCount();
      }

      if (isOnline) {
        try {
          const { data } = await client.patch(`/missions/${mission.id}/tasks/${taskId}`, { isCompleted });
          if (orgId && userId) {
            await markTaskSynced(orgId, userId, mission.id, taskId);
            await refreshPendingCount();
          }
          return data;
        } catch {
          // If network patch fails, it stays queued in IndexedDB with pendingSync: true
        }
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['missions', orgId, userId] });
    },
  });

  const completedTasks = mission.tasks?.filter((t: MissionTask) => t.isCompleted).length || 0;
  const totalTasks = mission.tasks?.length || 0;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <article className="glass-card overflow-hidden rounded-2xl">
      <button
        type="button"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full flex-col gap-5 p-5 text-left transition-colors hover:bg-surface-container-high focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-primary md:flex-row md:items-center sm:p-6"
      >
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary-fixed-dim">
          <LifeBuoy aria-hidden="true" className="h-6 w-6" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="mb-2 flex items-center gap-3">
            <h3 className="truncate font-headline text-lg font-semibold text-white sm:text-xl">{mission.title}</h3>
            <span className="shrink-0 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary-fixed-dim">
              {missionStatusLabels[mission.status] || mission.status}
            </span>
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-on-surface-variant">
            <span className="flex items-center gap-1.5">
              <MapPin aria-hidden="true" className="h-4 w-4" />
              {mission.location || 'Sin ubicación'}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar aria-hidden="true" className="h-4 w-4" />
              {new Intl.DateTimeFormat('es-CL', { dateStyle: 'medium' }).format(new Date(mission.startDate))}
            </span>
          </div>
        </div>

        <div className="w-full space-y-2 md:w-48">
          <div className="flex justify-between text-xs text-on-surface-variant">
            <span>Progreso</span>
            <span>{completedTasks}/{totalTasks} Tareas</span>
          </div>
          <div role="progressbar" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100} aria-label={`Progreso de ${mission.title}`} className="h-1.5 w-full overflow-hidden rounded-full bg-surface-container-highest">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-full rounded-full bg-primary"
            />
          </div>
        </div>

        <div aria-hidden="true" className="hidden shrink-0 text-on-surface-variant md:block">
          {isOpen ? <ChevronUp /> : <ChevronDown />}
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-surface-container-high/40"
          >
            <div className="space-y-4 p-5 sm:p-6">
              <p className="mb-6 text-sm leading-relaxed text-on-surface-variant">
                {mission.description || 'Sin descripción detallada de objetivos.'}
              </p>

              <h4 className="mb-4 text-sm font-semibold text-white">Tareas ({completedTasks} de {totalTasks} completas)</h4>
              <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                {mission.tasks?.map((task: MissionTask) => (
                  <button
                    type="button"
                    key={task.id}
                    onClick={() => toggleTaskMutation.mutate({ taskId: task.id, isCompleted: !task.isCompleted })}
                    aria-pressed={task.isCompleted}
                    className={`flex items-center gap-3 rounded-xl p-4 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                      task.isCompleted 
                        ? 'bg-secondary/10 text-secondary'
                        : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-bright'
                    }`}
                  >
                    {task.isCompleted ? <CheckSquare aria-hidden="true" className="h-5 w-5 shrink-0" /> : <Square aria-hidden="true" className="h-5 w-5 shrink-0" />}
                    <div className="flex-1">
                      <p className={`text-sm font-bold ${task.isCompleted ? 'line-through opacity-50' : ''}`}>
                        {task.title}
                      </p>
                      {task.assignedTo && (
                        <p className="mt-1 text-xs opacity-70">
                          Asignado: {task.assignedTo}
                        </p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  );
};
