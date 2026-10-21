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
  UserPlus,
  Users,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import client from '../api/client';
import { motion, AnimatePresence } from 'framer-motion';

export const Members: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  const { data: memberPage, isLoading, isError } = useQuery({
    queryKey: ['members', page],
    queryFn: async () => {
      const { data } = await client.get('/members', { params: { page, pageSize: 20 } });
      return data;
    },
  });
  const members = memberPage?.items ?? [];

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
      <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-3 text-sm font-semibold text-secondary">Comunidad</p>
          <h1 className="font-headline text-3xl font-semibold tracking-tight text-white sm:text-4xl">Miembros</h1>
          <p className="mt-3 max-w-2xl text-on-surface-variant">Gestiona las personas que colaboran con tu organización.</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-secondary px-5 py-3 font-semibold text-on-secondary transition-colors hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
        >
          <UserPlus className="w-5 h-5" />
          Registrar Miembro
        </button>
      </header>

      <div className="glass-card flex flex-col gap-3 rounded-2xl p-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Buscar por nombre o email..."
            value={search}
            onChange={(e) => { setPage(1); setSearch(e.target.value); }}
            aria-label="Buscar miembros por nombre o correo"
            className="w-full rounded-xl bg-surface-container-high py-3.5 pl-12 pr-4 text-white placeholder:text-on-surface-variant/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
          />
        </div>

        <div className="flex gap-1 overflow-x-auto rounded-xl bg-surface-container-high p-1" role="group" aria-label="Filtrar miembros por tipo">
          {['ALL', 'VOLUNTEER', 'PARTNER'].map((t) => (
            <button
              key={t}
              onClick={() => { setPage(1); setTypeFilter(t); }}
              aria-pressed={typeFilter === t}
              className={`whitespace-nowrap rounded-lg px-3 py-2.5 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary ${
                typeFilter === t ? 'bg-surface-bright text-white' : 'text-on-surface-variant hover:text-white'
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
      ) : isError ? (
        <p role="alert" className="rounded-2xl bg-error-container/40 p-5 text-sm text-error">No pudimos cargar el directorio. Vuelve a intentarlo.</p>
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 2xl:grid-cols-3">
          <AnimatePresence>
            {filteredMembers.map((m: any) => (
              <motion.div
                key={m.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glass-card flex items-start gap-4 rounded-2xl p-5 transition-colors hover:bg-surface-container-high"
              >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-secondary/10 text-base font-semibold text-secondary">
                  {m.firstName?.[0]}{m.lastName?.[0]}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-white truncate">{m.firstName} {m.lastName}</h3>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${
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

                  <div className="mt-4 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-1.5 text-xs text-on-surface-variant">
                      <ShieldCheck className="h-4 w-4 text-secondary" />
                      {m.status === 'ACTIVE' ? 'Activo' : 'Inactivo'}
                    </div>
                    <button onClick={() => setSelectedMember(m)} className="rounded-lg px-2 py-1 text-sm font-medium text-primary-fixed-dim hover:bg-surface-bright focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">Ver perfil</button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {filteredMembers.length === 0 && (
            <div className="col-span-full rounded-2xl bg-surface-container px-6 py-12 text-center">
              <Users aria-hidden="true" className="mx-auto h-7 w-7 text-secondary" />
              <p className="mt-3 font-medium text-white">No encontramos miembros</p>
              <p className="mt-1 text-sm text-on-surface-variant">Prueba con otro nombre o cambia el filtro.</p>
            </div>
          )}
        </div>
      )}

      {!isLoading && !isError && (memberPage?.meta?.totalPages ?? 0) > 1 && (
        <nav aria-label="Páginas de miembros" className="flex items-center justify-between rounded-2xl bg-surface-container px-4 py-3 text-sm">
          <span className="text-on-surface-variant">Página {memberPage.meta.page} de {memberPage.meta.totalPages} · {memberPage.meta.total} miembros</span>
          <div className="flex gap-2">
            <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="flex items-center gap-1 rounded-lg px-3 py-2 text-on-surface-variant hover:bg-surface-container-high disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-primary"><ChevronLeft className="h-4 w-4" /> Anterior</button>
            <button disabled={page >= memberPage.meta.totalPages} onClick={() => setPage((p) => p + 1)} className="flex items-center gap-1 rounded-lg px-3 py-2 text-on-surface-variant hover:bg-surface-container-high disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-primary">Siguiente <ChevronRight className="h-4 w-4" /></button>
          </div>
        </nav>
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
              className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl bg-surface-container shadow-2xl"
            >
              <div className="p-8 md:p-12">
                <div className="mb-8 flex items-center justify-between gap-4">
                  <div><p className="text-sm font-semibold text-secondary">Comunidad</p><h2 className="mt-1 font-headline text-2xl font-semibold text-white">Registrar miembro</h2></div>
                  <button aria-label="Cerrar formulario" onClick={() => setIsModalOpen(false)} className="rounded-xl p-2 text-on-surface-variant transition-colors hover:bg-surface-bright hover:text-white focus-visible:outline-2 focus-visible:outline-primary">
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
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-on-surface">Nombres</label>
                      <input name="firstName" autoComplete="given-name" required className="w-full rounded-xl bg-surface-container-high px-4 py-3.5 text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary" />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-on-surface">Apellidos</label>
                      <input name="lastName" autoComplete="family-name" required className="w-full rounded-xl bg-surface-container-high px-4 py-3.5 text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary" />
                    </div>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-on-surface">Correo electrónico</label>
                    <input name="email" type="email" autoComplete="email" required className="w-full rounded-xl bg-surface-container-high px-4 py-3.5 text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary" />
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-on-surface">Teléfono</label>
                      <input name="phone" type="tel" autoComplete="tel" className="w-full rounded-xl bg-surface-container-high px-4 py-3.5 text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary" />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-on-surface">Tipo</label>
                      <select name="type" className="w-full appearance-none rounded-xl bg-surface-container-high px-4 py-3.5 text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary">
                        <option value="VOLUNTEER" className="bg-surface">Voluntario</option>
                        <option value="PARTNER" className="bg-surface">Socio</option>
                      </select>
                    </div>
                  </div>

                  {createMutation.isError && <p role="alert" className="text-sm text-error">No pudimos registrar al miembro. Revisa los datos e inténtalo de nuevo.</p>}
                  <button
                    disabled={createMutation.isPending}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-secondary py-3.5 font-semibold text-on-secondary transition-colors hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary disabled:opacity-50"
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

      <AnimatePresence>
        {selectedMember && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" role="presentation">
            <motion.button aria-label="Cerrar perfil" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedMember(null)} className="absolute inset-0 bg-black/75 backdrop-blur-sm" />
            <motion.section role="dialog" aria-modal="true" aria-labelledby="member-profile-title" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }} className="glass-card relative w-full max-w-lg rounded-3xl p-6 shadow-2xl sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/10 font-semibold text-secondary">{selectedMember.firstName?.[0]}{selectedMember.lastName?.[0]}</div>
                  <div><p className="text-sm text-secondary">Perfil de miembro</p><h2 id="member-profile-title" className="mt-1 font-headline text-xl font-semibold text-white">{selectedMember.firstName} {selectedMember.lastName}</h2></div>
                </div>
                <button aria-label="Cerrar perfil" onClick={() => setSelectedMember(null)} className="rounded-xl p-2 text-on-surface-variant hover:bg-surface-bright hover:text-white focus-visible:outline-2 focus-visible:outline-primary"><X className="h-5 w-5" /></button>
              </div>
              <dl className="mt-7 space-y-4 rounded-2xl bg-surface-container-high p-5 text-sm">
                <div><dt className="text-on-surface-variant">Tipo</dt><dd className="mt-1 font-medium text-white">{selectedMember.type === 'VOLUNTEER' ? 'Voluntario' : 'Socio'}</dd></div>
                <div><dt className="text-on-surface-variant">Correo</dt><dd className="mt-1 break-all font-medium text-white">{selectedMember.email}</dd></div>
                {selectedMember.phone && <div><dt className="text-on-surface-variant">Teléfono</dt><dd className="mt-1 font-medium text-white">{selectedMember.phone}</dd></div>}
                {selectedMember.rut && <div><dt className="text-on-surface-variant">RUT</dt><dd className="mt-1 font-medium text-white">{selectedMember.rut}</dd></div>}
                <div><dt className="text-on-surface-variant">Estado</dt><dd className="mt-1 font-medium text-white">{selectedMember.status === 'ACTIVE' ? 'Activo' : 'Inactivo'}</dd></div>
              </dl>
            </motion.section>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
