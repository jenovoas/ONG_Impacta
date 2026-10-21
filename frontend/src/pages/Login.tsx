import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, Loader2, HandHeart, Leaf, Users } from 'lucide-react';
import client from '../api/client';
import { useAuthStore } from '../store/auth.store';
import type { AuthUser } from '../store/auth.store';

const areas = [
  { icon: HandHeart, label: 'Donaciones y campañas' },
  { icon: Users, label: 'Personas y comunidad' },
  { icon: Leaf, label: 'Conservación en terreno' },
];

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [orgSlug, setOrgSlug] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data } = await client.post('/auth/login', { email, password, orgSlug });
      const user: AuthUser = {
        id: data.user.id, email: data.user.email,
        role: data.user.role, organizationId: data.user.organizationId,
        organization: data.user.organization,
      };
      setAuth(user, data.access_token, data.refresh_token);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-surface-container-lowest px-5 py-8 text-on-surface sm:px-8 lg:grid lg:place-items-center">
      <div aria-hidden="true" className="pointer-events-none absolute -left-48 top-1/3 h-96 w-96 rounded-full bg-primary/10 blur-[120px]" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-52 -top-44 h-[34rem] w-[34rem] rounded-full bg-secondary/10 blur-[140px]" />

      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-10 lg:grid-cols-[1fr_0.82fr] lg:gap-20">
        <section className="hidden lg:block">
          <Link to="/" aria-label="Impacta+, volver al inicio" className="inline-flex items-center gap-3 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
            <img src="/logo.png" alt="" className="h-12 w-12 object-contain" />
            <span className="text-2xl font-extrabold uppercase italic tracking-tight impacta-gradient-text">Impacta+</span>
          </Link>

          <div className="mt-20 max-w-xl">
            <p className="mb-5 text-sm font-semibold text-secondary">Gestión para organizaciones con impacto</p>
            <h1 className="font-headline text-5xl font-semibold leading-[1.1] tracking-tight text-white">
              Todo el trabajo de tu organización, en un solo lugar.
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-on-surface-variant">
              Vuelve a tu espacio de trabajo y continúa coordinando las iniciativas de tu organización.
            </p>
          </div>

          <ul className="mt-12 flex flex-wrap gap-x-7 gap-y-4 text-sm text-on-surface-variant">
            {areas.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-2.5">
                <Icon aria-hidden="true" className="h-4 w-4 text-secondary" />
                {label}
              </li>
            ))}
          </ul>
          <Link to="/" className="mt-16 inline-flex items-center gap-2 text-sm text-on-surface-variant transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
            <ArrowRight aria-hidden="true" className="h-4 w-4 rotate-180" />
            Volver al sitio de Impacta+
          </Link>
        </section>

        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mx-auto w-full max-w-md"
        >
          <div className="mb-7 flex items-center justify-between lg:hidden">
            <Link to="/" aria-label="Impacta+, volver al inicio" className="inline-flex items-center gap-2 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
              <img src="/logo.png" alt="" className="h-10 w-10 object-contain" />
              <span className="text-xl font-extrabold uppercase italic tracking-tight impacta-gradient-text">Impacta+</span>
            </Link>
            <Link to="/" className="text-sm text-on-surface-variant hover:text-white">Volver al inicio</Link>
          </div>

          <div className="rounded-3xl bg-surface-container p-6 shadow-[0_24px_80px_rgba(0,0,0,0.28)] sm:p-9">
            <div className="mb-8">
              <p className="text-sm font-semibold text-secondary">Bienvenido de vuelta</p>
              <h2 className="mt-2 font-headline text-3xl font-semibold tracking-tight text-white">Inicia sesión</h2>
              <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">Ingresa a la cuenta de tu organización.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label htmlFor="orgSlug" className="mb-2 block text-sm font-medium text-on-surface">Organización</label>
                <input
                  id="orgSlug"
                  type="text"
                  value={orgSlug}
                  onChange={(e) => setOrgSlug(e.target.value)}
                  className="w-full rounded-xl bg-surface-container-high px-4 py-3.5 text-white placeholder:text-gray-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  placeholder="Identificador de tu organización"
                  autoComplete="organization"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-on-surface">Correo electrónico</label>
                <div className="relative">
                  <Mail aria-hidden="true" className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl bg-surface-container-high py-3.5 pl-11 pr-4 text-white placeholder:text-gray-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                    placeholder="nombre@organizacion.cl"
                    autoComplete="username"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="mb-2 block text-sm font-medium text-on-surface">Contraseña</label>
                <div className="relative">
                  <Lock aria-hidden="true" className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant" />
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl bg-surface-container-high py-3.5 pl-11 pr-4 text-white placeholder:text-gray-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                    placeholder="Tu contraseña"
                    autoComplete="current-password"
                    required
                  />
                </div>
              </div>

              {error && (
                <motion.p
                  role="alert"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl bg-error-container/40 px-4 py-3 text-sm text-error"
                >
                  {error}
                </motion.p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 font-semibold text-on-primary transition-colors hover:bg-primary-fixed-dim focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-wait disabled:opacity-60"
              >
                {loading ? <><Loader2 aria-hidden="true" className="h-5 w-5 animate-spin" /> Ingresando…</> : <>Ingresar <ArrowRight aria-hidden="true" className="h-4 w-4" /></>}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-on-surface-variant">
              ¿Aún no tienes cuenta?{' '}
              <Link to="/register" className="font-semibold text-primary-fixed-dim hover:underline focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">Crea tu organización</Link>
            </p>

            <div className="mt-8 rounded-2xl bg-surface-container-high/70 p-4">
              <p className="text-xs font-semibold text-on-surface-variant">¿Quieres explorar la plataforma?</p>
              <button
                type="button"
                onClick={() => {
                  setOrgSlug('demo');
                  setEmail('admin@demo.impacta.cl');
                  setPassword('admin123');
                }}
                className="mt-3 flex w-full items-center justify-between gap-3 rounded-xl bg-surface-container-highest px-4 py-3 text-left text-sm text-white transition-colors hover:bg-surface-bright focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <span>Fundación Conservación Atacama</span>
                <span className="shrink-0 text-secondary">Usar demo</span>
              </button>
            </div>
          </div>
          <p className="mt-5 text-center text-xs text-on-surface-variant/70">Impacta+ · Digital Steward</p>
        </motion.section>
      </div>
    </main>
  );
};
