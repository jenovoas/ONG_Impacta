import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Activity, ArrowUpRight, DollarSign, HandHeart, Target, Users } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import client from '../api/client';

type OrganizationSummary = {
  totalAmount: number | string;
  donationsCount: number;
  membersCount: number;
  campaignsCount: number;
};

type Donation = {
  id: string;
  amount: number | string;
  createdAt: string;
  status: string;
  member?: { firstName: string; lastName: string } | null;
  campaign?: { name: string } | null;
};

const formatCLP = (amount: number | string) =>
  new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(Number(amount));

const StatCard = ({ title, value, icon: Icon, accent, delay }: {
  title: string;
  value: string | number;
  icon: LucideIcon;
  accent: string;
  delay: number;
}) => (
  <motion.article
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.25 }}
    className="glass-card flex min-h-36 flex-col justify-between rounded-2xl p-5 sm:p-6"
  >
    <div className="flex items-center justify-between">
      <p className="text-sm font-medium text-on-surface-variant">{title}</p>
      <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${accent}`}>
        <Icon aria-hidden="true" className="h-5 w-5" />
      </span>
    </div>
    <p className="mt-5 font-headline text-3xl font-semibold tracking-tight text-white sm:text-4xl">{value}</p>
  </motion.article>
);

export const Overview: React.FC = () => {
  const { data: summary, isLoading, isError } = useQuery<OrganizationSummary>({
    queryKey: ['org-summary'],
    queryFn: async () => {
      const { data } = await client.get('/organizations/me/summary');
      return data;
    },
  });

  const { data: recentDonations = [], isLoading: isLoadingDonations, isError: donationsError } = useQuery<Donation[]>({
    queryKey: ['recent-donations'],
    queryFn: async () => {
      const { data } = await client.get('/donations');
      return Array.isArray(data) ? data.slice(0, 3) : [];
    },
  });

  if (isLoading) {
    return <p role="status" className="py-8 text-sm text-on-surface-variant">Cargando el resumen de tu organización…</p>;
  }

  if (isError || !summary) {
    return <p role="alert" className="rounded-2xl bg-error-container/40 p-5 text-sm text-error">No pudimos cargar el resumen. Actualiza la página para intentarlo de nuevo.</p>;
  }

  return (
    <div className="space-y-9 sm:space-y-11">
      <header className="max-w-3xl">
        <p className="mb-3 text-sm font-semibold text-secondary">Resumen de tu organización</p>
        <h1 className="font-headline text-3xl font-semibold tracking-tight text-white sm:text-4xl">Tu trabajo, en perspectiva</h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-on-surface-variant">
          Revisa los aportes recibidos, las personas activas y las campañas que están en marcha.
        </p>
      </header>

      <section aria-label="Indicadores de la organización" className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Recaudación recibida" value={formatCLP(summary.totalAmount)} icon={DollarSign} accent="bg-primary/10 text-primary-fixed-dim" delay={0.04} />
        <StatCard title="Donaciones recibidas" value={summary.donationsCount} icon={HandHeart} accent="bg-secondary/10 text-secondary" delay={0.08} />
        <StatCard title="Miembros activos" value={summary.membersCount} icon={Users} accent="bg-tertiary/10 text-tertiary" delay={0.12} />
        <StatCard title="Campañas activas" value={summary.campaignsCount} icon={Target} accent="bg-surface-bright text-on-surface" delay={0.16} />
      </section>

      <section className="glass-card rounded-2xl p-5 sm:p-7" aria-labelledby="recent-donations-title">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <div className="mb-2 flex items-center gap-2 text-secondary">
              <Activity aria-hidden="true" className="h-4 w-4" />
              <span className="text-sm font-medium">Actividad</span>
            </div>
            <h2 id="recent-donations-title" className="font-headline text-xl font-semibold text-white sm:text-2xl">Donaciones recientes</h2>
          </div>
          <Link to="/dashboard/donations" className="inline-flex shrink-0 items-center gap-1 rounded-lg px-2 py-1 text-sm font-medium text-primary-fixed-dim hover:bg-surface-container-high focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
            Ver donaciones <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </div>

        {isLoadingDonations ? (
          <p role="status" className="py-5 text-sm text-on-surface-variant">Cargando donaciones…</p>
        ) : donationsError ? (
          <p role="alert" className="py-5 text-sm text-error">No pudimos cargar las donaciones recientes.</p>
        ) : recentDonations.length === 0 ? (
          <div className="rounded-xl bg-surface-container-high/70 px-5 py-8 text-center">
            <HandHeart aria-hidden="true" className="mx-auto h-6 w-6 text-secondary" />
            <p className="mt-3 font-medium text-white">Aún no hay donaciones para mostrar</p>
            <p className="mt-1 text-sm text-on-surface-variant">Cuando tu organización reciba aportes, aparecerán aquí.</p>
          </div>
        ) : (
          <ul className="divide-y divide-white/5">
            {recentDonations.map((donation) => {
              const donor = donation.member ? `${donation.member.firstName} ${donation.member.lastName}` : 'Donante anónimo';
              const date = new Intl.DateTimeFormat('es-CL', { dateStyle: 'medium' }).format(new Date(donation.createdAt));
              return (
                <li key={donation.id} className="flex items-center gap-3 py-4 first:pt-1 last:pb-1 sm:gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
                    <HandHeart aria-hidden="true" className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-white">{donor}</p>
                    <p className="mt-1 truncate text-xs text-on-surface-variant">{date} · {donation.campaign?.name || 'Aporte general'}</p>
                  </div>
                  <p className="shrink-0 text-right text-sm font-semibold text-secondary">{formatCLP(donation.amount)}</p>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
};
