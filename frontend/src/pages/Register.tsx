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
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#0c0c0c] relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md bg-[#161616]/80 border border-white/10 backdrop-blur-xl rounded-2xl p-8 shadow-2xl"
      >
        <Link to="/" className="inline-block mb-6">
          <h1 className="text-3xl font-bold text-white">
            <span className="text-primary">Impacta</span>+
          </h1>
        </Link>
        <h2 className="text-xl font-semibold text-white mb-1">Crea tu organización</h2>
        <p className="text-sm text-gray-400 mb-6">
          14 días de prueba. Sin tarjeta.
        </p>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="text-xs uppercase tracking-wider text-gray-400 mb-1.5 block">Nombre de la ONG</label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                value={orgName}
                onChange={(e) => handleOrgNameChange(e.target.value)}
                required
                placeholder="Conservación Marina Chile"
                className="w-full pl-10 pr-3 py-2.5 bg-black/40 border border-white/10 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-primary transition"
              />
            </div>
          </div>

          <div>
            <label className="text-xs uppercase tracking-wider text-gray-400 mb-1.5 block">Slug (URL de tu org)</label>
            <div className="relative">
              <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                value={orgSlug}
                onChange={(e) => setOrgSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                required
                placeholder="conservacion-marina"
                className="w-full pl-10 pr-3 py-2.5 bg-black/40 border border-white/10 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-primary transition font-mono text-sm"
              />
            </div>
            <p className="text-[11px] text-gray-500 mt-1">impacta.pinguinoseguro.cl/dashboard?org={orgSlug || 'tu-org'}</p>
          </div>

          <div>
            <label className="text-xs uppercase tracking-wider text-gray-400 mb-1.5 block">Email del admin</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="director@ong.cl"
                className="w-full pl-10 pr-3 py-2.5 bg-black/40 border border-white/10 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-primary transition"
              />
            </div>
          </div>

          <div>
            <label className="text-xs uppercase tracking-wider text-gray-400 mb-1.5 block">Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                placeholder="••••••••"
                className="w-full pl-10 pr-3 py-2.5 bg-black/40 border border-white/10 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-primary transition"
              />
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2"
            >
              {error}
            </motion.div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50 text-black font-semibold py-2.5 rounded-lg transition flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Crear cuenta <ArrowRight className="w-4 h-4" /></>}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-6">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="text-primary hover:underline">Inicia sesión</Link>
        </p>
      </motion.div>
    </div>
  );
};
