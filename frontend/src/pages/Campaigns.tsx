import React, { useEffect, useState, type FormEvent } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Target, 
  Plus, 
  Calendar, 
  X, 
  Check, 
  Loader2,
  AlertCircle,
  Sparkles,
  Inbox,
  Sprout,
} from 'lucide-react';
import client from '../api/client';
import { motion, AnimatePresence } from 'framer-motion';

type CampaignStatus = 'ACTIVE' | 'COMPLETED' | 'CANCELLED' | string;

type Campaign = {
  id: string;
  name: string;
  description?: string | null;
  goalAmount: number | string;
  currentAmount?: number | string | null;
  endDate?: string | null;
  status: CampaignStatus;
};

type CreateCampaignPayload = {
  name: string;
  description?: string;
  goalAmount: number;
  endDate?: string;
};

export const Campaigns: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [goalAmount, setGoalAmount] = useState('');
  const [endDate, setEndDate] = useState('');
  const [description, setDescription] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!isModalOpen) return;

    const closeWithEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsModalOpen(false);
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', closeWithEscape);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', closeWithEscape);
    };
  }, [isModalOpen]);

  const { data: campaigns = [], isLoading } = useQuery<Campaign[]>({
    queryKey: ['campaigns'],
    queryFn: async () => {
      const { data } = await client.get('/campaigns');
      return data;
    },
  });

  const loadSuggestion = () => {
    setName('Restauración del Humedal Rocuant-Andalién 2026');
    setGoalAmount('18000000');
    // Fecha en 6 meses más
    const d = new Date();
    d.setMonth(d.getMonth() + 6);
    setEndDate(d.toISOString().slice(0, 10));
    setDescription('Campaña comunitaria para erradicación de microbasurales, instalación de miradores ecológicos e inserción de 3.500 especies arbustivas nativas en la cuenca costera.');
  };

  const createMutation = useMutation<Campaign, unknown, CreateCampaignPayload>({
    mutationFn: async (newCampaign) => {
      const { data } = await client.post('/campaigns', newCampaign);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      setIsModalOpen(false);
      setName('');
      setGoalAmount('');
      setEndDate('');
      setDescription('');
      setFeedback({
        type: 'success',
        message: 'Tu campaña ya está en marcha. Acabas de abrir una nueva oportunidad para movilizar apoyo y transformar este entorno.',
      });
    },
    onError: () => {
      setFeedback({ type: 'error', message: 'No pudimos crear la campaña. Revisa los datos e inténtalo nuevamente.' });
    },
  });

  const openModal = () => {
    setFeedback(null);
    createMutation.reset();
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (createMutation.isPending) return;
    setIsModalOpen(false);
  };

  const submitCampaign = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const amount = Number(goalAmount);

    if (!name.trim() || !Number.isFinite(amount) || amount <= 0) {
      setFeedback({ type: 'error', message: 'Ingresa un nombre y una meta mayor que cero.' });
      return;
    }

    createMutation.mutate({
      name: name.trim(),
      description: description.trim() || undefined,
      goalAmount: amount,
      endDate: endDate ? new Date(endDate).toISOString() : undefined,
    });
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter">
            Campañas que <span className="text-tertiary">movilizan</span>
          </h1>
          <p className="mt-2 max-w-2xl font-medium leading-relaxed text-gray-500">
            Convierte una necesidad urgente en una misión compartida. Cada aporte acerca a tu comunidad a un entorno más limpio, justo y vivo.
          </p>
        </div>

        <button
          onClick={openModal}
          className="bg-tertiary text-on-tertiary px-6 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:scale-[0.98] transition-transform shadow-lg shadow-tertiary/20"
        >
          <Plus className="w-5 h-5" />
          Nueva Campaña
        </button>
      </header>

      {feedback && !isModalOpen && (
        <div className={`flex items-start gap-3 rounded-2xl px-5 py-4 text-sm ${feedback.type === 'success' ? 'bg-secondary/10 text-secondary' : 'bg-error/10 text-error'}`} role="status">
          {feedback.type === 'success' ? <Check className="mt-0.5 h-5 w-5 shrink-0" /> : <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />}
          <span>{feedback.message}</span>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center p-20">
          <Loader2 className="w-10 h-10 animate-spin text-tertiary" />
        </div>
      ) : (
        campaigns.length === 0 ? (
          <div className="glass-card rounded-[32px] border border-white/5 px-6 py-20 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-tertiary/10 text-tertiary">
              <Inbox className="h-8 w-8" />
            </div>
            <h2 className="text-xl font-black text-white">Toda transformación comienza con una causa</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-gray-500">
              Cuenta qué lugar, comunidad o ecosistema necesita ayuda. Una meta clara puede convertir esa intención en acción colectiva.
            </p>
            <button onClick={openModal} className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-tertiary px-5 py-3 text-sm font-bold text-on-tertiary transition-transform hover:scale-[0.98]">
              <Sprout className="h-4 w-4" /> Dar vida a la primera campaña
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {campaigns.map((c) => <CampaignCard key={c.id} campaign={c} />)}
          </div>
        )
      )}

      {/* Modal de Creación */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-xl glass-card rounded-[40px] border border-white/10 shadow-2xl overflow-hidden"
            >
              <div role="dialog" aria-modal="true" aria-labelledby="campaign-modal-title" className="max-h-[90vh] overflow-y-auto p-8 md:p-12">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 id="campaign-modal-title" className="text-3xl font-black text-white uppercase italic">Crear <span className="text-tertiary">Campaña</span></h2>
                    <p className="mt-1 text-xs text-gray-400">Dale a tu comunidad una causa concreta por la cual movilizarse.</p>
                  </div>
                  <button type="button" onClick={closeModal} aria-label="Cerrar ventana" className="p-3 hover:bg-white/5 rounded-full transition-colors text-gray-500">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="mb-6 flex justify-end">
                  <button
                    type="button"
                    onClick={loadSuggestion}
                    className="text-[11px] font-bold text-tertiary bg-tertiary/10 hover:bg-tertiary/20 border border-tertiary/30 px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1.5"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Cargar sugerencia real</span>
                  </button>
                </div>

                <form 
                  onSubmit={submitCampaign}
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest font-sans">Nombre de la Campaña</label>
                    <input 
                      name="name" 
                      required 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white focus:outline-none focus:border-tertiary/50 transition-colors" 
                      placeholder="Ej: Reforestación Bosque Nativo" 
                      autoFocus
                    />
                  </div>
                  {feedback && isModalOpen && (
                    <div className={`flex items-start gap-3 rounded-2xl px-4 py-3 text-sm ${feedback.type === 'error' ? 'bg-error/10 text-error' : 'bg-secondary/10 text-secondary'}`} role="alert">
                      {feedback.type === 'error' ? <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> : <Check className="mt-0.5 h-4 w-4 shrink-0" />}
                      <span>{feedback.message}</span>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest font-sans">Meta ($ CLP)</label>
                      <input 
                        name="goalAmount" 
                        type="number" 
                        required 
                        value={goalAmount}
                        onChange={(e) => setGoalAmount(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white focus:outline-none focus:border-tertiary/50 transition-colors" 
                        placeholder="18.000.000" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest font-sans">Fecha Límite</label>
                      <input 
                        name="endDate" 
                        type="date" 
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white focus:outline-none focus:border-tertiary/50 transition-colors" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest font-sans">Descripción</label>
                    <textarea 
                      name="description" 
                      rows={3} 
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white focus:outline-none focus:border-tertiary/50 transition-colors" 
                      placeholder="Objetivos de la campaña..."
                    />
                  </div>

                  <button
                    disabled={createMutation.isPending}
                    className="w-full bg-tertiary text-on-tertiary py-5 rounded-2xl font-bold flex items-center justify-center gap-2 hover:scale-[0.98] transition-transform disabled:opacity-50"
                  >
                    {createMutation.isPending ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                      <>
                        <Check className="w-6 h-6" />
                        Poner campaña en marcha
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

const CampaignCard = ({ campaign }: { campaign: Campaign }) => {
  const goal = Number(campaign.goalAmount || 0);
  const current = Number(campaign.currentAmount || 0);
  const progress = goal > 0 ? Math.min((current / goal) * 100, 100) : 0;
  const remaining = Math.max(goal - current, 0);
  const statusLabel = campaign.status === 'ACTIVE'
    ? 'En movimiento'
    : campaign.status === 'COMPLETED'
      ? 'Meta alcanzada'
      : campaign.status === 'CANCELLED'
        ? 'Cerrada'
        : campaign.status;
  const progressMessage = progress >= 100
    ? 'Meta alcanzada. Esta comunidad hizo posible el siguiente paso.'
    : progress >= 75
      ? 'El objetivo está muy cerca. El impulso colectivo ya se siente.'
      : progress >= 40
        ? 'La comunidad está tomando fuerza. Cada nuevo aporte amplía el impacto.'
        : progress > 0
          ? 'La transformación ya comenzó. Cada aporte acerca esta causa a su meta.'
          : 'Esta historia recién comienza. El primer aporte puede inspirar a muchos más.';
  
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
          <h3 className="text-2xl font-black text-white uppercase italic tracking-tight">{campaign.name}</h3>
          <span className={`shrink-0 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
            campaign.status === 'ACTIVE'
              ? 'bg-secondary/10 text-secondary'
              : campaign.status === 'COMPLETED'
                ? 'bg-primary/10 text-primary'
                : 'bg-gray-500/10 text-gray-500'
          }`}>
            {statusLabel}
          </span>
        </div>

        <p className="text-gray-400 text-sm mb-8 leading-relaxed line-clamp-2">
          {campaign.description || 'Sin descripción detallada.'}
        </p>

        <div className="space-y-6">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">Recaudado</p>
              <p className="text-3xl font-black text-white">${current.toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">Meta: ${goal.toLocaleString()}</p>
              <p className="text-tertiary font-black text-lg">{progress.toFixed(1)}%</p>
            </div>
          </div>

          <div
            className="h-4 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 p-1"
            role="progressbar"
            aria-label={`Progreso de ${campaign.name}`}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progress)}
          >
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className={`h-full rounded-full ${progress >= 100 ? 'bg-secondary' : 'bg-tertiary'} shadow-[0_0_15px_rgba(255,184,119,0.3)]`} 
            />
          </div>

          <div className="flex items-start gap-3 rounded-2xl bg-white/[0.03] px-4 py-3">
            <Sprout className={`mt-0.5 h-4 w-4 shrink-0 ${progress >= 100 ? 'text-secondary' : 'text-tertiary'}`} />
            <div>
              <p className="text-sm font-semibold leading-relaxed text-gray-300">{progressMessage}</p>
              {progress < 100 && goal > 0 && (
                <p className="mt-1 text-[11px] font-bold uppercase tracking-wider text-gray-600">
                  Faltan ${remaining.toLocaleString()} para completar la meta
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-6 pt-4 border-t border-white/5">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-xs font-bold text-gray-400">
                {campaign.endDate ? `Hasta ${new Date(campaign.endDate).toLocaleDateString()}` : 'Sin fecha límite'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
