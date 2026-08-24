import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  TrendingUp, 
  Users, 
  Target, 
  Activity, 
  ArrowUpRight, 
  DollarSign 
} from 'lucide-react';
import client from '../api/client';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon: Icon, color, delay }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="glass-card p-6 rounded-3xl flex items-center gap-6"
  >
    <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center shadow-lg`}>
      <Icon className="w-7 h-7 text-white" />
    </div>
    <div>
      <p className="text-gray-500 text-sm font-bold uppercase tracking-wider">{title}</p>
      <h3 className="text-3xl font-black text-white mt-1">{value}</h3>
    </div>
  </motion.div>
);

export const Overview: React.FC = () => {
  const { data: summary, isLoading } = useQuery({
    queryKey: ['org-summary'],
    queryFn: async () => {
      const { data } = await client.get('/organizations/me/summary');
      return data;
    },
  });

  const { data: recentDonations = [], isLoading: isLoadingDonations } = useQuery({
    queryKey: ['recent-donations'],
    queryFn: async () => {
      const { data } = await client.get('/donations');
      return Array.isArray(data) ? data.slice(0, 3) : [];
    },
  });

  if (isLoading) return <div className="text-white">Cargando métricas...</div>;

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter">
          Panel de <span className="text-primary">Control</span>
        </h1>
        <p className="text-gray-500 font-medium mt-2">Bienvenido de nuevo al Steward Protocol v1.0</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Recaudación Total" 
          value={`$${summary?.totalAmount?.toLocaleString() || 0}`} 
          icon={DollarSign} 
          color="bg-primary"
          delay={0.1}
        />
        <StatCard 
          title="Donaciones" 
          value={summary?.donationsCount || 0} 
          icon={TrendingUp} 
          color="bg-secondary"
          delay={0.2}
        />
        <StatCard 
          title="Miembros Activos" 
          value={summary?.membersCount || 0} 
          icon={Users} 
          color="bg-tertiary"
          delay={0.3}
        />
        <StatCard 
          title="Campañas" 
          value={summary?.campaignsCount || 0} 
          icon={Target} 
          color="bg-surface-bright"
          delay={0.4}
        />
      </div>

      <div className="glass-card p-8 rounded-3xl">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-black text-white flex items-center gap-2">
            <Activity className="text-primary w-6 h-6" />
            Actividad Reciente
          </h2>
          <button className="text-primary text-sm font-bold flex items-center gap-1 hover:underline">
            Ver todo <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-4">
          {isLoadingDonations ? (
            <p className="text-gray-500 text-sm">Cargando actividad...</p>
          ) : recentDonations.length === 0 ? (
            <p className="text-gray-500 text-sm">Sin actividad reciente — las donaciones aparecerán aquí.</p>
          ) : (
            recentDonations.map((d: any) => {
              const donor = d.member ? `${d.member.firstName} ${d.member.lastName}` : 'Donante Anónimo';
              const amount = Number(d.amount).toLocaleString('es-CL');
              const date = new Date(d.createdAt).toLocaleDateString('es-CL');
              return (
                <div key={d.id} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                  <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-secondary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-bold text-sm">{donor}</p>
                    <p className="text-gray-500 text-xs">{date} · {d.status}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-secondary font-black">+${amount}</p>
                    <p className="text-gray-600 text-[10px] uppercase font-bold">{d.campaign?.name || 'Aporte general'}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
