import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Search, 
  Download, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Loader2, 
  Calendar, 
  Plus, 
  X, 
  Check 
} from 'lucide-react';
import client from '../api/client';
import { motion, AnimatePresence } from 'framer-motion';

interface DonationMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface DonationCampaign {
  id: string;
  name: string;
}

interface DonationItem {
  id: string;
  amount: number | string;
  status: string;
  createdAt: string;
  member?: DonationMember;
  campaign?: DonationCampaign;
  gatewayRef?: string;
}

interface CampaignOption {
  id: string;
  name: string;
}

interface MemberOption {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

const StatusBadge = ({ status }: { status: string }) => {
  const configs: Record<string, { icon: React.ComponentType<{ className?: string }>; text: string; class: string }> = {
    SUCCEEDED: { icon: CheckCircle2, text: 'Completado', class: 'bg-secondary/10 text-secondary' },
    PENDING: { icon: Clock, text: 'Pendiente', class: 'bg-tertiary/10 text-tertiary' },
    FAILED: { icon: XCircle, text: 'Fallido', class: 'bg-error/10 text-error' },
  };

  const config = configs[status] || configs.PENDING;
  const Icon = config.icon;

  return (
    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${config.class}`}>
      <Icon className="w-3 h-3" />
      {config.text}
    </div>
  );
};

export const Donations: React.FC = () => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [amount, setAmount] = useState('75000');
  const [selectedCampaignId, setSelectedCampaignId] = useState('');
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [confirmImmediately, setConfirmImmediately] = useState(true);

  const queryClient = useQueryClient();

  const { data: donations = [], isLoading } = useQuery({
    queryKey: ['donations'],
    queryFn: async () => {
      const { data } = await client.get('/donations');
      return data;
    },
  });

  const { data: campaigns = [] } = useQuery({
    queryKey: ['campaigns'],
    queryFn: async () => {
      const { data } = await client.get('/campaigns');
      return Array.isArray(data) ? data : [];
    },
  });

  const { data: membersData = [] } = useQuery({
    queryKey: ['members'],
    queryFn: async () => {
      const { data } = await client.get('/members');
      return Array.isArray(data) ? data : (data?.items || []);
    },
  });

  const loadSuggestion = () => {
    setAmount('120000');
    if (campaigns.length > 0) {
      setSelectedCampaignId(campaigns[0].id);
    }
    if (membersData.length > 0) {
      setSelectedMemberId(membersData[0].id);
    }
    setConfirmImmediately(true);
  };

  const createDonationMutation = useMutation({
    mutationFn: async (payload: { amount: number; campaignId?: string; memberId?: string; markAsSucceeded?: boolean }) => {
      const { data } = await client.post('/donations', {
        amount: payload.amount,
        campaignId: payload.campaignId || undefined,
        memberId: payload.memberId || undefined,
        currency: 'CLP',
      });

      if (payload.markAsSucceeded && data?.gatewayRef) {
        await client.post('/donations/callback', {
          gatewayRef: data.gatewayRef,
          status: 'SUCCEEDED',
        });
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['donations'] });
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      queryClient.invalidateQueries({ queryKey: ['org-summary'] });
      queryClient.invalidateQueries({ queryKey: ['recent-donations'] });
      setIsModalOpen(false);
    },
  });

  const filteredDonations = donations.filter((d: DonationItem) => {
    const donorName = d.member ? `${d.member.firstName} ${d.member.lastName}` : 'Donante Anónimo';
    const donorEmail = d.member?.email || '';

    const matchesSearch = 
      donorName.toLowerCase().includes(search.toLowerCase()) ||
      donorEmail.toLowerCase().includes(search.toLowerCase()) ||
      d.id.includes(search);
    
    const matchesFilter = filter === 'ALL' || d.status === filter;
    
    return matchesSearch && matchesFilter;
  });

  const handleExportCsv = () => {
    const rows = filteredDonations.map((d: DonationItem) => {
      const donor = d.member ? `${d.member.firstName} ${d.member.lastName}` : 'Donante Anónimo';
      const email = d.member?.email || '';
      const campaign = d.campaign?.name || 'Aporte General';
      return [d.id, donor, email, Number(d.amount).toString(), d.status, new Date(d.createdAt).toISOString(), campaign].map(v => `"${String(v).replace(/"/g, '""')}"`).join(',');
    });
    const header = ['id','donante','email','monto','estado','fecha','campaña'].join(',');
    const csv = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `donaciones-${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter">
            Gestión de <span className="text-primary">Donaciones</span>
          </h1>
          <p className="text-gray-500 font-medium mt-2">Seguimiento de aportes y transacciones financieras en tiempo real.</p>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={handleExportCsv} className="bg-white/5 text-white px-6 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-white/10 transition-colors border border-white/5">
            <Download className="w-5 h-5" />
            Exportar CSV
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-primary text-on-primary px-6 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:scale-[0.98] transition-transform shadow-lg shadow-primary/20"
          >
            <Plus className="w-5 h-5" />
            Registrar Donación
          </button>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Buscar por donante, email o ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-surface-container-low border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>

        <div className="flex gap-2 p-1 bg-surface-container-low border border-white/5 rounded-2xl">
          {['ALL', 'SUCCEEDED', 'PENDING', 'FAILED'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                filter === f ? 'bg-primary text-on-primary shadow-lg shadow-primary/20' : 'text-gray-500 hover:text-white'
              }`}
            >
              {f === 'ALL' ? 'Todos' : f === 'SUCCEEDED' ? 'Exitosos' : f === 'PENDING' ? 'Pendientes' : 'Fallidos'}
            </button>
          ))}
        </div>
      </div>

      <div className="glass-card rounded-[32px] overflow-hidden border border-white/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 bg-white/5">
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-500">Donante</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-500">Monto</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-500">Estado</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-500">Fecha</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-500">Campaña</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-500"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
                  </td>
                </tr>
              ) : filteredDonations.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center text-gray-500 font-medium">
                    No se encontraron donaciones con los filtros aplicados.
                  </td>
                </tr>
              ) : (
                filteredDonations.map((d: DonationItem) => {
                  const name = d.member ? `${d.member.firstName} ${d.member.lastName}` : 'Donante Anónimo';
                  const email = d.member?.email || 'N/A';
                  return (
                    <motion.tr 
                      key={d.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-white/[0.02] transition-colors group"
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold border border-primary/20">
                            {name[0]}
                          </div>
                          <div>
                            <p className="text-white font-bold text-sm">{name}</p>
                            <p className="text-gray-500 text-xs">{email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <p className="text-white font-black text-lg">${Number(d.amount).toLocaleString()}</p>
                        <p className="text-gray-600 text-[10px] font-bold uppercase tracking-tighter">Pesos Chilenos</p>
                      </td>
                      <td className="px-8 py-6">
                        <StatusBadge status={d.status} />
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2 text-gray-400">
                          <Calendar className="w-4 h-4" />
                          <span className="text-xs font-medium">{new Date(d.createdAt).toLocaleDateString()}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">
                          {d.campaign?.name || 'Aporte General'}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <button className="p-2 hover:bg-white/5 rounded-lg transition-colors text-gray-500 hover:text-white">
                          <ExternalLink className="w-5 h-5" />
                        </button>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <footer className="flex items-center justify-between text-gray-600 text-xs font-bold uppercase tracking-widest">
        <p>Total registros: {filteredDonations.length}</p>
      </footer>

      {/* Modal de Registro de Donación */}
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
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-3xl font-black text-white uppercase italic">Registrar <span className="text-primary">Donación</span></h2>
                    <p className="text-gray-400 text-xs mt-1">Ingresa un aporte con trazabilidad de campaña y donante.</p>
                  </div>
                  <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-white/5 rounded-full transition-colors text-gray-500">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="mb-6 flex justify-end">
                  <button
                    type="button"
                    onClick={loadSuggestion}
                    className="text-[11px] font-bold text-primary bg-primary/10 hover:bg-primary/20 border border-primary/30 px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1.5"
                  >
                    <span>⚡ Cargar sugerencia real</span>
                  </button>
                </div>

                <form 
                  onSubmit={(e: React.FormEvent) => {
                    e.preventDefault();
                    createDonationMutation.mutate({
                      amount: Number(amount),
                      campaignId: selectedCampaignId || undefined,
                      memberId: selectedMemberId || undefined,
                      markAsSucceeded: confirmImmediately,
                    });
                  }} 
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">Monto ($ CLP)</label>
                    <input 
                      name="amount" 
                      type="number" 
                      required 
                      min="1000" 
                      step="500" 
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white focus:outline-none focus:border-primary/50 transition-colors text-xl font-bold" 
                      placeholder="50000" 
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">Campaña de Destino</label>
                    <select 
                      name="campaignId" 
                      value={selectedCampaignId}
                      onChange={(e) => setSelectedCampaignId(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white focus:outline-none focus:border-primary/50 transition-colors appearance-none"
                    >
                      <option value="" className="bg-[#1c1b1b]">Aporte General (Sin campaña específica)</option>
                      {campaigns.map((c: CampaignOption) => (
                        <option key={c.id} value={c.id} className="bg-[#1c1b1b]">{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">Donante / Socio (Opcional)</label>
                    <select 
                      name="memberId" 
                      value={selectedMemberId}
                      onChange={(e) => setSelectedMemberId(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white focus:outline-none focus:border-primary/50 transition-colors appearance-none"
                    >
                      <option value="" className="bg-[#1c1b1b]">Donante Anónimo / Externo</option>
                      {membersData.map((m: MemberOption) => (
                        <option key={m.id} value={m.id} className="bg-[#1c1b1b]">{m.firstName} {m.lastName} ({m.email})</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/5">
                    <input 
                      type="checkbox" 
                      id="confirmImmediately" 
                      name="confirmImmediately" 
                      checked={confirmImmediately}
                      onChange={(e) => setConfirmImmediately(e.target.checked)}
                      className="w-5 h-5 rounded accent-primary cursor-pointer" 
                    />
                    <label htmlFor="confirmImmediately" className="text-xs font-bold text-gray-300 cursor-pointer">
                      Confirmar e incrementar recaudación de inmediato (Completado)
                    </label>
                  </div>

                  <button
                    disabled={createDonationMutation.isPending}
                    className="w-full bg-primary text-on-primary py-5 rounded-2xl font-bold flex items-center justify-center gap-2 hover:scale-[0.98] transition-transform disabled:opacity-50"
                  >
                    {createDonationMutation.isPending ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                      <>
                        <Check className="w-6 h-6" />
                        Registrar Aporte
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
