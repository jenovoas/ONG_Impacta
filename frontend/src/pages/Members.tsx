import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Search, 
  Mail, 
  Phone, 
  ShieldCheck, 
  X, 
  Check, 
  Loader2,
  UserPlus
} from 'lucide-react';
import client from '../api/client';
import { motion, AnimatePresence } from 'framer-motion';

export const Members: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const queryClient = useQueryClient();

  const { data: members = [], isLoading } = useQuery({
    queryKey: ['members'],
    queryFn: async () => {
      const { data } = await client.get('/members');
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (newMember: any) => {
      const { data } = await client.post('/members', newMember);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
      setIsModalOpen(false);
    },
  });

  const filteredMembers = members.filter((m: any) => {
    const matchesSearch = 
      `${m.firstName} ${m.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'ALL' || m.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter">
            Directorio de <span className="text-secondary">Miembros</span>
          </h1>
          <p className="text-gray-500 font-medium mt-2">Gestión de voluntarios, socios y colaboradores activos.</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-secondary text-on-secondary px-6 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:scale-[0.98] transition-transform shadow-lg shadow-secondary/20"
        >
          <UserPlus className="w-5 h-5" />
          Registrar Miembro
        </button>
      </header>

      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Buscar por nombre o email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-surface-container-low border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-secondary/50 transition-colors"
          />
        </div>

        <div className="flex gap-2 p-1 bg-surface-container-low border border-white/5 rounded-2xl">
          {['ALL', 'VOLUNTEER', 'PARTNER'].map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                typeFilter === t ? 'bg-secondary text-on-secondary shadow-lg shadow-secondary/20' : 'text-gray-500 hover:text-white'
              }`}
            >
              {t === 'ALL' ? 'Todos' : t === 'VOLUNTEER' ? 'Voluntarios' : 'Socios'}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-20">
          <Loader2 className="w-10 h-10 animate-spin text-secondary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredMembers.map((m: any) => (
              <motion.div
                key={m.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glass-card p-6 rounded-[32px] border border-white/5 flex items-start gap-4 relative group"
              >
                <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary font-black text-xl border border-secondary/20 shrink-0">
                  {m.firstName?.[0]}{m.lastName?.[0]}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-white truncate">{m.firstName} {m.lastName}</h3>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter ${
                      m.type === 'VOLUNTEER' ? 'bg-primary/10 text-primary' : 'bg-tertiary/10 text-tertiary'
                    }`}>
                      {m.type === 'VOLUNTEER' ? 'Voluntario' : 'Socio'}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-gray-500">
                      <Mail className="w-3.5 h-3.5" />
                      <span className="text-xs truncate">{m.email}</span>
                    </div>
                    {m.phone && (
                      <div className="flex items-center gap-2 text-gray-500">
                        <Phone className="w-3.5 h-3.5" />
                        <span className="text-xs">{m.phone}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center">
                    <div className="flex items-center gap-1.5 text-[10px] font-black text-gray-600 uppercase">
                      <ShieldCheck className="w-3 h-3 text-secondary" />
                      Activo
                    </div>
                    <button className="text-[10px] font-black text-primary uppercase hover:underline">Ver Perfil</button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Modal de Registro */}
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
                  <h2 className="text-3xl font-black text-white uppercase italic">Registrar <span className="text-secondary">Miembro</span></h2>
                  <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-white/5 rounded-full transition-colors text-gray-500">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form 
                  onSubmit={(e: any) => {
                    e.preventDefault();
                    const formData = new FormData(e.target);
                    createMutation.mutate({
                      firstName: formData.get('firstName'),
                      lastName: formData.get('lastName'),
                      email: formData.get('email'),
                      phone: formData.get('phone'),
                      type: formData.get('type'),
                    });
                  }} 
                  className="space-y-6"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">Nombres</label>
                      <input name="firstName" required className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white focus:outline-none focus:border-secondary/50 transition-colors" />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">Apellidos</label>
                      <input name="lastName" required className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white focus:outline-none focus:border-secondary/50 transition-colors" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">Email</label>
                    <input name="email" type="email" required className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white focus:outline-none focus:border-secondary/50 transition-colors" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">Teléfono</label>
                      <input name="phone" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white focus:outline-none focus:border-secondary/50 transition-colors" />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">Tipo</label>
                      <select name="type" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white focus:outline-none focus:border-secondary/50 appearance-none">
                        <option value="VOLUNTEER" className="bg-surface">Voluntario</option>
                        <option value="PARTNER" className="bg-surface">Socio</option>
                      </select>
                    </div>
                  </div>

                  <button
                    disabled={createMutation.isPending}
                    className="w-full bg-secondary text-on-secondary py-5 rounded-2xl font-bold flex items-center justify-center gap-2 hover:scale-[0.98] transition-transform disabled:opacity-50"
                  >
                    {createMutation.isPending ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                      <>
                        <Check className="w-6 h-6" />
                        Finalizar Registro
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
