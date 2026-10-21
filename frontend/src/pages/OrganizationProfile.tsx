import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Building2, Copy, Shield, Mail, Loader2, CheckCircle, Check, Globe2 } from 'lucide-react';
import client from '../api/client';

type Organization = {
  id: string;
  name: string;
  slug: string;
  plan?: string;
  createdAt?: string;
};

export const OrganizationProfile: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const { data: org, isLoading, isError } = useQuery<Organization>({
    queryKey: ['org-details'],
    queryFn: async () => {
      const { data } = await client.get('/organizations/me');
      return data;
    },
  });

  const copySlug = async () => {
    if (!org?.slug) return;
    try {
      await navigator.clipboard.writeText(org.slug);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  if (isLoading) return <div role="status" className="flex justify-center p-20"><Loader2 aria-hidden="true" className="h-8 w-8 animate-spin text-primary" /><span className="sr-only">Cargando organización</span></div>;
  if (isError || !org) return <p role="alert" className="rounded-2xl bg-error-container/40 p-5 text-sm text-error">No pudimos cargar el perfil de la organización.</p>;

  return (
    <div className="max-w-5xl space-y-8">
      <header>
        <p className="mb-3 text-sm font-semibold text-primary-fixed-dim">Configuración</p>
        <h1 className="font-headline text-3xl font-semibold tracking-tight text-white sm:text-4xl">Perfil de la organización</h1>
        <p className="mt-3 max-w-2xl text-on-surface-variant">Consulta la identidad y los datos de tu espacio de trabajo.</p>
      </header>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.5fr_1fr]">
        <section aria-labelledby="org-info-title" className="glass-card rounded-2xl p-5 sm:p-7">
          <div className="mb-7 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary-fixed-dim"><Building2 aria-hidden="true" className="h-5 w-5" /></span>
            <h2 id="org-info-title" className="font-headline text-xl font-semibold text-white">Datos de la organización</h2>
          </div>
          <dl className="space-y-5">
            <div>
              <dt className="mb-2 text-sm text-on-surface-variant">Nombre</dt>
              <dd className="rounded-xl bg-surface-container-high px-4 py-3.5 font-medium text-white">{org.name}</dd>
            </div>
            <div>
              <dt className="mb-2 text-sm text-on-surface-variant">Identificador de la organización</dt>
              <dd className="flex items-center gap-3 rounded-xl bg-surface-container-high px-4 py-2.5">
                <code className="min-w-0 flex-1 break-all text-sm text-primary-fixed-dim">{org.slug}</code>
                <button type="button" onClick={copySlug} aria-label="Copiar identificador" className="shrink-0 rounded-lg p-2 text-on-surface-variant hover:bg-surface-bright hover:text-white focus-visible:outline-2 focus-visible:outline-primary">
                  {copied ? <Check aria-hidden="true" className="h-4 w-4 text-secondary" /> : <Copy aria-hidden="true" className="h-4 w-4" />}
                </button>
              </dd>
              <p role="status" className="mt-2 min-h-5 text-xs text-secondary">{copied ? 'Identificador copiado' : ''}</p>
            </div>
          </dl>
        </section>

        <section aria-labelledby="org-public-title" className="glass-card rounded-2xl p-5 sm:p-7">
          <div className="mb-5 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/10 text-secondary"><Globe2 aria-hidden="true" className="h-5 w-5" /></span>
            <div>
              <h2 id="org-public-title" className="font-headline text-xl font-semibold text-white">Presencia pública</h2>
              <p className="mt-1 text-sm text-on-surface-variant">Página pública de recaudación</p>
            </div>
          </div>
          <div className="rounded-xl bg-secondary/5 p-4 sm:p-5">
            <span className="inline-flex items-center gap-2 rounded-full bg-tertiary/10 px-3 py-1 text-xs font-medium text-tertiary">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-tertiary" />
              Aún no disponible
            </span>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-on-surface-variant">El perfil público de recaudación todavía no está habilitado. El identificador de la organización se mantiene disponible para reconocer tu espacio en Impacta+.</p>
          </div>
        </section>

        <div className="space-y-4">
          <section aria-labelledby="org-plan-title" className="glass-card rounded-2xl p-5 sm:p-6">
            <h2 id="org-plan-title" className="mb-5 font-headline text-lg font-semibold text-white">Cuenta</h2>
            <dl className="space-y-4">
              <div className="flex items-center gap-3">
                <Shield aria-hidden="true" className="h-4 w-4 text-primary-fixed-dim" />
                <div><dt className="text-xs text-on-surface-variant">Plan</dt><dd className="mt-1 text-sm font-medium text-white">{org.plan || '—'}</dd></div>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle aria-hidden="true" className="h-4 w-4 text-secondary" />
                <div><dt className="text-xs text-on-surface-variant">Fecha de creación</dt><dd className="mt-1 text-sm font-medium text-white">{org.createdAt ? new Intl.DateTimeFormat('es-CL', { dateStyle: 'medium' }).format(new Date(org.createdAt)) : '—'}</dd></div>
              </div>
            </dl>
          </section>

          <section aria-labelledby="org-support-title" className="glass-card rounded-2xl p-5 sm:p-6">
            <h2 id="org-support-title" className="mb-4 font-headline text-lg font-semibold text-white">Soporte</h2>
            <a href="mailto:soporte@pinguinoseguro.cl" className="inline-flex items-center gap-3 rounded-lg text-sm text-on-surface-variant hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
              <Mail aria-hidden="true" className="h-4 w-4 text-primary-fixed-dim" />
              soporte@pinguinoseguro.cl
            </a>
          </section>
        </div>
      </div>
    </div>
  );
};
