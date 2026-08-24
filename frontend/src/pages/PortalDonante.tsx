import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import {
  Download,
  Calendar,
  CheckCircle2,
  Clock,
  XCircle,
  Loader2,
  Heart,
  LogOut,
  LayoutDashboard,
  AlertCircle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import client from '../api/client';
import { useAuthStore } from '../store/auth.store';
import { RecurrenceToggle, type RecurrenceStatus } from '../components/RecurrenceToggle';

export interface Campaign {
  id: string;
  name: string;
}

export interface MyDonation {
  id: string;
  amount: number | string;
  status: 'SUCCEEDED' | 'PENDING' | 'FAILED' | string;
  createdAt: string;
  campaign?: Campaign | null;
  isRecurring?: boolean;
  recurrenceStatus?: RecurrenceStatus | string | null;
  receiptAvailable?: boolean;
}

const DEFAULT_STATUS_CONFIG = {
  icon: Clock,
  text: 'Pendiente',
  class: 'bg-tertiary/10 text-tertiary border border-tertiary/20',
};

const STATUS_CONFIGS: Record<string, { icon: React.ComponentType<{ className?: string }>; text: string; class: string }> = {
  SUCCEEDED: { icon: CheckCircle2, text: 'Completado', class: 'bg-secondary/10 text-secondary border border-secondary/20' },
  PENDING: DEFAULT_STATUS_CONFIG,
  FAILED: { icon: XCircle, text: 'Fallido', class: 'bg-error/10 text-error border border-error/20' },
};

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const config = STATUS_CONFIGS[status.toUpperCase()] ?? DEFAULT_STATUS_CONFIG;
  const Icon = config.icon;

  return (
    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${config.class}`}>
      <Icon className="w-3 h-3" />
      {config.text}
    </div>
  );
};

export const PortalDonante: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const {
    data: donations = [],
    isLoading,
    isError,
  } = useQuery<MyDonation[]>({
    queryKey: ['donations-me'],
    queryFn: async () => {
      const { data } = await client.get('/donations/me');
      return Array.isArray(data) ? data : [];
    },
    retry: 1,
  });

  const handleDownloadReceipt = async (donationId: string) => {
    setDownloadingId(donationId);
    try {
      const response = await client.get(`/donations/${donationId}/receipt`, {
        responseType: 'blob',
      });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `recibo-${donationId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      // Manejo 404 genérico: no revela si el id existe o pertenece a otro donante
      showToast('Recibo no disponible');
    } finally {
      setDownloadingId(null);
    }
  };

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#0c0c0c] text-[#e5e2e1] flex flex-col relative overflow-hidden">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-50 bg-surface-container-high border border-white/10 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3"
          >
            <AlertCircle className="w-5 h-5 text-tertiary" />
            <span className="text-sm font-medium">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Navbar */}
      <header className="border-b border-white/5 bg-surface-container-lowest/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <Heart className="w-5 h-5 fill-primary/20" />
            </div>
            <div>
              <span className="text-xl font-black italic tracking-tighter text-white uppercase">
                Impacta<span className="text-primary">+</span>
              </span>
              <span className="ml-2 text-xs font-bold text-gray-500 uppercase tracking-widest">
                Portal Donante
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {user && (
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-sm font-bold text-white">{user.email}</span>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                  Rol: {user.role || 'Donante'}
                </span>
              </div>
            )}

            {user?.role && user.role !== 'DONOR' && user.role !== 'MEMBER' && (
              <Link
                to="/dashboard"
                className="bg-white/5 hover:bg-white/10 text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors border border-white/5"
              >
                <LayoutDashboard className="w-4 h-4" />
                Panel Admin
              </Link>
            )}

            <button
              onClick={handleLogout}
              className="bg-white/5 hover:bg-error/10 hover:text-error text-gray-400 p-2.5 rounded-xl transition-colors border border-white/5"
              title="Cerrar sesión"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-10 space-y-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter">
              Mis <span className="text-primary">Aportes y Donaciones</span>
            </h1>
            <p className="text-gray-500 font-medium mt-2">
              Historial de donaciones, recibos de impuestos y gestión de aportes recurrentes.
            </p>
          </div>
        </header>

        {/* State Banner when Backend Endpoint is unavailable or error */}
        {isError && (
          <div className="p-6 bg-surface-container-low border border-tertiary/20 rounded-2xl flex items-start gap-4 text-tertiary">
            <AlertCircle className="w-6 h-6 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-white text-base">Funcionalidad en preparación</h3>
              <p className="text-sm text-gray-400 mt-1">
                Estamos sincronizando la integración con el portal de donantes. Tus transacciones
                se actualizarán automáticamente en cuanto finalice el proceso.
              </p>
            </div>
          </div>
        )}

        {/* Donations Table */}
        <div className="glass-card rounded-[32px] overflow-hidden border border-white/5">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5 bg-white/5">
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-500">Monto</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-500">Estado</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-500">Fecha</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-500">Campaña</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-500">Recurrencia</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-500 text-right">Recibo PDF</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-8 py-20 text-center">
                      <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
                      <p className="text-xs font-medium text-gray-500 mt-3">Cargando tus aportes...</p>
                    </td>
                  </tr>
                ) : isError || donations.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-8 py-20 text-center">
                      <div className="w-16 h-16 rounded-full bg-white/5 border border-white/5 flex items-center justify-center mx-auto mb-4 text-gray-500">
                        <Heart className="w-8 h-8" />
                      </div>
                      <p className="text-white font-bold text-lg">Aún no tienes donaciones</p>
                      <p className="text-gray-500 text-xs font-medium mt-1">
                        Recibos disponibles tras sync de la plataforma.
                      </p>
                    </td>
                  </tr>
                ) : (
                  donations.map((d) => {
                    const campaignName = d.campaign?.name || 'Aporte General';
                    const amountFormatted = Number(d.amount).toLocaleString('es-CL');
                    const dateFormatted = new Date(d.createdAt).toLocaleDateString('es-CL');
                    const isDownloading = downloadingId === d.id;

                    return (
                      <motion.tr
                        key={d.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="hover:bg-white/[0.02] transition-colors group"
                      >
                        <td className="px-8 py-6">
                          <p className="text-white font-black text-lg">${amountFormatted}</p>
                          <p className="text-gray-600 text-[10px] font-bold uppercase tracking-tighter">
                            Pesos Chilenos
                          </p>
                        </td>

                        <td className="px-8 py-6">
                          <StatusBadge status={d.status} />
                        </td>

                        <td className="px-8 py-6">
                          <div className="flex items-center gap-2 text-gray-400">
                            <Calendar className="w-4 h-4" />
                            <span className="text-xs font-medium">{dateFormatted}</span>
                          </div>
                        </td>

                        <td className="px-8 py-6">
                          <span className="text-gray-300 text-xs font-bold uppercase tracking-wider">
                            {campaignName}
                          </span>
                        </td>

                        <td className="px-8 py-6">
                          <RecurrenceToggle
                            donationId={d.id}
                            currentStatus={d.recurrenceStatus}
                            isRecurring={d.isRecurring}
                          />
                        </td>

                        <td className="px-8 py-6 text-right">
                          <button
                            onClick={() => handleDownloadReceipt(d.id)}
                            disabled={isDownloading}
                            className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 disabled:opacity-50 text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors border border-white/5"
                            title="Descargar recibo PDF"
                          >
                            {isDownloading ? (
                              <Loader2 className="w-4 h-4 animate-spin text-primary" />
                            ) : (
                              <Download className="w-4 h-4 text-primary" />
                            )}
                            Descargar
                          </button>
                        </td>
                      </motion.tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer info */}
        <footer className="flex items-center justify-between text-gray-600 text-xs font-bold uppercase tracking-widest pt-4 border-t border-white/5">
          <p>Impacta+ — Ecosistema de Conservación & Recaudación</p>
          <p>Total registros: {donations.length}</p>
        </footer>
      </main>
    </div>
  );
};
