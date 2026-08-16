import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import client from '../api/client';
import { useAuthStore } from '../store/auth.store';
import type { AuthUser } from '../store/auth.store';

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
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#0c0c0c] relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="glass-card p-8 rounded-3xl border border-white/5 shadow-2xl">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-black mb-2 impacta-gradient-text uppercase italic tracking-tighter">
              Impacta<span className="text-secondary font-bold italic">+</span>
            </h1>
            <p className="text-gray-400 font-medium">Panel de Gestión Administrativa</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2 ml-1">Organización (Slug)</label>
              <div className="relative">
                <ArrowRight className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  value={orgSlug}
                  onChange={(e) => setOrgSlug(e.target.value)}
                  className="w-full bg-surface-container-low border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-primary/50 transition-colors"
                  placeholder="ej: demo"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2 ml-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-surface-container-low border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-primary/50 transition-colors"
                  placeholder="tu@organizacion.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2 ml-1">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-surface-container-low border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-primary/50 transition-colors"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-error/10 border border-error/20 text-error text-sm p-4 rounded-xl text-center font-medium"
              >
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-on-primary py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:scale-[0.98] transition-transform disabled:opacity-50 disabled:scale-100"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Ingresar al Sistema
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

        <p className="text-center text-sm text-gray-400 mt-6">
          ¿No tienes cuenta?{' '}
          <Link to="/register" className="text-primary hover:underline">Crea una organización</Link>
        </p>

          <div className="mt-8 pt-6 border-t border-white/5 space-y-3">
            <p className="text-xs text-gray-500 text-center font-bold uppercase tracking-wider">Credenciales de Prueba</p>
            <button
              type="button"
              onClick={() => {
                setOrgSlug('demo');
                setEmail('admin@demo.impacta.cl');
                setPassword('admin123');
              }}
              className="w-full bg-white/5 border border-white/10 hover:bg-white/10 text-white text-xs font-bold py-3 px-4 rounded-xl transition-colors flex items-center justify-between"
            >
              <span>Fundación Conservación Atacama</span>
              <span className="text-secondary">Usar datos Demo ➔</span>
            </button>
          </div>
        </div>

        <p className="text-center mt-8 text-gray-600 text-xs uppercase tracking-widest font-bold">
          Steward Protocol v1.0
        </p>
      </motion.div>
    </div>
  );
};
