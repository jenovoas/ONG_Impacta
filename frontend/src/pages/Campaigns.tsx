import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Target, 
  Plus, 
  Calendar, 
  X, 
  Check, 
  Loader2
} from 'lucide-react';
import client from '../api/client';
import { motion, AnimatePresence } from 'framer-motion';

export const Campaigns: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: campaigns = [], isLoading, isError } = useQuery({
    queryKey: ['campaigns'],
    queryFn: async () => {
      const { data } = await client.get('/campaigns');
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (newCampaign: any) => {
      const { data } = await client.post('/campaigns', newCampaign);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      setIsModalOpen(false);
    },
  });

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-3 text-sm font-semibold text-tertiary">Operación</p>
          <h1 className="font-headline text-3xl font-semibold tracking-tight text-white sm:text-4xl">Campañas</h1>
          <p className="mt-3 max-w-2xl text-on-surface-variant">Define metas y sigue el avance de los proyectos de tu organización.</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-tertiary px-5 py-3 font-semibold text-on-tertiary transition-colors hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tertiary"
        >
          <Plus className="w-5 h-5" />
          Nueva Campaña
        </button>
      </header>

      {isLoading ? (
        <div role="status" className="flex justify-center p-20">
          <Loader2 className="w-10 h-10 animate-spin text-tertiary" />
        </div>
      ) : isError ? (
        <p role="alert" className="rounded-2xl bg-error-container/40 p-5 text-sm text-error">No pudimos cargar las campañas. Vuelve a intentarlo.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          {campaigns.length ? campaigns.map((c: any) => (
            <CampaignCard key={c.id} campaign={c} />
          )) : (
            <div className="col-span-full rounded-2xl bg-surface-container px-6 py-12 text-center">
              <Target aria-hidden="true" className="mx-auto h-7 w-7 text-tertiary" />
              <p className="mt-3 font-medium text-white">Aún no hay campañas</p>
              <p className="mt-1 text-sm text-on-surface-variant">Crea una campaña para empezar a dar seguimiento a una meta.</p>
            </div>
          )}
        </div>
      )}

      {/* Modal de Creación */}
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
              className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl bg-surface-container shadow-2xl"
            >
              <div className="p-8 md:p-12">
                <div className="mb-8 flex items-center justify-between gap-4">
                  <div><p className="text-sm font-semibold text-tertiary">Operación</p><h2 className="mt-1 font-headline text-2xl font-semibold text-white">Crear campaña</h2></div>
                  <button aria-label="Cerrar formulario" onClick={() => setIsModalOpen(false)} className="rounded-xl p-2 text-on-surface-variant transition-colors hover:bg-surface-bright hover:text-white focus-visible:outline-2 focus-visible:outline-tertiary">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form 
                  onSubmit={(e: any) => {
                    e.preventDefault();
                    const formData = new FormData(e.target);
                    createMutation.mutate({
                      name: formData.get('name'),
                      description: formData.get('description'),
                      goalAmount: Number(formData.get('goalAmount')),
                      endDate: formData.get('endDate') ? new Date(formData.get('endDate') as string).toISOString() : undefined,
                    });
                  }} 
                  className="space-y-6"
                >
                  <div>
                    <label className="mb-2 block text-sm font-medium text-on-surface">Nombre de la campaña</label>
                    <input name="name" required className="w-full rounded-xl bg-surface-container-high px-4 py-3.5 text-white placeholder:text-on-surface-variant/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tertiary" placeholder="Ej.: Reforestación del parque" />
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-on-surface">Meta en pesos chilenos</label>
                      <input name="goalAmount" type="number" min="1" step="1" required className="w-full rounded-xl bg-surface-container-high px-4 py-3.5 text-white placeholder:text-on-surface-variant/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tertiary" placeholder="1000000" />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-on-surface">Fecha límite</label>
                      <input name="endDate" type="date" className="w-full rounded-xl bg-surface-container-high px-4 py-3.5 text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tertiary" />
                    </div>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-on-surface">Descripción</label>
                    <textarea name="description" rows={3} className="w-full resize-y rounded-xl bg-surface-container-high px-4 py-3.5 text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tertiary" />
                  </div>

                  {createMutation.isError && <p role="alert" className="text-sm text-error">No pudimos crear la campaña. Revisa los datos e inténtalo de nuevo.</p>}
                  <button
                    disabled={createMutation.isPending}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-tertiary py-3.5 font-semibold text-on-tertiary transition-colors hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tertiary disabled:opacity-50"
                  >
                    {createMutation.isPending ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                      <>
                        <Check className="w-6 h-6" />
                        Lanzar Campaña
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

const CampaignCard = ({ campaign }: { campaign: any }) => {
  const goal = Number(campaign.goalAmount || 0);
  const current = Number(campaign.currentAmount || 0);
  const progress = goal > 0 ? Math.min((current / goal) * 100, 100) : 0;
  const statusLabel = campaign.status === 'ACTIVE' ? 'En curso' : campaign.status === 'CANCELLED' ? 'Cancelada' : 'Completada';
  
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card relative overflow-hidden rounded-2xl p-5 sm:p-7"
    >
      <div className="absolute right-0 top-0 p-6 text-tertiary/10" aria-hidden="true">
        <Target className="h-24 w-24" />
      </div>

      <div className="relative z-10">
        <div className="mb-5 flex items-start justify-between gap-4">
          <h3 className="font-headline text-xl font-semibold text-white sm:text-2xl">{campaign.name}</h3>
          <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
            campaign.status === 'ACTIVE' ? 'bg-secondary/10 text-secondary' : 'bg-gray-500/10 text-gray-500'
          }`}>
            {statusLabel}
          </span>
        </div>

        <p className="mb-7 line-clamp-2 min-h-10 text-sm leading-relaxed text-on-surface-variant">
          {campaign.description || 'Sin descripción detallada.'}
        </p>

        <div className="space-y-5">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="mb-1 text-xs text-on-surface-variant">Recaudado</p>
              <p className="font-headline text-2xl font-semibold text-white">{new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(current)}</p>
            </div>
            <div className="text-right">
              <p className="mb-1 text-xs text-on-surface-variant">Meta {new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(goal)}</p>
              <p className="font-semibold text-tertiary">{progress.toFixed(0)}%</p>
            </div>
          </div>

          <div role="progressbar" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100} aria-label={`Progreso de ${campaign.name}`} className="h-2.5 w-full overflow-hidden rounded-full bg-surface-container-highest">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className={`h-full rounded-full ${progress >= 100 ? 'bg-secondary' : 'bg-tertiary'}`}
            />
          </div>

          <div className="flex gap-6 pt-2">
            <div className="flex items-center gap-2">
              <Calendar aria-hidden="true" className="h-4 w-4 text-on-surface-variant" />
              <span className="text-xs text-on-surface-variant">
                {campaign.endDate ? `Hasta ${new Intl.DateTimeFormat('es-CL', { dateStyle: 'medium' }).format(new Date(campaign.endDate))}` : 'Sin fecha límite'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
