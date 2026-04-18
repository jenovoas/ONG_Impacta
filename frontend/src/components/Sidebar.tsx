import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  HandHeart, 
  Target, 
  Leaf, 
  LifeBuoy, 
  Users, 
  LogOut,
  ChevronRight,
  Building2
} from 'lucide-react';
import { useAuthStore } from '../store/auth.store';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { icon: LayoutDashboard, label: 'Panel Principal', path: '/dashboard/overview' },
  { icon: HandHeart, label: 'Donaciones', path: '/dashboard/donations' },
  { icon: Target, label: 'Campañas', path: '/dashboard/campaigns' },
  { icon: Leaf, label: 'Especies', path: '/dashboard/species' },
  { icon: LifeBuoy, label: 'Misiones', path: '/dashboard/missions' },
  { icon: Users, label: 'Miembros', path: '/dashboard/members' },
  { icon: Building2, label: 'Organización', path: '/dashboard/organization' },
];

export const Sidebar: React.FC = () => {
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  return (
    <aside className="w-72 h-screen glass-card border-r border-white/5 flex flex-col sticky top-0">
      <div className="p-8">
        <h1 className="text-2xl font-black impacta-gradient-text uppercase italic tracking-tighter">
          Impacta<span className="text-secondary">+</span>
        </h1>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl transition-all group",
              isActive 
                ? "bg-primary/10 text-primary shadow-[inset_0_0_20px_rgba(0,168,255,0.05)]" 
                : "text-gray-400 hover:text-white hover:bg-white/5"
            )}
          >
            <item.icon className="w-5 h-5" />
            <span className="font-bold flex-1">{item.label}</span>
            <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
          </NavLink>
        ))}
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
          onClick={() => { logout(); navigate('/login'); }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-error hover:bg-error/10 transition-colors font-bold"
        >
          <LogOut className="w-5 h-5" />
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
};
