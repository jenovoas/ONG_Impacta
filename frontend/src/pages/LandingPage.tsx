import React from 'react';
import { Link } from 'react-router-dom';
import { EarthBackground } from '../components/Background/EarthBackground';

export const LandingPage: React.FC = () => {
  const [showDemoModal, setShowDemoModal] = React.useState(false);
  const [demoSubmitted, setDemoSubmitted] = React.useState(false);
  const [demoForm, setDemoForm] = React.useState({ name: '', email: '', org: '', phone: '' });

  const handleDemoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDemoSubmitted(true);
    setTimeout(() => {
      setShowDemoModal(false);
      setDemoSubmitted(false);
      setDemoForm({ name: '', email: '', org: '', phone: '' });
    }, 2500);
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
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#bec7d3]">
              <a href="#hero" className="hover:text-[#00a8ff] transition-colors">Inicio</a>
              <a href="#modules" className="hover:text-[#00a8ff] transition-colors">Módulos</a>
              <a href="#impact" className="hover:text-[#00a8ff] transition-colors">Impacto Vivo</a>
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
                <span>Acceso ONG</span>
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
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
              <span>SaaS Multi-tenant para Conservación & ONGs Ecológicas</span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.1] font-headline mb-8">
              Gestión transparente y coordinada para la <span className="impacta-gradient-text">restauración del planeta</span>
            </h1>

            <p className="text-lg md:text-xl text-[#bec7d3] max-w-2xl mx-auto mb-10 leading-relaxed">
              Unifica tus socios, campañas de recaudación, inventarios de biodiversidad y misiones de campo en una sola plataforma diseñada para maximizar el impacto de tu ONG.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <button
                onClick={() => setShowDemoModal(true)}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-[#00a8ff] to-[#00d4aa] text-[#003352] font-bold text-base hover:opacity-95 transition-all shadow-xl shadow-[#00a8ff]/25 flex items-center justify-center gap-3"
              >
                <span>Solicitar Demostración</span>
                <span className="material-symbols-outlined text-xl">rocket_launch</span>
              </button>
              <a
                href="#modules"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#1c1b1b]/80 border border-[#2a2a2a] text-[#e5e2e1] font-semibold text-base hover:bg-[#20201f] transition-all flex items-center justify-center gap-2"
              >
                <span>Explorar Módulos</span>
                <span className="material-symbols-outlined text-xl">expand_more</span>
              </a>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto p-6 rounded-2xl glass-card border border-[#2a2a2a]">
              <div className="p-4 text-center">
                <div className="text-3xl font-extrabold text-white font-headline">+120,000</div>
                <div className="text-xs font-medium text-[#bec7d3] mt-1">Especies Monitoreadas</div>
              </div>
              <div className="p-4 text-center border-l border-[#2a2a2a]/60">
                <div className="text-3xl font-extrabold text-[#00a8ff] font-headline">99.8%</div>
                <div className="text-xs font-medium text-[#bec7d3] mt-1">Transparencia en Aportes</div>
              </div>
              <div className="p-4 text-center border-l border-[#2a2a2a]/60">
                <div className="text-3xl font-extrabold text-[#00d4aa] font-headline">+450</div>
                <div className="text-xs font-medium text-[#bec7d3] mt-1">Misiones de Campo</div>
              </div>
              <div className="p-4 text-center border-l border-[#2a2a2a]/60">
                <div className="text-3xl font-extrabold text-[#ffb877] font-headline">15+ ONGs</div>
                <div className="text-xs font-medium text-[#bec7d3] mt-1">Confían en Impacta+</div>
              </div>
            </div>
          </div>
        </section>

        {/* Product Modules Section */}
        <section id="modules" className="py-24 bg-[#131313]/60 backdrop-blur-md border-b border-[#2a2a2a]/40">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-xs uppercase font-bold tracking-widest text-[#00d4aa] mb-3">Módulos Integrados</h2>
              <h3 className="text-3xl md:text-4xl font-bold text-white font-headline">
                Todo lo que tu ONG necesita en un solo lugar
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Card 1 */}
              <div className="p-8 rounded-2xl bg-[#1c1b1b]/80 backdrop-blur-md border border-[#2a2a2a] hover:border-[#00a8ff]/50 transition-all group flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#00a8ff]/10 border border-[#00a8ff]/20 flex items-center justify-center text-[#00a8ff] mb-6 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-2xl">payments</span>
                  </div>
                  <h4 className="text-xl font-bold text-white mb-3 font-headline">Recaudación & Donaciones</h4>
                  <p className="text-sm text-[#bec7d3] leading-relaxed">
                    Integración con pasarelas de pago (ImpactaPay), seguimiento en tiempo real de aportes únicos y recurrentes.
                  </p>
                </div>
                <button
                  onClick={() => setShowDemoModal(true)}
                  className="mt-8 pt-4 border-t border-[#2a2a2a]/50 text-xs font-semibold text-[#00a8ff] flex items-center gap-1 hover:underline text-left"
                >
                  <span>Ver módulo en acción</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </div>

              {/* Card 2 */}
              <div className="p-8 rounded-2xl bg-[#1c1b1b]/80 backdrop-blur-md border border-[#2a2a2a] hover:border-[#00d4aa]/50 transition-all group flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#00d4aa]/10 border border-[#00d4aa]/20 flex items-center justify-center text-[#00d4aa] mb-6 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-2xl">group</span>
                  </div>
                  <h4 className="text-xl font-bold text-white mb-3 font-headline">Gestión de Socios</h4>
                  <p className="text-sm text-[#bec7d3] leading-relaxed">
                    Directorio de miembros y voluntarios con validación de RUT, estado de cuotas y asignación a misiones.
                  </p>
                </div>
                <button
                  onClick={() => setShowDemoModal(true)}
                  className="mt-8 pt-4 border-t border-[#2a2a2a]/50 text-xs font-semibold text-[#00d4aa] flex items-center gap-1 hover:underline text-left"
                >
                  <span>Ver módulo en acción</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </div>

              {/* Card 3 */}
              <div className="p-8 rounded-2xl bg-[#1c1b1b]/80 backdrop-blur-md border border-[#2a2a2a] hover:border-[#ffb877]/50 transition-all group flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#ffb877]/10 border border-[#ffb877]/20 flex items-center justify-center text-[#ffb877] mb-6 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-2xl">pets</span>
                  </div>
                  <h4 className="text-xl font-bold text-white mb-3 font-headline">Biblioteca de Especies</h4>
                  <p className="text-sm text-[#bec7d3] leading-relaxed">
                    Registro de flora y fauna en conservación, clasificación según estado UICN y repositorio multimedia.
                  </p>
                </div>
                <button
                  onClick={() => setShowDemoModal(true)}
                  className="mt-8 pt-4 border-t border-[#2a2a2a]/50 text-xs font-semibold text-[#ffb877] flex items-center gap-1 hover:underline text-left"
                >
                  <span>Ver módulo en acción</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </div>

              {/* Card 4 */}
              <div className="p-8 rounded-2xl bg-[#1c1b1b]/80 backdrop-blur-md border border-[#2a2a2a] hover:border-[#00a8ff]/50 transition-all group flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#00a8ff]/10 border border-[#00a8ff]/20 flex items-center justify-center text-[#00a8ff] mb-6 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-2xl">explore</span>
                  </div>
                  <h4 className="text-xl font-bold text-white mb-3 font-headline">Misiones de Campo</h4>
                  <p className="text-sm text-[#bec7d3] leading-relaxed">
                    Coordinación geoespacial de cuadrillas, tareas de reforestación, limpieza de hábitats y rescate animal.
                  </p>
                </div>
                <button
                  onClick={() => setShowDemoModal(true)}
                  className="mt-8 pt-4 border-t border-[#2a2a2a]/50 text-xs font-semibold text-[#00a8ff] flex items-center gap-1 hover:underline text-left"
                >
                  <span>Ver módulo en acción</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Live Impact Feature Highlight */}
        <section id="impact" className="py-24 bg-transparent border-b border-[#2a2a2a]/40">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#00d4aa]/10 text-[#00d4aa] text-xs font-bold mb-4 border border-[#00d4aa]/20">
                <span className="material-symbols-outlined text-sm">verified</span>
                <span>Aislamiento por Organización (Multi-Tenant)</span>
              </div>
              <h3 className="text-3xl md:text-5xl font-extrabold text-white font-headline mb-6 leading-tight">
                Seguridad total para los datos de tu organización
              </h3>
              <p className="text-[#bec7d3] text-base leading-relaxed mb-6">
                Cada ONG cuenta con una partición de datos completamente aislada a nivel de base de datos gracias a nuestro motor de middleware tenant.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-[#00d4aa] mt-0.5">check_circle</span>
                  <span className="text-sm text-[#e5e2e1]">Aislamiento estricto de base de datos por tenant</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-[#00d4aa] mt-0.5">check_circle</span>
                  <span className="text-sm text-[#e5e2e1]">Roles diferenciados (SuperAdmin, Admin, Operator, Viewer)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-[#00d4aa] mt-0.5">check_circle</span>
                  <span className="text-sm text-[#e5e2e1]">Exportación de datos e informes de impacto para donantes</span>
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
                <span className="text-xs font-mono text-[#bec7d3]">demo.impacta.cl/dashboard</span>
              </div>
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-[#1c1b1b]/80 border border-[#2a2a2a] flex items-center justify-between">
                  <div>
                    <div className="text-xs text-[#bec7d3]">Campaña Activa</div>
                    <div className="text-sm font-bold text-white font-headline">Reforestación Bosque Nactivo 2026</div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#00d4aa]/15 text-[#00d4aa]">78% Completado</span>
                </div>
                <div className="p-4 rounded-xl bg-[#1c1b1b]/80 border border-[#2a2a2a] flex items-center justify-between">
                  <div>
                    <div className="text-xs text-[#bec7d3]">Última Donación Integrada</div>
                    <div className="text-sm font-bold text-white font-headline">$150,000 CLP via ImpactaPay</div>
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
              <span className="material-symbols-outlined">arrow_forward</span>
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
                <div className="flex items-center gap-3 mb-6">
                  <img src="/logo.png" alt="Impacta+" className="w-8 h-8 object-contain" />
                  <h3 className="text-2xl font-bold text-white font-headline">Solicitar Demo</h3>
                </div>
                <p className="text-xs text-[#bec7d3] mb-6">
                  Completa tus datos para agendar una demostración personalizada del sistema para tu ONG.
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

                  <button
                    type="submit"
                    className="w-full py-4 mt-2 rounded-xl bg-gradient-to-r from-[#00a8ff] to-[#00d4aa] text-[#003352] font-bold text-sm hover:opacity-90 transition-opacity"
                  >
                    Enviar Solicitud
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
