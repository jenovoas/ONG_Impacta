import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LoginPage } from './pages/Login';
import { RegisterPage } from './pages/Register';
import { LandingPage } from './pages/LandingPage';
import { Overview } from './pages/Overview';
import { Species } from './pages/Species';
import { Donations } from './pages/Donations';
import { Campaigns } from './pages/Campaigns';
import { Missions } from './pages/Missions';
import { Members } from './pages/Members';
import { OrganizationProfile } from './pages/OrganizationProfile';
import { DashboardLayout } from './layouts/DashboardLayout';
import { useAuthStore } from './store/auth.store';

const queryClient = new QueryClient();

const APP_ORIGIN = 'https://app-impacta.pinguinoseguro.cl';
const host = window.location.hostname;
// Regla #1 (AGENTS.md): landing pública SOLO en impacta.*; login/register/
// dashboard SOLO en app-* (la sesión vive en el localStorage de ese dominio).
// Cualquier otro host (localhost/dev) conserva todas las rutas.
const isLandingHost = host === 'impacta.pinguinoseguro.cl';
const isAppHost = host.startsWith('app-');

function ExternalRedirect({ to }: { to: string }) {
  useEffect(() => {
    window.location.replace(to);
  }, [to]);
  return null;
}

function App() {
  const accessToken = useAuthStore((state) => state.accessToken);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        {isLandingHost ? (
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<ExternalRedirect to={`${APP_ORIGIN}/login`} />} />
            <Route path="/register" element={<ExternalRedirect to={`${APP_ORIGIN}/register`} />} />
            <Route path="/dashboard/*" element={<ExternalRedirect to={`${APP_ORIGIN}/dashboard`} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        ) : (
          <Routes>
            <Route
              path="/"
              element={
                isAppHost ? (
                  accessToken ? (
                    <Navigate to="/dashboard/overview" replace />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                ) : (
                  <LandingPage />
                )
              }
            />

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

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        )}
      </Router>
    </QueryClientProvider>
  );
}

export default App;
