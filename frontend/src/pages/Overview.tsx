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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-card p-8 rounded-3xl">
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
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-secondary" />
                </div>
                <div className="flex-1">
                  <p className="text-white font-bold text-sm">Donación recibida</p>
                  <p className="text-gray-500 text-xs">Hace {i * 10} minutos</p>
                </div>
                <div className="text-right">
                  <p className="text-secondary font-black">+$25.000</p>
                  <p className="text-gray-600 text-[10px] uppercase font-bold">Completado</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-8 rounded-3xl bg-primary/5 border-primary/10">
          <h2 className="text-xl font-black text-white mb-6 uppercase tracking-tighter italic">Salud de la Organización</h2>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-xs font-bold uppercase mb-2">
                <span className="text-gray-400">Meta Mensual</span>
                <span className="text-primary">65%</span>
              </div>
              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-primary w-[65%] rounded-full shadow-[0_0_10px_rgba(0,168,255,0.5)]" />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-bold uppercase mb-2">
                <span className="text-gray-400">Retención de Socios</span>
                <span className="text-secondary">92%</span>
              </div>
              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-secondary w-[92%] rounded-full shadow-[0_0_10px_rgba(0,212,170,0.5)]" />
              </div>
            </div>
          </div>
          
          <div className="mt-10 p-6 rounded-2xl bg-white/5 border border-white/5">
            <p className="text-gray-400 text-xs font-bold uppercase mb-2 italic">IA Insight</p>
            <p className="text-white text-sm leading-relaxed">
              Las donaciones han aumentado un **12%** respecto a la semana pasada. Considera lanzar la campaña de reforestación pronto.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
