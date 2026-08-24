import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  HandHeart,
  Target,
  Leaf,
  LifeBuoy,
  Users,
  LogOut,
  ChevronDown,
  Building2,
  Activity,
  Globe,
  Settings,
  HelpCircle,
  BarChart3,
  ClipboardList,
  MapPinned,
} from 'lucide-react';
import { useAuthStore } from '../store/auth.store';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type NavItem = {
  to: string;
  label: string;
  icon: typeof HandHeart;
};

type NavGroup = {
  id: string;
  label: string;
  icon: typeof HandHeart;
  items: NavItem[];
};

const navGroups: NavGroup[] = [
  {
    id: 'overview',
    label: 'Resumen',
    icon: LayoutDashboard,
    items: [
      { to: '/dashboard/overview', label: 'Panel general', icon: Activity },
      { to: '/dashboard/reports', label: 'Reportes', icon: BarChart3 },
    ],
  },
  {
    id: 'operation',
    label: 'Operación',
    icon: HandHeart,
    items: [
      { to: '/dashboard/donations', label: 'Donaciones', icon: HandHeart },
      { to: '/dashboard/campaigns', label: 'Campañas', icon: Target },
    ],
  },
  {
    id: 'conservation',
    label: 'Conservación',
    icon: Leaf,
    items: [
      { to: '/dashboard/species', label: 'Especies', icon: Leaf },
      { to: '/dashboard/missions', label: 'Misiones', icon: LifeBuoy },
      { to: '/dashboard/locations', label: 'Geolocalización', icon: MapPinned },
    ],
  },
  {
    id: 'community',
    label: 'Comunidad',
    icon: Users,
    items: [
      { to: '/dashboard/members', label: 'Miembros', icon: Users },
      { to: '/dashboard/volunteers', label: 'Voluntarios', icon: ClipboardList },
      { to: '/dashboard/network', label: 'Red de ONGs', icon: Globe },
    ],
  },
  {
    id: 'org',
    label: 'Mi organización',
    icon: Building2,
    items: [
      { to: '/dashboard/organization', label: 'Perfil', icon: Building2 },
      { to: '/dashboard/settings', label: 'Configuración', icon: Settings },
    ],
  },
];

const supportItems: NavItem[] = [
  { to: '/dashboard/help', label: 'Ayuda', icon: HelpCircle },
];

// Slug paths that belong to a group (so we auto-open that group when active)
const groupsByPath: Record<string, string> = {};
for (const g of navGroups) {
  for (const it of g.items) groupsByPath[it.to] = g.id;
}

export const Sidebar: React.FC = () => {
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  // Auto-open group that contains the active route
  const activePath = typeof window !== 'undefined' ? window.location.pathname : '';
  const initialOpen = groupsByPath[activePath] || 'overview';
  const [openId, setOpenId] = useState<string>(initialOpen);

  const toggle = (id: string) => setOpenId((cur) => (cur === id ? '' : id));

  return (
    <aside className="w-72 h-screen glass-card border-r border-white/5 flex flex-col sticky top-0">
      <div className="p-8 pb-4">
        <h1 className="text-2xl font-black impacta-gradient-text uppercase italic tracking-tighter">
          Impacta<span className="text-secondary">+</span>
        </h1>
        <p className="text-[10px] tracking-widest uppercase text-[#bec7d3]/70 font-semibold mt-1">
          Digital Steward
        </p>
      </div>

      <nav className="flex-1 px-4 overflow-y-auto">
        {navGroups.map((group) => {
          const isOpen = openId === group.id;
          return (
            <div key={group.id} className="mb-1">
              <button
                onClick={() => toggle(group.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all text-left',
                  isOpen ? 'bg-white/5 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'
                )}
              >
                <group.icon className="w-4 h-4 opacity-70" />
                <span className="font-bold flex-1 text-sm tracking-wide uppercase">{group.label}</span>
                <ChevronDown
                  className={cn('w-4 h-4 transition-transform', isOpen && 'rotate-180')}
                />
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.18 }}
                    className="overflow-hidden"
                  >
                    <div className="py-1 pl-3 space-y-0.5">
                      {group.items.map((it) => (
                        <NavLink
                          key={it.to}
                          to={it.to}
                          className={({ isActive }) => cn(
                            'flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-sm',
                            isActive
                              ? 'bg-primary/10 text-primary'
                              : 'text-gray-400 hover:text-white hover:bg-white/5'
                          )}
                        >
                          <it.icon className="w-4 h-4 opacity-70" />
                          <span className="font-medium">{it.label}</span>
                        </NavLink>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}

        {/* Support section */}
        <div className="mt-4 pt-4 border-t border-white/5">
          {supportItems.map((it) => (
            <NavLink
              key={it.to}
              to={it.to}
              className={({ isActive }) => cn(
                'flex items-center gap-3 px-4 py-2 rounded-lg transition-all text-sm',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-gray-500 hover:text-white hover:bg-white/5'
              )}
            >
              <it.icon className="w-4 h-4" />
              <span className="font-medium">{it.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      <div className="p-6 border-t border-white/5">
        <div className="bg-white/5 rounded-2xl p-4 mb-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-container/20 flex items-center justify-center border border-primary/20">
            <span className="text-primary font-bold">{user?.email?.[0].toUpperCase()}</span>
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-bold text-white truncate">{user?.email}</p>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">{user?.role}</p>
          </div>
        </div>

        <button
          onClick={() => { clearAuth(); navigate('/login'); }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-error hover:bg-error/10 transition-colors font-bold"
        >
          <LogOut className="w-5 h-5" />
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
};
