import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Search, 
  Download, 
  ExternalLink,
  CheckCircle2,
  Clock,
  XCircle,
  Loader2,
  Calendar
} from 'lucide-react';
import client from '../api/client';
import { motion } from 'framer-motion';

const StatusBadge = ({ status }: { status: string }) => {
  const configs: any = {
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

  const { data: donations = [], isLoading } = useQuery({
    queryKey: ['donations'],
    queryFn: async () => {
      const { data } = await client.get('/donations');
      return data;
    },
  });

  const filteredDonations = donations.filter((d: any) => {
    const matchesSearch = 
      d.donorName?.toLowerCase().includes(search.toLowerCase()) ||
      d.donorEmail?.toLowerCase().includes(search.toLowerCase()) ||
      d.id.includes(search);
    
    const matchesFilter = filter === 'ALL' || d.status === filter;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter">
            Gestión de <span className="text-primary">Donaciones</span>
          </h1>
          <p className="text-gray-500 font-medium mt-2">Seguimiento de aportes y transacciones financieras.</p>
        </div>

        <button className="bg-white/5 text-white px-6 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-white/10 transition-colors border border-white/5">
          <Download className="w-5 h-5" />
          Exportar CSV
        </button>
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
                filteredDonations.map((d: any) => (
                  <motion.tr 
                    key={d.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-white/[0.02] transition-colors group"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold border border-primary/20">
                          {d.donorName?.[0] || 'A'}
                        </div>
                        <div>
                          <p className="text-white font-bold text-sm">{d.donorName || 'Anónimo'}</p>
                          <p className="text-gray-500 text-xs">{d.donorEmail || 'Sin email'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-white font-black text-lg">${d.amount?.toLocaleString()}</p>
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
                        {d.campaign?.title || 'General'}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button className="p-2 hover:bg-white/5 rounded-lg transition-colors text-gray-500 hover:text-white">
                        <ExternalLink className="w-5 h-5" />
                      </button>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <footer className="flex items-center justify-between text-gray-600 text-xs font-bold uppercase tracking-widest">
        <p>Total registros: {filteredDonations.length}</p>
        <div className="flex gap-4">
          <button className="hover:text-white transition-colors">Anterior</button>
          <button className="text-white">1</button>
          <button className="hover:text-white transition-colors">Siguiente</button>
        </div>
      </footer>
    </div>
  );
};
