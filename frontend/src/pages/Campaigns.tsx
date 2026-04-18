import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Target, 
  Plus, 
  Calendar, 
  TrendingUp, 
  X, 
  Check, 
  Loader2
} from 'lucide-react';
import client from '../api/client';
import { motion, AnimatePresence } from 'framer-motion';

export const Campaigns: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: campaigns = [], isLoading } = useQuery({
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
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter">
            Campañas <span className="text-tertiary">Activas</span>
          </h1>
          <p className="text-gray-500 font-medium mt-2">Metas de recaudación y proyectos de impacto social.</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-tertiary text-on-tertiary px-6 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:scale-[0.98] transition-transform shadow-lg shadow-tertiary/20"
        >
          <Plus className="w-5 h-5" />
          Nueva Campaña
        </button>
      </header>

      {isLoading ? (
        <div className="flex justify-center p-20">
          <Loader2 className="w-10 h-10 animate-spin text-tertiary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {campaigns.map((c: any) => (
            <CampaignCard key={c.id} campaign={c} />
          ))}
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
              className="relative w-full max-w-xl glass-card rounded-[40px] border border-white/10 shadow-2xl overflow-hidden"
            >
              <div className="p-8 md:p-12">
                <div className="flex justify-between items-center mb-10">
                  <h2 className="text-3xl font-black text-white uppercase italic">Crear <span className="text-tertiary">Campaña</span></h2>
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
                      description: formData.get('description'),
                      targetAmount: Number(formData.get('targetAmount')),
                      endDate: formData.get('endDate') ? new Date(formData.get('endDate') as string).toISOString() : undefined,
                    });
                  }} 
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">Título de la Campaña</label>
                    <input name="title" required className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white focus:outline-none focus:border-tertiary/50 transition-colors" placeholder="Ej: Reforestación Parque Central" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">Meta ($ CLP)</label>
                      <input name="targetAmount" type="number" required className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white focus:outline-none focus:border-tertiary/50 transition-colors" placeholder="1.000.000" />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">Fecha Límite</label>
                      <input name="endDate" type="date" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white focus:outline-none focus:border-tertiary/50 transition-colors" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">Descripción</label>
                    <textarea name="description" rows={3} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white focus:outline-none focus:border-tertiary/50 transition-colors" />
                  </div>

                  <button
                    disabled={createMutation.isPending}
                    className="w-full bg-tertiary text-on-tertiary py-5 rounded-2xl font-bold flex items-center justify-center gap-2 hover:scale-[0.98] transition-transform disabled:opacity-50"
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
  const progress = Math.min((campaign.currentAmount / campaign.targetAmount) * 100, 100);
  
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card rounded-[32px] p-8 border border-white/5 relative overflow-hidden group"
    >
      <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
        <Target className="w-32 h-32" />
      </div>

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-6">
          <h3 className="text-2xl font-black text-white uppercase italic tracking-tight">{campaign.title}</h3>
          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
            campaign.status === 'ACTIVE' ? 'bg-secondary/10 text-secondary' : 'bg-gray-500/10 text-gray-500'
          }`}>
            {campaign.status === 'ACTIVE' ? 'En Curso' : 'Finalizada'}
          </span>
        </div>

        <p className="text-gray-400 text-sm mb-8 leading-relaxed line-clamp-2">
          {campaign.description || 'Sin descripción detallada.'}
        </p>

        <div className="space-y-6">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">Recaudado</p>
              <p className="text-3xl font-black text-white">${campaign.currentAmount?.toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">Meta: ${campaign.targetAmount?.toLocaleString()}</p>
              <p className="text-tertiary font-black text-lg">{progress.toFixed(1)}%</p>
            </div>
          </div>

          <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 p-1">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className={`h-full rounded-full ${progress >= 100 ? 'bg-secondary' : 'bg-tertiary'} shadow-[0_0_15px_rgba(255,184,119,0.3)]`} 
            />
          </div>

          <div className="flex gap-6 pt-4 border-t border-white/5">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-xs font-bold text-gray-400">
                {campaign.endDate ? `Hasta ${new Date(campaign.endDate).toLocaleDateString()}` : 'Sin fecha límite'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-gray-500" />
              <span className="text-xs font-bold text-gray-400">Trend: +12% hoy</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
