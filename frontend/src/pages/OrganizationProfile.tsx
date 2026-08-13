import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Building2, 
  Globe, 
  ExternalLink, 
  Copy, 
  Shield, 
  Mail,
  Lock,
  Loader2,
  CheckCircle
} from 'lucide-react';
import client from '../api/client';

export const OrganizationProfile: React.FC = () => {
  const { data: org, isLoading } = useQuery({
    queryKey: ['org-details'],
    queryFn: async () => {
      const { data } = await client.get('/organizations/me'); // Ajustar si el endpoint es distinto
      return data;
    },
  });

  if (isLoading) return <div className="flex justify-center p-20"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>;

  const publicUrl = `https://impacta.pinguinoseguro.cl/${org?.slug}`;

  return (
    <div className="max-w-4xl space-y-10">
      <header>
        <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter">
          Perfil de <span className="text-primary">Organización</span>
        </h1>
        <p className="text-gray-500 font-medium mt-2">Configuración de identidad y credenciales del sistema.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <section className="glass-card p-8 rounded-[32px] border border-white/5">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primary" />
              Información General
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Nombre de la ONG</label>
                <p className="text-xl font-bold text-white bg-white/5 p-4 rounded-2xl border border-white/5">{org?.name}</p>
              </div>
              
              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Slug del Sistema (ID Único)</label>
                <div className="flex items-center gap-3 bg-white/5 p-4 rounded-2xl border border-white/5">
                  <p className="text-primary font-mono font-bold flex-1">{org?.slug}</p>
                  <Lock className="w-4 h-4 text-gray-600" />
                </div>
              </div>
            </div>
          </section>

          <section className="glass-card p-8 rounded-[32px] border border-white/5">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Globe className="w-5 h-5 text-secondary" />
              Presencia Pública
            </h2>
            
            <div className="p-6 rounded-2xl bg-secondary/5 border border-secondary/10">
              <label className="block text-[10px] font-black text-secondary uppercase tracking-widest mb-3">Tu página pública de recaudación</label>
              <div className="flex items-center gap-3">
                <p className="text-white text-sm font-medium truncate flex-1">{publicUrl}</p>
                <button className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400">
                  <Copy className="w-4 h-4" />
                </button>
                <a href={publicUrl} target="_blank" rel="noreferrer" className="p-2 bg-secondary text-on-secondary rounded-lg hover:scale-105 transition-transform">
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <div className="glass-card p-8 rounded-[32px] border border-white/5 bg-primary/5 text-center">
            <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center border border-primary/20 mx-auto mb-4">
              <Shield className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-white font-black uppercase italic tracking-tighter">Estado: Verificado</h3>
            <p className="text-gray-500 text-xs mt-2 leading-relaxed">Tu organización cumple con los protocolos del **Steward Identity 2026**.</p>
          </div>

          <div className="glass-card p-6 rounded-[32px] border border-white/5 space-y-4">
            <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Soporte Técnico</h4>
            <div className="flex items-center gap-3 text-white">
              <Mail className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold">ayuda@impacta.cl</span>
            </div>
            <div className="flex items-center gap-3 text-white">
              <CheckCircle className="w-4 h-4 text-secondary" />
              <span className="text-xs font-bold">SLA: 99.9% Activo</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
