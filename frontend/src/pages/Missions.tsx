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
  ChevronUp
} from 'lucide-react';
import client from '../api/client';
import { motion, AnimatePresence } from 'framer-motion';

export const Missions: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: missions = [], isLoading } = useQuery({
    queryKey: ['missions'],
    queryFn: async () => {
      const { data } = await client.get('/missions');
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (newMission: any) => {
      const { data } = await client.post('/missions', newMission);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['missions'] });
      setIsModalOpen(false);
    },
  });

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter">
            Misiones de <span className="text-primary">Rescate</span>
          </h1>
          <p className="text-gray-500 font-medium mt-2">Coordinación logística y tareas operativas en terreno.</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary text-on-primary px-6 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:scale-[0.98] transition-transform shadow-lg shadow-primary/20"
        >
          <Plus className="w-5 h-5" />
          Planificar Misión
        </button>
      </header>

      {isLoading ? (
        <div className="flex justify-center p-20">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      ) : (
        <div className="space-y-6">
          {missions.map((m: any) => (
            <MissionItem key={m.id} mission={m} />
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
              className="relative w-full max-w-2xl glass-card rounded-[40px] border border-white/10 shadow-2xl overflow-hidden"
            >
              <div className="p-8 md:p-12">
                <div className="flex justify-between items-center mb-10">
                  <h2 className="text-3xl font-black text-white uppercase italic">Nueva <span className="text-primary">Misión</span></h2>
                  <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-white/5 rounded-full transition-colors text-gray-500">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form 
                  onSubmit={(e: any) => {
                    e.preventDefault();
                    const formData = new FormData(e.target);
                    createMutation.mutate({
                      title: formData.get('title'),
                      location: formData.get('location'),
                      startDate: formData.get('startDate') ? new Date(formData.get('startDate') as string).toISOString() : undefined,
                      description: formData.get('description'),
                    });
                  }} 
                  className="space-y-6"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">Título de la Misión</label>
                      <input name="title" required className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white focus:outline-none focus:border-primary/50 transition-colors" />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">Ubicación</label>
                      <input name="location" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white focus:outline-none focus:border-primary/50 transition-colors" />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">Fecha de Inicio</label>
                      <input name="startDate" type="date" required className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white focus:outline-none focus:border-primary/50 transition-colors" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">Objetivos / Descripción</label>
                    <textarea name="description" rows={3} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white focus:outline-none focus:border-primary/50 transition-colors" />
                  </div>

                  <button
                    disabled={createMutation.isPending}
                    className="w-full bg-primary text-on-primary py-5 rounded-2xl font-bold flex items-center justify-center gap-2 hover:scale-[0.98] transition-transform disabled:opacity-50"
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

const MissionItem = ({ mission }: { mission: any }) => {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const toggleTaskMutation = useMutation({
    mutationFn: async ({ taskId, isCompleted }: { taskId: string; isCompleted: boolean }) => {
      const { data } = await client.patch(`/missions/${mission.id}/tasks/${taskId}`, { isCompleted });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['missions'] });
    },
  });

  const completedTasks = mission.tasks?.filter((t: any) => t.isCompleted).length || 0;
  const totalTasks = mission.tasks?.length || 0;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <div className="glass-card rounded-3xl overflow-hidden border border-white/5">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-6 cursor-pointer hover:bg-white/[0.02] transition-colors"
      >
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0">
          <LifeBuoy className="w-8 h-8 text-primary" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <h3 className="text-xl font-bold text-white truncate">{mission.title}</h3>
            <span className="bg-primary/20 text-primary text-[10px] font-black px-2 py-1 rounded-full uppercase">
              {mission.status}
            </span>
          </div>
          <div className="flex flex-wrap gap-4 text-gray-500 text-xs font-bold uppercase tracking-wider">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              {mission.location || 'Sin ubicación'}
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(mission.startDate).toLocaleDateString()}
            </div>
          </div>
        </div>

        <div className="w-full md:w-48 space-y-2">
          <div className="flex justify-between text-[10px] font-black uppercase text-gray-500">
            <span>Progreso</span>
            <span>{completedTasks}/{totalTasks} Tareas</span>
          </div>
          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-full bg-primary rounded-full shadow-[0_0_8px_rgba(0,168,255,0.4)]"
            />
          </div>
        </div>

        <div className="shrink-0">
          {isOpen ? <ChevronUp className="text-gray-600" /> : <ChevronDown className="text-gray-600" />}
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-white/5 bg-black/20"
          >
            <div className="p-8 space-y-4">
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                {mission.description || 'Sin descripción detallada de objetivos.'}
              </p>

              <h4 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-4">Checklist de Tareas</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {mission.tasks?.map((task: any) => (
                  <div 
                    key={task.id}
                    onClick={() => toggleTaskMutation.mutate({ taskId: task.id, isCompleted: !task.isCompleted })}
                    className={`flex items-center gap-3 p-4 rounded-2xl border transition-all cursor-pointer ${
                      task.isCompleted 
                        ? 'bg-secondary/5 border-secondary/20 text-secondary' 
                        : 'bg-white/5 border-white/5 text-gray-400 hover:border-white/10'
                    }`}
                  >
                    {task.isCompleted ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
                    <div className="flex-1">
                      <p className={`text-sm font-bold ${task.isCompleted ? 'line-through opacity-50' : ''}`}>
                        {task.title}
                      </p>
                      {task.assignedTo && (
                        <p className="text-[10px] font-black uppercase tracking-tighter opacity-70">
                          Asignado: {task.assignedTo}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
