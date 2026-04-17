import { useState } from 'react'

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')

  return (
    <div className="flex h-screen bg-black text-white font-inter">
      {/* Barra Lateral (Sidebar) */}
      <aside className="w-64 border-r border-white/5 flex flex-col glass">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center font-bold text-black">+</div>
          <span className="font-display font-bold text-lg tracking-tight uppercase">Impacta<span className="text-accent">+</span></span>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          <SidebarItem 
            active={activeTab === 'dashboard'} 
            onClick={() => setActiveTab('dashboard')}
            icon="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            label="Panel General" 
          />
          <SidebarItem 
            active={activeTab === 'socios'} 
            onClick={() => setActiveTab('socios')}
            icon="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            label="Gestión de Socios" 
          />
          <SidebarItem 
            active={activeTab === 'voluntarios'} 
            onClick={() => setActiveTab('voluntarios')}
            icon="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            label="Voluntariado" 
          />
          <SidebarItem 
            active={activeTab === 'donaciones'} 
            onClick={() => setActiveTab('donaciones')}
            icon="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            label="Donaciones" 
          />
          <SidebarItem 
            active={activeTab === 'ecologia'} 
            onClick={() => setActiveTab('ecologia')}
            icon="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 002 2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            label="Rescate Ecológico" 
          />
          <SidebarItem 
            active={activeTab === 'config'} 
            onClick={() => setActiveTab('config')}
            icon="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            label="Configuración" 
          />
        </nav>

        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">JD</div>
            <div>
              <p className="text-sm font-bold">Juan Delgado</p>
              <p className="text-xs text-gray-500">Admin ONG</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Contenido Principal */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-20 border-b border-white/5 px-8 flex items-center justify-between">
          <h2 className="text-2xl font-display font-bold">Panel General</h2>
          <div className="flex items-center gap-4">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input 
                type="text" 
                placeholder="Buscar socios, tareas..." 
                className="bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-primary/50 w-64 transition-all"
              />
            </div>
            <button className="p-2 rounded-full hover:bg-white/5 text-gray-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
          </div>
        </header>

        {/* Dashboard View */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          {/* Welcome Section */}
          <div>
            <h1 className="text-4xl font-display font-extrabold mb-2">¡Bienvenido de nuevo, Juan!</h1>
            <p className="text-gray-400">Aquí tienes un resumen del impacto de hoy en <span className="text-accent font-bold">ONG Impacta+</span>.</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard label="Socios Totales" value="1,248" trend="+12% este mes" color="primary" />
            <StatCard label="Recaudación Mensual" value="$4,520,000" trend="+5.4%" color="accent" />
            <StatCard label="Voluntarios en Terreno" value="32" trend="Activos ahora" color="white" />
            <StatCard label="Tareas Pendientes" value="18" trend="4 urgentes" color="error" />
          </div>

          {/* Secondary Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Actividad Reciente */}
            <div className="lg:col-span-2 rounded-3xl bg-surface-dark border border-white/5 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold font-display">Actividad Reciente</h3>
                <button className="text-primary text-sm font-bold hover:underline">Ver todo</button>
              </div>
              <div className="space-y-4">
                <ActivityItem user="Carlos Ruiz" action="se registró como socio" time="hace 10 min" />
                <ActivityItem user="María López" action="donó $50,000 para Reforestación" time="hace 45 min" />
                <ActivityItem user="Pedro Gómez" action="completó tarea: Entrega de Ayuda" time="hace 2 horas" />
                <ActivityItem user="Ana Soto" action="se unió al equipo de Rescate" time="hace 3 horas" />
              </div>
            </div>

            {/* Próximos Eventos */}
            <div className="rounded-3xl bg-surface-dark border border-white/5 p-6">
              <h3 className="text-xl font-bold font-display mb-6">Próximos Eventos</h3>
              <div className="space-y-4">
                <EventCard title="Limpieza Playa Maipo" date="Mañana, 09:00" type="Ecológico" />
                <EventCard title="Reunión Directiva" date="20 Abr, 18:30" type="Admin" />
                <EventCard title="Campaña Invierno" date="25 Abr, Todo el día" type="Ayuda Social" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

function SidebarItem({ label, icon, active, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${
        active ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'
      }`}
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={icon} />
      </svg>
      {label}
    </button>
  )
}

function StatCard({ label, value, trend, color }: any) {
  const colors: any = {
    primary: 'text-primary border-primary/20',
    accent: 'text-accent border-accent/20',
    white: 'text-white border-white/20',
    error: 'text-red-500 border-red-500/20'
  }
  return (
    <div className="bg-surface-dark border border-white/5 rounded-3xl p-6 hover:border-white/20 transition-all group">
      <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2">{label}</p>
      <h4 className={`text-3xl font-display font-bold mb-2 ${colors[color].split(' ')[0]}`}>{value}</h4>
      <p className="text-xs text-gray-400 font-medium">{trend}</p>
    </div>
  )
}

function ActivityItem({ user, action, time }: any) {
  return (
    <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-white/5 transition-colors group">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-bold text-gray-400 group-hover:bg-primary/20 group-hover:text-primary group-hover:border-primary/20 transition-all">
          {user.split(' ').map((n: string) => n[0]).join('')}
        </div>
        <div>
          <p className="text-sm">
            <span className="font-bold text-white">{user}</span> {action}
          </p>
          <p className="text-xs text-gray-500">{time}</p>
        </div>
      </div>
      <button className="p-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  )
}

function EventCard({ title, date, type }: any) {
  return (
    <div className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-accent/30 transition-all cursor-pointer">
      <p className="text-xs text-accent font-bold uppercase tracking-wider mb-1">{type}</p>
      <h4 className="text-sm font-bold mb-1">{title}</h4>
      <p className="text-xs text-gray-500">{date}</p>
    </div>
  )
}

export default App
