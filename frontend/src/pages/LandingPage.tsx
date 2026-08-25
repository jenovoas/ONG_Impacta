import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { EarthBackground } from '../components/Background/EarthBackground';
import { 
  ArrowRight, 
  Rocket, 
  ChevronDown, 
  DollarSign, 
  Users, 
  PawPrint, 
  Compass, 
  ShieldCheck, 
  CheckCircle2,
  Heart,
  Check
} from 'lucide-react';
export const LandingPage: React.FC = () => {
  const [showDemoModal, setShowDemoModal] = React.useState(false);
  const [demoSubmitted, setDemoSubmitted] = React.useState(false);
  const [demoSubmitting, setDemoSubmitting] = React.useState(false);
  const [demoError, setDemoError] = React.useState<string | null>(null);
  const [demoForm, setDemoForm] = React.useState({ name: '', email: '', org: '', phone: '' });
  const [platformMenuOpen, setPlatformMenuOpen] = useState(false);
  const [selectedModuleTab, setSelectedModuleTab] = useState(0);

  // Live stats from backend (replaces hardcoded mock values)
  const [stats, setStats] = React.useState({
    speciesCount: 0,
    totalDonated: 0,
    donationsCount: 0,
    missionsCount: 0,
    orgsCount: 0,
    membersCount: 0,
  });
  const [statsLoading, setStatsLoading] = React.useState(true);

  React.useEffect(() => {
    fetch('/api/organizations/public-stats')
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((d) => {
        setStats({
          speciesCount: d.speciesCount ?? 0,
          totalDonated: Number(d.totalDonated) || 0,
          donationsCount: d.donationsCount ?? 0,
          missionsCount: d.missionsCount ?? 0,
          orgsCount: d.orgsCount ?? 0,
          membersCount: d.membersCount ?? 0,
        });
      })
      .catch(() => { /* keep zeros on error */ })
      .finally(() => setStatsLoading(false));
  }, []);

  const formatCLP = (n: number) => `$${n.toLocaleString('es-CL')}`;

  const handleDemoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setDemoError(null);
    setDemoSubmitting(true);
    try {
      const res = await fetch('/api/demo-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(demoForm),
      });
      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody.message || `Error ${res.status}`);
      }
      setDemoSubmitted(true);
      setTimeout(() => {
        setShowDemoModal(false);
        setDemoSubmitted(false);
        setDemoForm({ name: '', email: '', org: '', phone: '' });
      }, 2500);
    } catch (err) {
      setDemoError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setDemoSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-[#e5e2e1] flex flex-col font-sans selection:bg-[#00a8ff]/30 selection:text-[#95ccff] relative">
      <EarthBackground />
      
      {/* Content wrapper over Three.js canvas */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Top Navbar */}
        <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#0e0e0e]/70 border-b border-[#2a2a2a]/60 transition-all">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            {/* Brand Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <img src="/logo.png" alt="Impacta+" className="w-10 h-10 object-contain group-hover:scale-105 transition-transform" />
              <div className="flex flex-col">
                <span className="text-2xl font-black tracking-tighter uppercase italic impacta-gradient-text">
                  Impacta<span className="text-[#00d4aa]">+</span>
                </span>
                <span className="text-[10px] tracking-widest uppercase text-[#bec7d3]/70 font-semibold">
                  Digital Steward
                </span>
              </div>
            </Link>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#bec7d3]">
              <a href="#hero" className="hover:text-[#00a8ff] transition-colors">Nuestro hogar</a>
              
              {/* Dropdown Menu Plataforma */}
              <div 
                className="relative"
                onMouseEnter={() => setPlatformMenuOpen(true)}
                onMouseLeave={() => setPlatformMenuOpen(false)}
              >
                <button
                  onClick={() => setPlatformMenuOpen(!platformMenuOpen)}
                  className="flex items-center gap-1 hover:text-[#00a8ff] transition-colors py-2 group"
                >
                  <span className="font-semibold text-white group-hover:text-[#00a8ff]">Plataforma</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${platformMenuOpen ? 'rotate-180 text-[#00a8ff]' : 'text-gray-400'}`} />
                </button>

                {platformMenuOpen && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-96 rounded-3xl bg-[#141414]/95 backdrop-blur-2xl border border-white/10 p-4 shadow-2xl shadow-black/80 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="text-[10px] font-black uppercase tracking-widest text-[#00d4aa] px-3 py-1 mb-2">
                      Módulos del Sistema
                    </div>
                    <div className="space-y-1">
                      <a
                        href="#modules"
                        onClick={() => { setSelectedModuleTab(0); setPlatformMenuOpen(false); }}
                        className="flex items-start gap-3 p-3 rounded-2xl hover:bg-white/5 transition-colors group"
                      >
                        <div className="w-10 h-10 rounded-xl bg-[#00a8ff]/10 border border-[#00a8ff]/20 flex items-center justify-center text-[#00a8ff] shrink-0 group-hover:scale-105 transition-transform">
                          <DollarSign className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-white text-sm font-bold group-hover:text-[#00a8ff] transition-colors">Recaudación & Donaciones</p>
                          <p className="text-gray-400 text-xs leading-snug">Pasarelas de pago, aportes recurrentes e informes financieros.</p>
                        </div>
                      </a>

                      <a
                        href="#modules"
                        onClick={() => { setSelectedModuleTab(1); setPlatformMenuOpen(false); }}
                        className="flex items-start gap-3 p-3 rounded-2xl hover:bg-white/5 transition-colors group"
                      >
                        <div className="w-10 h-10 rounded-xl bg-[#00d4aa]/10 border border-[#00d4aa]/20 flex items-center justify-center text-[#00d4aa] shrink-0 group-hover:scale-105 transition-transform">
                          <Users className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-white text-sm font-bold group-hover:text-[#00d4aa] transition-colors">Gestión de Socios</p>
                          <p className="text-gray-400 text-xs leading-snug">Directorio de voluntarios, socios con validación de RUT chileno.</p>
                        </div>
                      </a>

                      <a
                        href="#modules"
                        onClick={() => { setSelectedModuleTab(2); setPlatformMenuOpen(false); }}
                        className="flex items-start gap-3 p-3 rounded-2xl hover:bg-white/5 transition-colors group"
                      >
                        <div className="w-10 h-10 rounded-xl bg-[#ffb877]/10 border border-[#ffb877]/20 flex items-center justify-center text-[#ffb877] shrink-0 group-hover:scale-105 transition-transform">
                          <PawPrint className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-white text-sm font-bold group-hover:text-[#ffb877] transition-colors">Biblioteca de Especies</p>
                          <p className="text-gray-400 text-xs leading-snug">Catálogo biológico, fichas UICN y fotografías de biodiversidad.</p>
                        </div>
                      </a>

                      <a
                        href="#modules"
                        onClick={() => { setSelectedModuleTab(3); setPlatformMenuOpen(false); }}
                        className="flex items-start gap-3 p-3 rounded-2xl hover:bg-white/5 transition-colors group"
                      >
                        <div className="w-10 h-10 rounded-xl bg-[#00a8ff]/10 border border-[#00a8ff]/20 flex items-center justify-center text-[#00a8ff] shrink-0 group-hover:scale-105 transition-transform">
                          <Compass className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-white text-sm font-bold group-hover:text-[#00a8ff] transition-colors">Misiones de Campo</p>
                          <p className="text-gray-400 text-xs leading-snug">Coordinación de cuadrillas con sincronización offline en terreno.</p>
                        </div>
                      </a>

                      <Link
                        to="/portal"
                        onClick={() => setPlatformMenuOpen(false)}
                        className="flex items-start gap-3 p-3 rounded-2xl hover:bg-white/5 transition-colors group border-t border-white/5 mt-1"
                      >
                        <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 shrink-0 group-hover:scale-105 transition-transform">
                          <Heart className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-white text-sm font-bold group-hover:text-pink-400 transition-colors flex items-center gap-1.5">
                            Portal Donante <span className="text-[9px] bg-pink-500/20 text-pink-300 px-1.5 py-0.5 rounded font-black uppercase">Exclusivo</span>
                          </p>
                          <p className="text-gray-400 text-xs leading-snug">Descarga de certificados PDF y gestión de suscripciones.</p>
                        </div>
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              <a href="#how-it-works" className="hover:text-[#00a8ff] transition-colors">Cómo funciona</a>
              <a href="#why-us" className="hover:text-[#00a8ff] transition-colors">Por qué Impacta+</a>
              <a href="#impact" className="hover:text-[#00a8ff] transition-colors">Impacto</a>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <Link
                to="/login"
                className="text-sm font-semibold px-5 py-2.5 rounded-lg text-[#e5e2e1] hover:text-white hover:bg-[#1c1b1b] transition-all"
              >
                Iniciar Sesión
              </Link>
              <button
                onClick={() => setShowDemoModal(true)}
                className="text-sm font-semibold px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#00a8ff] to-[#00d4aa] text-[#003352] hover:opacity-90 transition-opacity shadow-md shadow-[#00a8ff]/20 flex items-center gap-2"
              >
                <span>Hablemos de tu causa</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section id="hero" className="relative overflow-hidden pt-20 pb-28 md:pt-32 md:pb-40 border-b border-[#2a2a2a]/40">
          {/* Glow ambient effects */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-to-tr from-[#00a8ff]/15 to-[#00d4aa]/15 blur-[120px] rounded-full pointer-events-none" />

          <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1c1b1b]/80 border border-[#2a2a2a] mb-8 text-xs font-semibold text-[#00d4aa]">
              <span className="w-2 h-2 rounded-full bg-[#00d4aa] animate-pulse" />
              <span>Una red para quienes cuidan lo que importa</span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.1] font-headline mb-8">
              El planeta es nuestro hogar. <span className="impacta-gradient-text">Cuidarlo es una tarea compartida.</span>
            </h1>

            <p className="text-lg md:text-xl text-[#bec7d3] max-w-2xl mx-auto mb-10 leading-relaxed">
              Impacta+ ayuda a organizaciones, comunidades y voluntarios a convertir la preocupación por nuestro entorno en acciones coordinadas, visibles y capaces de dejar una huella positiva.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <button
                onClick={() => setShowDemoModal(true)}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-[#00a8ff] to-[#00d4aa] text-[#003352] font-bold text-base hover:opacity-95 transition-all shadow-xl shadow-[#00a8ff]/25 flex items-center justify-center gap-3"
              >
                <span>Conversemos sobre tu causa</span>
                <Rocket className="w-5 h-5" />
              </button>
              <a
                href="#modules"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#1c1b1b]/80 border border-[#2a2a2a] text-[#e5e2e1] font-semibold text-base hover:bg-[#20201f] transition-all flex items-center justify-center gap-2"
              >
                <span>Descubrir cómo actuar</span>
                <ChevronDown className="w-5 h-5" />
              </a>
            </div>

            {/* Stats Bar — live from /api/organizations/public-stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto p-6 rounded-2xl glass-card border border-[#2a2a2a]">
              <div className="p-4 text-center">
                <div className="text-3xl font-extrabold text-white font-headline">
                  {statsLoading ? '…' : stats.speciesCount}
                </div>
                <div className="text-xs font-medium text-[#bec7d3] mt-1">Especies acompañadas</div>
              </div>
              <div className="p-4 text-center border-l border-[#2a2a2a]/60">
                <div className="text-3xl font-extrabold text-[#00a8ff] font-headline">
                  {statsLoading ? '…' : formatCLP(stats.totalDonated)}
                </div>
                <div className="text-xs font-medium text-[#bec7d3] mt-1">Aportes movilizados</div>
              </div>
              <div className="p-4 text-center border-l border-[#2a2a2a]/60">
                <div className="text-3xl font-extrabold text-[#00d4aa] font-headline">
                  {statsLoading ? '…' : stats.missionsCount}
                </div>
                <div className="text-xs font-medium text-[#bec7d3] mt-1">Acciones en terreno</div>
              </div>
              <div className="p-4 text-center border-l border-[#2a2a2a]/60">
                <div className="text-3xl font-extrabold text-[#ffb877] font-headline">
                  {statsLoading ? '…' : stats.orgsCount}
                </div>
                <div className="text-xs font-medium text-[#bec7d3] mt-1">Organizaciones activas</div>
              </div>
            </div>
            <p className="mt-6 text-xs font-medium tracking-wide text-[#bec7d3]/70">
              Cada cifra representa personas que decidieron hacer algo por el lugar que habitan.
            </p>
          </div>
        </section>

        {/* Product Modules Section */}
                {/* Cómo funciona */}
        <section id="how-it-works" className="relative overflow-hidden py-24 md:py-32 border-b border-[#2a2a2a]/40">
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="text-center mb-16">
              <span className="inline-block px-3 py-1 rounded-full bg-[#00a8ff]/10 text-[#00a8ff] text-xs font-bold tracking-widest uppercase mb-4">Flujo</span>
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4 font-headline">
                De una preocupación a una <span className="impacta-gradient-text">acción compartida</span>
              </h2>
              <p className="text-[#bec7d3] text-lg max-w-2xl mx-auto">
                Cada causa tiene un lugar, una historia y personas dispuestas a ayudar. Impacta+ convierte esa energía en un camino concreto.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 relative">
              {/* Connector line on md+ */}
              <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-px bg-gradient-to-r from-transparent via-[#00a8ff]/40 to-transparent" />

              <div className="relative bg-[#161616]/70 backdrop-blur border border-[#2a2a2a] rounded-2xl p-8">
                <div className="absolute -top-5 left-8 w-10 h-10 rounded-xl bg-gradient-to-br from-[#00a8ff] to-[#00d4aa] flex items-center justify-center text-[#003352] font-black text-lg shadow-lg shadow-[#00a8ff]/20">1</div>
                <h3 className="text-xl font-bold mt-2 mb-3">Reúne a quienes quieren ayudar</h3>
                <p className="text-[#bec7d3] text-sm leading-relaxed">
                  Registra tu organización, invita a tu equipo y comparte una causa que todos puedan reconocer como propia.
                </p>
              </div>

              <div className="relative bg-[#161616]/70 backdrop-blur border border-[#2a2a2a] rounded-2xl p-8">
                <div className="absolute -top-5 left-8 w-10 h-10 rounded-xl bg-gradient-to-br from-[#00a8ff] to-[#00d4aa] flex items-center justify-center text-[#003352] font-black text-lg shadow-lg shadow-[#00a8ff]/20">2</div>
                <h3 className="text-xl font-bold mt-2 mb-3">Da forma al propósito</h3>
                <p className="text-[#bec7d3] text-sm leading-relaxed">
                  Ordena campañas, donaciones, especies y misiones para que la intención se transforme en tareas que puedan comenzar hoy.
                </p>
              </div>

              <div className="relative bg-[#161616]/70 backdrop-blur border border-[#2a2a2a] rounded-2xl p-8">
                <div className="absolute -top-5 left-8 w-10 h-10 rounded-xl bg-gradient-to-br from-[#00a8ff] to-[#00d4aa] flex items-center justify-center text-[#003352] font-black text-lg shadow-lg shadow-[#00a8ff]/20">3</div>
                <h3 className="text-xl font-bold mt-2 mb-3">Haz visible cada avance</h3>
                <p className="text-[#bec7d3] text-sm leading-relaxed">
                  Coordina el trabajo en terreno, comparte resultados con tu comunidad y demuestra que cada aporte dejó una huella.
                </p>
              </div>
            </div>
          </div>
        </section>

<section id="modules" className="py-24 bg-[#131313]/60 backdrop-blur-md border-b border-[#2a2a2a]/40">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-xs uppercase font-bold tracking-widest text-[#00d4aa] mb-3">Plataforma Modular</h2>
              <h3 className="text-3xl md:text-5xl font-extrabold text-white font-headline">
                Todo lo que tu ONG necesita en un solo ecosistema
              </h3>
              <p className="text-[#bec7d3] text-base mt-4">
                Explora cada módulo diseñado con estándares de trazabilidad, coordinación en terreno y rigor multi-tenant.
              </p>
            </div>

            {/* Module Selector Tabs */}
            <div className="flex flex-wrap justify-center gap-2 mb-12 p-1.5 rounded-2xl bg-[#1c1b1b]/80 border border-[#2a2a2a] max-w-4xl mx-auto">
              {[
                { id: 0, label: 'Recaudación & Donaciones', icon: DollarSign, color: 'text-[#00a8ff]' },
                { id: 1, label: 'Gestión de Socios', icon: Users, color: 'text-[#00d4aa]' },
                { id: 2, label: 'Biblioteca de Especies', icon: PawPrint, color: 'text-[#ffb877]' },
                { id: 3, label: 'Misiones de Campo', icon: Compass, color: 'text-[#00a8ff]' },
                { id: 4, label: 'Portal del Donante', icon: Heart, color: 'text-pink-400' },
              ].map((tab) => {
                const Icon = tab.icon;
                const active = selectedModuleTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedModuleTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                      active 
                        ? 'bg-white/10 text-white shadow-lg border border-white/15' 
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${tab.color}`} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Interactive Module Highlight Box */}
            <div className="bg-[#1c1b1b]/90 border border-[#2a2a2a] rounded-3xl p-8 md:p-12 mb-16 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#00a8ff]/10 via-[#00d4aa]/5 to-transparent rounded-full blur-3xl pointer-events-none" />

              {selectedModuleTab === 0 && (
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div className="space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00a8ff]/10 text-[#00a8ff] text-xs font-bold uppercase tracking-wider border border-[#00a8ff]/20">
                      <DollarSign className="w-3.5 h-3.5" />
                      Módulo Financiero & Pasarelas
                    </div>
                    <h4 className="text-3xl font-bold text-white font-headline">Recaudación y Aportes Idempotentes</h4>
                    <p className="text-[#bec7d3] text-sm leading-relaxed">
                      Control total de ingresos con trazabilidad peso a peso. Permite donaciones directas, campañas con metas en tiempo real, suscripciones recurrentes y emisión de recibos en PDF.
                    </p>
                    <ul className="space-y-2.5 text-xs text-gray-300 font-medium">
                      <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#00d4aa]" /> Integración con Webpay Plus y Flow</li>
                      <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#00d4aa]" /> Transacciones con confirmación atómica e idempotencia</li>
                      <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#00d4aa]" /> Exportación de libros contables en CSV con 1 clic</li>
                    </ul>
                    <div className="pt-4 flex gap-4">
                      <Link to="/login" className="px-6 py-3 rounded-xl bg-[#00a8ff] text-[#003352] font-bold text-xs hover:opacity-90 transition-opacity flex items-center gap-2">
                        <span>Ver en Panel</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                  <div className="bg-[#0e0e0e] border border-white/10 rounded-2xl p-6 space-y-4 font-mono text-xs shadow-inner">
                    <div className="flex justify-between items-center text-gray-400 border-b border-white/5 pb-3">
                      <span>Transacción #tx_mp_998123</span>
                      <span className="text-[#00d4aa] font-bold bg-[#00d4aa]/10 px-2 py-0.5 rounded">COMPLETADO</span>
                    </div>
                    <div className="flex justify-between text-white text-base font-bold font-sans">
                      <span>Reforestación Bosque Nativo</span>
                      <span className="text-[#00d4aa] font-mono">+$250.000 CLP</span>
                    </div>
                    <p className="text-gray-500 font-sans text-xs">Donante: Camila Valenzuela · Rut: 18.452.391-K</p>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#00a8ff] to-[#00d4aa] w-3/4" />
                    </div>
                  </div>
                </div>
              )}

              {selectedModuleTab === 1 && (
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div className="space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00d4aa]/10 text-[#00d4aa] text-xs font-bold uppercase tracking-wider border border-[#00d4aa]/20">
                      <Users className="w-3.5 h-3.5" />
                      Padrón & Voluntariado
                    </div>
                    <h4 className="text-3xl font-bold text-white font-headline">Directorio de Miembros con RUT</h4>
                    <p className="text-[#bec7d3] text-sm leading-relaxed">
                      Gestión unificada de socios y cuadrillas voluntarias. Validación automática de RUT con algoritmo Módulo 11 chileno, historial de aportes y participación en terreno.
                    </p>
                    <ul className="space-y-2.5 text-xs text-gray-300 font-medium">
                      <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#00d4aa]" /> Validación estricta de formato RUT (con y sin puntos)</li>
                      <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#00d4aa]" /> Control de estado activo/inactivo y roles por tenant</li>
                      <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#00d4aa]" /> Búsqueda y filtrado instantáneo por nombre o email</li>
                    </ul>
                    <div className="pt-4 flex gap-4">
                      <Link to="/login" className="px-6 py-3 rounded-xl bg-[#00d4aa] text-[#003352] font-bold text-xs hover:opacity-90 transition-opacity flex items-center gap-2">
                        <span>Explorar Directorio</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                  <div className="bg-[#0e0e0e] border border-white/10 rounded-2xl p-6 space-y-3 shadow-inner">
                    <div className="flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/5">
                      <div className="w-10 h-10 rounded-xl bg-[#00d4aa]/20 flex items-center justify-center text-[#00d4aa] font-bold text-sm">CV</div>
                      <div className="flex-1">
                        <p className="text-white font-bold text-sm">Camila Valenzuela</p>
                        <p className="text-gray-400 text-xs font-mono">18.452.391-K · camila@outdoors.cl</p>
                      </div>
                      <span className="text-[10px] bg-[#00d4aa]/15 text-[#00d4aa] px-2 py-0.5 rounded font-bold">ACTIVO</span>
                    </div>
                    <div className="flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/5">
                      <div className="w-10 h-10 rounded-xl bg-[#00a8ff]/20 flex items-center justify-center text-[#00a8ff] font-bold text-sm">GP</div>
                      <div className="flex-1">
                        <p className="text-white font-bold text-sm">Gonzalo Pérez</p>
                        <p className="text-gray-400 text-xs font-mono">15.223.109-4 · gonzalo@impacta.cl</p>
                      </div>
                      <span className="text-[10px] bg-[#00a8ff]/15 text-[#00a8ff] px-2 py-0.5 rounded font-bold">SOCIO</span>
                    </div>
                  </div>
                </div>
              )}

              {selectedModuleTab === 2 && (
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div className="space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ffb877]/10 text-[#ffb877] text-xs font-bold uppercase tracking-wider border border-[#ffb877]/20">
                      <PawPrint className="w-3.5 h-3.5" />
                      Inventario Ecológico
                    </div>
                    <h4 className="text-3xl font-bold text-white font-headline">Biblioteca de Especies y Biodiversidad</h4>
                    <p className="text-[#bec7d3] text-sm leading-relaxed">
                      Catálogo centralizado de flora y fauna protegida. Fichas taxonómicas con nombre científico, estado de amenaza UICN y registro fotográfico en alta resolución.
                    </p>
                    <ul className="space-y-2.5 text-xs text-gray-300 font-medium">
                      <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#ffb877]" /> Clasificación UICN: Amenazada, En Peligro, Activa</li>
                      <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#ffb877]" /> Subida y almacenamiento seguro de imágenes de campo</li>
                      <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#ffb877]" /> Asociación directa a campañas y áreas protegidas</li>
                    </ul>
                    <div className="pt-4 flex gap-4">
                      <Link to="/login" className="px-6 py-3 rounded-xl bg-[#ffb877] text-[#003352] font-bold text-xs hover:opacity-90 transition-opacity flex items-center gap-2">
                        <span>Ver Especies</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                  <div className="bg-[#0e0e0e] border border-white/10 rounded-2xl p-6 space-y-4 shadow-inner">
                    <div className="flex justify-between items-center">
                      <span className="text-white font-bold text-base">Zorro de Darwin (Chilote)</span>
                      <span className="text-[10px] bg-red-500/20 text-red-400 font-bold px-2 py-0.5 rounded uppercase">En Peligro</span>
                    </div>
                    <p className="text-gray-400 text-xs italic">Lycalopex fulvipes · Cánido endémico del sur de Chile</p>
                    <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-xs text-gray-300">
                      Monitoreo fotográfico activo en 12 cuadrículas de la serranía costera.
                    </div>
                  </div>
                </div>
              )}

              {selectedModuleTab === 3 && (
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div className="space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00a8ff]/10 text-[#00a8ff] text-xs font-bold uppercase tracking-wider border border-[#00a8ff]/20">
                      <Compass className="w-3.5 h-3.5" />
                      Operaciones en Terreno
                    </div>
                    <h4 className="text-3xl font-bold text-white font-headline">Misiones de Campo Offline-First</h4>
                    <p className="text-[#bec7d3] text-sm leading-relaxed">
                      Planificación logística diseñada para zonas sin conectividad. El equipo actualiza tareas en terreno guardando en IndexedDB y se sincroniza automáticamente al recuperar señal.
                    </p>
                    <ul className="space-y-2.5 text-xs text-gray-300 font-medium">
                      <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#00d4aa]" /> Base de datos local en navegador (IndexedDB)</li>
                      <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#00d4aa]" /> Detección de conectividad y cola de sincronización</li>
                      <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#00d4aa]" /> Checklists operativos y asignación a miembros</li>
                    </ul>
                    <div className="pt-4 flex gap-4">
                      <Link to="/login" className="px-6 py-3 rounded-xl bg-[#00a8ff] text-[#003352] font-bold text-xs hover:opacity-90 transition-opacity flex items-center gap-2">
                        <span>Ver Misiones</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                  <div className="bg-[#0e0e0e] border border-white/10 rounded-2xl p-6 space-y-3 shadow-inner">
                    <div className="flex justify-between items-center pb-2 border-b border-white/5">
                      <span className="text-white font-bold text-sm">Reforestación Cuenca Biobío</span>
                      <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-bold">Offline Ready</span>
                    </div>
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center gap-2 text-green-400">
                        <Check className="w-4 h-4" /> <span>Preparación de compost y sustrato (3/3)</span>
                      </div>
                      <div className="flex items-center gap-2 text-green-400">
                        <Check className="w-4 h-4" /> <span>Plantación de 200 quillayes</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400">
                        <div className="w-4 h-4 rounded border border-gray-600" /> <span>Cierre perimetral y riego por goteo</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {selectedModuleTab === 4 && (
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div className="space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 text-pink-400 text-xs font-bold uppercase tracking-wider border border-pink-500/20">
                      <Heart className="w-3.5 h-3.5" />
                      Experiencia del Donante
                    </div>
                    <h4 className="text-3xl font-bold text-white font-headline">Portal Autogestionable para Donantes</h4>
                    <p className="text-[#bec7d3] text-sm leading-relaxed">
                      Espacio dedicado para que los aportantes revisen su historial, descarguen certificados y recibos tributarios en PDF y gestionen la recurrencia de sus suscripciones de forma autónoma.
                    </p>
                    <ul className="space-y-2.5 text-xs text-gray-300 font-medium">
                      <li className="flex items-center gap-2"><Check className="w-4 h-4 text-pink-400" /> Generación de recibos PDF oficiales en tiempo real</li>
                      <li className="flex items-center gap-2"><Check className="w-4 h-4 text-pink-400" /> Pausar o cancelar recurrencia sin fricciones</li>
                      <li className="flex items-center gap-2"><Check className="w-4 h-4 text-pink-400" /> Vista transparente del impacto directo en cada campaña</li>
                    </ul>
                    <div className="pt-4 flex gap-4">
                      <Link to="/portal" className="px-6 py-3 rounded-xl bg-pink-500 text-white font-bold text-xs hover:opacity-90 transition-opacity flex items-center gap-2">
                        <span>Ir al Portal Donante</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                  <div className="bg-[#0e0e0e] border border-white/10 rounded-2xl p-6 space-y-4 shadow-inner">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-white font-bold">Certificado de Donación #REC-2026-08</span>
                      <span className="text-xs text-pink-400 font-bold">PDF Listo</span>
                    </div>
                    <div className="p-4 rounded-xl bg-pink-500/5 border border-pink-500/20 flex justify-between items-center">
                      <div>
                        <p className="text-white text-sm font-bold">$150.000 CLP</p>
                        <p className="text-gray-400 text-xs">Protección del Zorro Chilote</p>
                      </div>
                      <span className="text-xs font-bold text-pink-300 bg-pink-500/20 px-3 py-1.5 rounded-lg">Descargar</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Grid 4 Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Card 1 */}
              <div className="p-8 rounded-2xl bg-[#1c1b1b]/80 backdrop-blur-md border border-[#2a2a2a] hover:border-[#00a8ff]/50 transition-all group flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#00a8ff]/10 border border-[#00a8ff]/20 flex items-center justify-center text-[#00a8ff] mb-6 group-hover:scale-110 transition-transform">
                    <DollarSign className="w-6 h-6" />
                  </div>
                  <h4 className="text-xl font-bold text-white mb-3 font-headline">Recaudación & Donaciones</h4>
                  <p className="text-sm text-[#bec7d3] leading-relaxed">
                    Integración con pasarelas de pago, seguimiento en tiempo real de aportes únicos y recurrentes.
                  </p>
                </div>
                <button
                  onClick={() => setSelectedModuleTab(0)}
                  className="mt-8 pt-4 border-t border-[#2a2a2a]/50 text-xs font-semibold text-[#00a8ff] flex items-center gap-1 hover:underline text-left"
                >
                  <span>Explorar módulo</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Card 2 */}
              <div className="p-8 rounded-2xl bg-[#1c1b1b]/80 backdrop-blur-md border border-[#2a2a2a] hover:border-[#00d4aa]/50 transition-all group flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#00d4aa]/10 border border-[#00d4aa]/20 flex items-center justify-center text-[#00d4aa] mb-6 group-hover:scale-110 transition-transform">
                    <Users className="w-6 h-6" />
                  </div>
                  <h4 className="text-xl font-bold text-white mb-3 font-headline">Gestión de Socios</h4>
                  <p className="text-sm text-[#bec7d3] leading-relaxed">
                    Directorio de miembros y voluntarios con validación de RUT, estado de cuotas y asignación a misiones.
                  </p>
                </div>
                <button
                  onClick={() => setSelectedModuleTab(1)}
                  className="mt-8 pt-4 border-t border-[#2a2a2a]/50 text-xs font-semibold text-[#00d4aa] flex items-center gap-1 hover:underline text-left"
                >
                  <span>Explorar módulo</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Card 3 */}
              <div className="p-8 rounded-2xl bg-[#1c1b1b]/80 backdrop-blur-md border border-[#2a2a2a] hover:border-[#ffb877]/50 transition-all group flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#ffb877]/10 border border-[#ffb877]/20 flex items-center justify-center text-[#ffb877] mb-6 group-hover:scale-110 transition-transform">
                    <PawPrint className="w-6 h-6" />
                  </div>
                  <h4 className="text-xl font-bold text-white mb-3 font-headline">Biblioteca de Especies</h4>
                  <p className="text-sm text-[#bec7d3] leading-relaxed">
                    Registro de flora y fauna en conservación, clasificación según estado UICN y repositorio multimedia.
                  </p>
                </div>
                <button
                  onClick={() => setSelectedModuleTab(2)}
                  className="mt-8 pt-4 border-t border-[#2a2a2a]/50 text-xs font-semibold text-[#ffb877] flex items-center gap-1 hover:underline text-left"
                >
                  <span>Explorar módulo</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Card 4 */}
              <div className="p-8 rounded-2xl bg-[#1c1b1b]/80 backdrop-blur-md border border-[#2a2a2a] hover:border-[#00a8ff]/50 transition-all group flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#00a8ff]/10 border border-[#00a8ff]/20 flex items-center justify-center text-[#00a8ff] mb-6 group-hover:scale-110 transition-transform">
                    <Compass className="w-6 h-6" />
                  </div>
                  <h4 className="text-xl font-bold text-white mb-3 font-headline">Misiones de Campo</h4>
                  <p className="text-sm text-[#bec7d3] leading-relaxed">
                    Coordinación geoespacial de cuadrillas, tareas de reforestación, limpieza de hábitats y rescate animal.
                  </p>
                </div>
                <button
                  onClick={() => setSelectedModuleTab(3)}
                  className="mt-8 pt-4 border-t border-[#2a2a2a]/50 text-xs font-semibold text-[#00a8ff] flex items-center gap-1 hover:underline text-left"
                >
                  <span>Explorar módulo</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Live Impact Feature Highlight */}
                {/* Por qué Impacta+ */}
        <section id="why-us" className="relative overflow-hidden py-24 md:py-32 border-b border-[#2a2a2a]/40">
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="text-center mb-16">
              <span className="inline-block px-3 py-1 rounded-full bg-[#00d4aa]/10 text-[#00d4aa] text-xs font-bold tracking-widest uppercase mb-4">Diferencia</span>
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4 font-headline">
                Construido <span className="impacta-gradient-text">para la conservación</span>, no adaptada después
              </h2>
              <p className="text-[#bec7d3] text-lg max-w-2xl mx-auto">
                Otros SaaS genéricos funcionan para retailers y fintech. Para ONGs hay problemas específicos: transparencia de fondos, coordinación en terreno, padrón de voluntarios, reporting a donantes. Eso es lo que resolvemos.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-[#161616]/70 border border-[#2a2a2a] rounded-2xl p-8 hover:border-[#00a8ff]/40 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-[#00a8ff]/10 flex items-center justify-center mb-4">
                  <ShieldCheck className="w-6 h-6 text-[#00a8ff]" />
                </div>
                <h3 className="text-xl font-bold mb-2">Multi-tenant estricto</h3>
                <p className="text-[#bec7d3] text-sm leading-relaxed">
                  Cada ONG ve SOLO lo suyo. El middleware verifica el <code className="font-mono text-[#00d4aa]">orgSlug</code> en cada request. Imposible que un usuario lea datos de otra organización, por URL, por token, o por bug.
                </p>
              </div>

              <div className="bg-[#161616]/70 border border-[#2a2a2a] rounded-2xl p-8 hover:border-[#00a8ff]/40 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-[#00d4aa]/10 flex items-center justify-center mb-4">
                  <Compass className="w-6 h-6 text-[#00d4aa]" />
                </div>
                <h3 className="text-xl font-bold mb-2">Diseñado para terreno</h3>
                <p className="text-[#bec7d3] text-sm leading-relaxed">
                  Misiones de campo con tareas asignadas, estados (pendiente → en curso → completada) y bitácora por miembro. Pensado para que funcione desde el celular con conexión intermitente.
                </p>
              </div>

              <div className="bg-[#161616]/70 border border-[#2a2a2a] rounded-2xl p-8 hover:border-[#00a8ff]/40 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-[#00a8ff]/10 flex items-center justify-center mb-4">
                  <DollarSign className="w-6 h-6 text-[#00a8ff]" />
                </div>
                <h3 className="text-xl font-bold mb-2">Donaciones con trazabilidad</h3>
                <p className="text-[#bec7d3] text-sm leading-relaxed">
                  Cada peso donado queda asociado a una campaña, una organización, un donante y un timestamp. Listo para reportar a tu directorio o a la entidad reguladora sin planilla adicional.
                </p>
              </div>

              <div className="bg-[#161616]/70 border border-[#2a2a2a] rounded-2xl p-8 hover:border-[#00a8ff]/40 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-[#00d4aa]/10 flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-[#00d4aa]" />
                </div>
                <h3 className="text-xl font-bold mb-2">Padrón de miembros y voluntarios</h3>
                <p className="text-[#bec7d3] text-sm leading-relaxed">
                  No mezclamos "socios que pagan" con "voluntarios que donan tiempo". Los tratamos como lo que son. Roles y permisos granulares desde el día uno.
                </p>
              </div>
            </div>
          </div>
        </section>

<section id="impact" className="py-24 bg-transparent border-b border-[#2a2a2a]/40">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#00d4aa]/10 text-[#00d4aa] text-xs font-bold mb-4 border border-[#00d4aa]/20">
                <Heart className="w-4 h-4" />
                <span>El impacto que podemos ver</span>
              </div>
              <h3 className="text-3xl md:text-5xl font-extrabold text-white font-headline mb-6 leading-tight">
                Cuando el esfuerzo se organiza, <span className="impacta-gradient-text">el cambio se vuelve visible.</span>
              </h3>
              <p className="text-[#bec7d3] text-base leading-relaxed mb-6">
                El trabajo de una ONG ocurre en muchos lugares y con muchas manos. Impacta+ conecta esas pequeñas acciones para que tu equipo pueda ver el camino recorrido y tu comunidad pueda confiar en el siguiente paso.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#00d4aa] shrink-0 mt-0.5" />
                  <span className="text-sm text-[#e5e2e1]">Cada persona sabe qué puede hacer y cómo sumarse</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#00d4aa] shrink-0 mt-0.5" />
                  <span className="text-sm text-[#e5e2e1]">Cada misión tiene un próximo paso concreto</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#00d4aa] shrink-0 mt-0.5" />
                  <span className="text-sm text-[#e5e2e1]">Cada aporte puede convertirse en una historia de impacto</span>
                </li>
              </ul>
            </div>

            {/* Interactive Mockup Visual */}
            <div className="p-6 rounded-3xl glass-card border border-[#2a2a2a] relative">
              <div className="flex items-center justify-between border-b border-[#2a2a2a]/60 pb-4 mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#ffb4ab]" />
                  <div className="w-3 h-3 rounded-full bg-[#ffb877]" />
                  <div className="w-3 h-3 rounded-full bg-[#00d4aa]" />
                </div>
                <span className="text-xs font-mono text-[#bec7d3]">impacta+ · impacto en movimiento</span>
              </div>
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-[#1c1b1b]/80 border border-[#2a2a2a] flex items-center justify-between">
                  <div>
                    <div className="text-xs text-[#bec7d3]">Una causa tomando fuerza</div>
                    <div className="text-sm font-bold text-white font-headline">Restauración del Humedal 2026</div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#00d4aa]/15 text-[#00d4aa]">78% Completado</span>
                </div>
                <div className="p-4 rounded-xl bg-[#1c1b1b]/80 border border-[#2a2a2a] flex items-center justify-between">
                  <div>
                    <div className="text-xs text-[#bec7d3]">Una nueva persona se sumó</div>
                    <div className="text-sm font-bold text-white font-headline">$150.000 CLP para recuperar el humedal</div>
                  </div>
                  <span className="text-xs font-semibold text-[#00a8ff]">Hace 5 min</span>
                </div>
              </div>
            </div>
          </div>
        </section>



        {/* CTA Bottom Banner */}
        <section className="py-20 bg-transparent relative overflow-hidden">
          <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
            <h2 className="text-3xl md:text-5xl font-extrabold text-white font-headline mb-6">
              ¿Listo para llevar el impacto de tu ONG al siguiente nivel?
            </h2>
            <p className="text-base md:text-lg text-[#bec7d3] mb-8 max-w-xl mx-auto">
              Únete a la red de organizaciones que ya están transformando la conservación ecológica con transparencia y tecnología.
            </p>
            <button
              onClick={() => setShowDemoModal(true)}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-[#00a8ff] to-[#00d4aa] text-[#003352] font-bold text-base hover:opacity-90 transition-opacity shadow-lg shadow-[#00a8ff]/20"
            >
              <span>Solicitar Demostración Gratis</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-auto border-t border-[#2a2a2a]/60 bg-[#0e0e0e]/90 backdrop-blur-md py-12 text-xs text-[#bec7d3]">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="Impacta+" className="w-6 h-6 object-contain" />
              <span className="font-bold text-white font-headline">Impacta+</span>
              <span>— Plataforma SaaS para ONGs y Conservación</span>
            </div>
            <div>
              © {new Date().getFullYear()} Impacta+. Todos los derechos reservados.
            </div>
          </div>
        </footer>
      </div>

      {/* Demo Request Modal */}
      {showDemoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md p-8 rounded-3xl bg-[#1c1b1b] border border-[#2a2a2a] shadow-2xl">
            <button
              onClick={() => setShowDemoModal(false)}
              className="absolute top-6 right-6 text-[#bec7d3] hover:text-white text-xl font-bold"
            >
              ✕
            </button>

            {demoSubmitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-[#00d4aa]/20 text-[#00d4aa] flex items-center justify-center mx-auto mb-4 text-3xl font-bold">
                  ✓
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">¡Solicitud Enviada!</h3>
                <p className="text-sm text-[#bec7d3]">
                  Un especialista de Impacta+ se pondrá en contacto contigo a la brevedad.
                </p>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <img src="/logo.png" alt="Impacta+" className="w-8 h-8 object-contain" />
                    <h3 className="text-2xl font-bold text-white font-headline">Solicitar Demo</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setDemoForm({
                        name: 'Rodrigo Henríquez Valdés',
                        org: 'Fundación Conservación Cordillera de la Costa',
                        email: 'rodrigo.henriquez@cordilleracosta.cl',
                        phone: '+56 9 9876 5432'
                      });
                    }}
                    className="text-[10px] font-bold text-[#00d4aa] bg-[#00d4aa]/10 hover:bg-[#00d4aa]/20 border border-[#00d4aa]/30 px-2.5 py-1 rounded-lg transition-colors"
                  >
                    ⚡ Llenar caso sugerido
                  </button>
                </div>
                <p className="text-xs text-[#bec7d3] mb-6">
                  Completa tus datos o usa el caso sugerido para agendar una demostración personalizada del sistema para tu ONG.
                </p>

                <form onSubmit={handleDemoSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-[#bec7d3] mb-1">Nombre Completo</label>
                    <input
                      type="text"
                      required
                      value={demoForm.name}
                      onChange={(e) => setDemoForm({ ...demoForm, name: e.target.value })}
                      placeholder="Juan Pérez"
                      className="w-full px-4 py-3 rounded-xl bg-[#0e0e0e] border border-[#2a2a2a] text-white text-sm focus:outline-none focus:border-[#00a8ff]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#bec7d3] mb-1">Nombre de la ONG</label>
                    <input
                      type="text"
                      required
                      value={demoForm.org}
                      onChange={(e) => setDemoForm({ ...demoForm, org: e.target.value })}
                      placeholder="Fundación Bosques Nativos"
                      className="w-full px-4 py-3 rounded-xl bg-[#0e0e0e] border border-[#2a2a2a] text-white text-sm focus:outline-none focus:border-[#00a8ff]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#bec7d3] mb-1">Correo Electrónico</label>
                    <input
                      type="email"
                      required
                      value={demoForm.email}
                      onChange={(e) => setDemoForm({ ...demoForm, email: e.target.value })}
                      placeholder="contacto@tuong.org"
                      className="w-full px-4 py-3 rounded-xl bg-[#0e0e0e] border border-[#2a2a2a] text-white text-sm focus:outline-none focus:border-[#00a8ff]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#bec7d3] mb-1">Teléfono (Opcional)</label>
                    <input
                      type="tel"
                      value={demoForm.phone}
                      onChange={(e) => setDemoForm({ ...demoForm, phone: e.target.value })}
                      placeholder="+56 9 1234 5678"
                      className="w-full px-4 py-3 rounded-xl bg-[#0e0e0e] border border-[#2a2a2a] text-white text-sm focus:outline-none focus:border-[#00a8ff]"
                    />
                  </div>

                  {demoError && (
                    <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                      {demoError}
                    </div>
                  )}

                  <div className="pt-2 space-y-3">
                    <button
                      type="submit"
                      disabled={demoSubmitting}
                      className="w-full py-4 rounded-xl bg-gradient-to-r from-[#00a8ff] to-[#00d4aa] text-[#003352] font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {demoSubmitting ? 'Enviando…' : 'Enviar Solicitud de Demostración'}
                    </button>

                    <Link
                      to="/login"
                      onClick={() => setShowDemoModal(false)}
                      className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-white font-semibold text-xs hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
                    >
                      <span>O ingresar directo al Entorno Demo (demo / admin123)</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#00d4aa]" />
                    </Link>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
