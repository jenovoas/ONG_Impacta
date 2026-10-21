import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Download, CheckCircle2, Clock, XCircle, Loader2, Calendar } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import client from '../api/client';

type Donation = {
  id: string;
  amount: number | string;
  createdAt: string;
  status: string;
  member?: { firstName: string; lastName: string; email: string } | null;
  campaign?: { name: string } | null;
};

const statuses: Record<string, { icon: LucideIcon; label: string; className: string }> = {
  SUCCEEDED: { icon: CheckCircle2, label: 'Completada', className: 'bg-secondary/10 text-secondary' },
  PENDING: { icon: Clock, label: 'Pendiente', className: 'bg-tertiary/10 text-tertiary' },
  FAILED: { icon: XCircle, label: 'Fallida', className: 'bg-error/10 text-error' },
};

const StatusBadge = ({ status }: { status: string }) => {
  const config = statuses[status] ?? statuses.PENDING;
  const Icon = config.icon;
  return <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${config.className}`}><Icon aria-hidden="true" className="h-3.5 w-3.5" />{config.label}</span>;
};

const formatCLP = (amount: number | string) => new Intl.NumberFormat('es-CL', {
  style: 'currency', currency: 'CLP', maximumFractionDigits: 0,
}).format(Number(amount));

export const Donations: React.FC = () => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('ALL');
  const { data: donations = [], isLoading, isError } = useQuery<Donation[]>({
    queryKey: ['donations'],
    queryFn: async () => {
      const { data } = await client.get('/donations');
      return data;
    },
  });

  const normalizedSearch = search.trim().toLowerCase();
  const filteredDonations = donations.filter((donation) => {
    const donorName = donation.member ? `${donation.member.firstName} ${donation.member.lastName}` : 'Donante anónimo';
    const matchesSearch = `${donorName} ${donation.member?.email ?? ''} ${donation.id}`.toLowerCase().includes(normalizedSearch);
    return matchesSearch && (filter === 'ALL' || donation.status === filter);
  });

  const handleExportCsv = () => {
    const rows = filteredDonations.map((donation) => {
      const donor = donation.member ? `${donation.member.firstName} ${donation.member.lastName}` : 'Donante Anónimo';
      const email = donation.member?.email || '';
      const campaign = donation.campaign?.name || 'Aporte General';
      return [donation.id, donor, email, Number(donation.amount).toString(), donation.status, new Date(donation.createdAt).toISOString(), campaign]
        .map((value) => `"${String(value).replace(/"/g, '""')}"`).join(',');
    });
    const csv = [['id', 'donante', 'email', 'monto', 'estado', 'fecha', 'campaña'].join(','), ...rows].join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `donaciones-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-3 text-sm font-semibold text-primary-fixed-dim">Operación</p>
          <h1 className="font-headline text-3xl font-semibold tracking-tight text-white sm:text-4xl">Donaciones</h1>
          <p className="mt-3 max-w-2xl text-on-surface-variant">Consulta los aportes recibidos y su estado de pago.</p>
        </div>
        <button onClick={handleExportCsv} disabled={!filteredDonations.length} className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-surface-container-high px-5 py-3 font-medium text-white transition-colors hover:bg-surface-bright focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50">
          <Download aria-hidden="true" className="h-4 w-4" /> Exportar CSV
        </button>
      </header>

      <section className="glass-card flex flex-col gap-3 rounded-2xl p-3 lg:flex-row" aria-label="Buscar y filtrar donaciones">
        <div className="relative min-w-0 flex-1">
          <Search aria-hidden="true" className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant" />
          <input type="search" aria-label="Buscar por donante, correo o identificador" placeholder="Buscar por donante, correo o identificador" value={search} onChange={(event) => setSearch(event.target.value)} className="w-full rounded-xl bg-surface-container-high py-3.5 pl-11 pr-4 text-white placeholder:text-on-surface-variant/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary" />
        </div>
        <div className="flex gap-1 overflow-x-auto rounded-xl bg-surface-container-high p-1" role="group" aria-label="Filtrar por estado">
          {['ALL', 'SUCCEEDED', 'PENDING', 'FAILED'].map((status) => (
            <button key={status} aria-pressed={filter === status} onClick={() => setFilter(status)} className={`whitespace-nowrap rounded-lg px-3 py-2.5 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${filter === status ? 'bg-surface-bright text-white' : 'text-on-surface-variant hover:text-white'}`}>
              {status === 'ALL' ? 'Todas' : statuses[status].label}
            </button>
          ))}
        </div>
      </section>

      <section className="glass-card overflow-hidden rounded-2xl" aria-label="Listado de donaciones">
        {isLoading ? (
          <div role="status" className="flex justify-center px-6 py-20"><Loader2 aria-hidden="true" className="h-7 w-7 animate-spin text-primary" /><span className="sr-only">Cargando donaciones</span></div>
        ) : isError ? (
          <p role="alert" className="px-6 py-12 text-center text-sm text-error">No pudimos cargar las donaciones. Vuelve a intentarlo.</p>
        ) : filteredDonations.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="font-medium text-white">{donations.length ? 'No encontramos donaciones con esos filtros' : 'Aún no hay donaciones'}</p>
            <p className="mt-1 text-sm text-on-surface-variant">{donations.length ? 'Prueba otra búsqueda o estado.' : 'Los aportes de tu organización aparecerán aquí.'}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left">
              <thead className="bg-surface-container-high text-xs font-medium text-on-surface-variant">
                <tr>
                  <th scope="col" className="px-5 py-4 sm:px-6">Donante</th>
                  <th scope="col" className="px-5 py-4 sm:px-6">Monto</th>
                  <th scope="col" className="px-5 py-4 sm:px-6">Estado</th>
                  <th scope="col" className="px-5 py-4 sm:px-6">Fecha</th>
                  <th scope="col" className="px-5 py-4 sm:px-6">Campaña</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredDonations.map((donation) => {
                  const name = donation.member ? `${donation.member.firstName} ${donation.member.lastName}` : 'Donante anónimo';
                  const date = new Intl.DateTimeFormat('es-CL', { dateStyle: 'medium' }).format(new Date(donation.createdAt));
                  return (
                    <tr key={donation.id} className="transition-colors hover:bg-surface-container-high/60">
                      <td className="px-5 py-4 sm:px-6">
                        <p className="font-medium text-white">{name}</p>
                        <p className="mt-1 text-xs text-on-surface-variant">{donation.member?.email || 'Sin correo asociado'}</p>
                      </td>
                      <td className="px-5 py-4 font-semibold text-white sm:px-6">{formatCLP(donation.amount)}</td>
                      <td className="px-5 py-4 sm:px-6"><StatusBadge status={donation.status} /></td>
                      <td className="px-5 py-4 text-sm text-on-surface-variant sm:px-6"><span className="inline-flex items-center gap-2"><Calendar aria-hidden="true" className="h-4 w-4" />{date}</span></td>
                      <td className="px-5 py-4 text-sm text-on-surface-variant sm:px-6">{donation.campaign?.name || 'Aporte general'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
      <p className="text-sm text-on-surface-variant">{filteredDonations.length} {filteredDonations.length === 1 ? 'donación' : 'donaciones'}</p>
    </div>
  );
};
