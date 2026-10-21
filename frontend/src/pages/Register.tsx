import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Building2, Tag, ArrowRight, Loader2 } from 'lucide-react';
import axios from 'axios';
import client from '../api/client';
import { useAuthStore } from '../store/auth.store';
import type { AuthUser } from '../store/auth.store';

export const RegisterPage: React.FC = () => {
  const [orgName, setOrgName] = useState('');
  const [orgSlug, setOrgSlug] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();

  // Auto-slug del org name mientras el usuario no haya escrito uno a mano.
  const slugTouched = orgSlug.length > 0;
  const handleOrgNameChange = (v: string) => {
    setOrgName(v);
    if (!slugTouched) {
      setOrgSlug(
        v
          .toLowerCase()
          .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '')
          .slice(0, 40)
      );
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { data } = await client.post('/auth/register', {
        email, password, orgName, orgSlug,
      });
      const user: AuthUser = {
        id: data.user.id,
        email: data.user.email,
        role: data.user.role,
        organizationId: data.user.organizationId,
        organization: data.user.organization,
      };
      setAuth(user, data.access_token, data.refresh_token);
      navigate('/dashboard/overview');
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const msg = err.response?.data?.message;
        setError(Array.isArray(msg) ? msg.join(', ') : msg || 'Error al crear la cuenta.');
      } else {
        setError('Error al crear la cuenta.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-surface-container-lowest px-5 py-8 text-on-surface sm:px-8">
      <div aria-hidden="true" className="pointer-events-none absolute -left-48 top-1/3 h-96 w-96 rounded-full bg-primary/10 blur-[120px]" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-52 -top-44 h-[34rem] w-[34rem] rounded-full bg-secondary/10 blur-[140px]" />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-lg rounded-3xl bg-surface-container p-6 shadow-[0_24px_80px_rgba(0,0,0,0.28)] sm:p-9"
      >
        <Link to="/" aria-label="Impacta+, volver al inicio" className="mb-7 inline-flex items-center gap-3 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
          <img src="/logo.png" alt="" className="h-10 w-10 object-contain" />
          <span className="text-xl font-extrabold uppercase italic tracking-tight impacta-gradient-text">Impacta+</span>
        </Link>
        <p className="text-sm font-semibold text-secondary">Comienza en Impacta+</p>
        <h2 className="mt-2 font-headline text-3xl font-semibold tracking-tight text-white">Crea tu organización</h2>
        <p className="mb-7 mt-2 text-sm leading-relaxed text-on-surface-variant">Registra el espacio de trabajo y la cuenta de su administrador.</p>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-on-surface">Nombre de la organización</label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                value={orgName}
                onChange={(e) => handleOrgNameChange(e.target.value)}
                required
                placeholder="Conservación Marina Chile"
                autoComplete="organization"
                className="w-full rounded-xl bg-surface-container-high py-3.5 pl-10 pr-4 text-white placeholder:text-on-surface-variant/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-on-surface">Identificador de la organización</label>
            <div className="relative">
              <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                value={orgSlug}
                onChange={(e) => setOrgSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                required
                placeholder="conservacion-marina"
                autoComplete="off"
                className="w-full rounded-xl bg-surface-container-high py-3.5 pl-10 pr-4 font-mono text-sm text-white placeholder:text-on-surface-variant/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              />
            </div>
            <p className="mt-2 text-xs text-on-surface-variant">Se usará para identificar tu organización dentro de Impacta+.</p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-on-surface">Correo del administrador</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="director@ong.cl"
                autoComplete="email"
                className="w-full rounded-xl bg-surface-container-high py-3.5 pl-10 pr-4 text-white placeholder:text-on-surface-variant/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-on-surface">Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                placeholder="••••••••"
                autoComplete="new-password"
                className="w-full rounded-xl bg-surface-container-high py-3.5 pl-10 pr-4 text-white placeholder:text-on-surface-variant/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              />
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              role="alert"
              className="rounded-xl bg-error-container/40 px-4 py-3 text-sm text-error"
            >
              {error}
            </motion.div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 font-semibold text-on-primary transition-colors hover:bg-primary-fixed-dim focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Crear cuenta <ArrowRight className="w-4 h-4" /></>}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-on-surface-variant">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="font-semibold text-primary-fixed-dim hover:underline focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">Inicia sesión</Link>
        </p>
      </motion.div>
    </main>
  );
};
