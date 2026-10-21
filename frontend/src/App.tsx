import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { lazy, Suspense, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LoaderCircle } from 'lucide-react';
import { DashboardLayout } from './layouts/DashboardLayout';
import { useAuthStore } from './store/auth.store';

const LoginPage = lazy(() => import('./pages/Login').then(({ LoginPage }) => ({ default: LoginPage })));
const RegisterPage = lazy(() => import('./pages/Register').then(({ RegisterPage }) => ({ default: RegisterPage })));
const LandingPage = lazy(() => import('./pages/LandingPage').then(({ LandingPage }) => ({ default: LandingPage })));
const Overview = lazy(() => import('./pages/Overview').then(({ Overview }) => ({ default: Overview })));
const Species = lazy(() => import('./pages/Species').then(({ Species }) => ({ default: Species })));
const Donations = lazy(() => import('./pages/Donations').then(({ Donations }) => ({ default: Donations })));
const Campaigns = lazy(() => import('./pages/Campaigns').then(({ Campaigns }) => ({ default: Campaigns })));
const Missions = lazy(() => import('./pages/Missions').then(({ Missions }) => ({ default: Missions })));
const Members = lazy(() => import('./pages/Members').then(({ Members }) => ({ default: Members })));
const OrganizationProfile = lazy(() => import('./pages/OrganizationProfile').then(({ OrganizationProfile }) => ({ default: OrganizationProfile })));
const PortalDonante = lazy(() => import('./pages/PortalDonante').then(({ PortalDonante }) => ({ default: PortalDonante })));
const queryClient = new QueryClient();

// Un solo dominio usuario-facing: impacta.pinguinoseguro.cl sirve landing
// (/), login, registro y dashboard. app-* quedó como legado y redirige ahí,
// porque la sesión vive en el localStorage de UN dominio (zustand persist).

function LegacyDomainRedirect() {
  const { pathname, search } = useLocation();
  useEffect(() => {
    if (window.location.hostname.startsWith('app-')) {
      window.location.replace(`https://impacta.pinguinoseguro.cl${pathname}${search}`);
    }
  }, [pathname, search]);
  return null;
}

function RouteLoading() {
  return (
    <main role="status" className="grid min-h-screen place-items-center bg-surface-container-lowest text-on-surface">
      <div className="flex items-center gap-3 rounded-2xl bg-surface-container px-5 py-4">
        <LoaderCircle aria-hidden="true" className="h-5 w-5 animate-spin text-primary" />
        <span className="text-sm">Cargando Impacta+…</span>
      </div>
    </main>
  );
}

function App() {
  const accessToken = useAuthStore((state) => state.accessToken);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <LegacyDomainRedirect />
        <Suspense fallback={<RouteLoading />}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route
              path="/login"
              element={accessToken ? <Navigate to="/dashboard/overview" /> : <LoginPage />}
            />
            <Route
              path="/register"
              element={accessToken ? <Navigate to="/dashboard/overview" /> : <RegisterPage />}
            />
            <Route
              path="/dashboard"
              element={accessToken ? <DashboardLayout /> : <Navigate to="/login" />}
            >
              <Route index element={<Navigate to="overview" />} />
              <Route path="overview" element={<Overview />} />
              <Route path="donations" element={<Donations />} />
              <Route path="campaigns" element={<Campaigns />} />
              <Route path="species" element={<Species />} />
              <Route path="missions" element={<Missions />} />
              <Route path="members" element={<Members />} />
              <Route path="organization" element={<OrganizationProfile />} />
            </Route>
            <Route
              path="/portal"
              element={accessToken ? <PortalDonante /> : <Navigate to="/login" />}
            />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Suspense>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
