import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
import { PortalDonante } from './pages/PortalDonante';
import { DashboardLayout } from './layouts/DashboardLayout';
import { useAuthStore } from './store/auth.store';

const queryClient = new QueryClient();

// Un solo dominio usuario-facing: impacta.pinguinoseguro.cl sirve landing
// (/), login, registro y dashboard. app-* quedó como legado y redirige ahí,
// porque la sesión vive en el localStorage de UN dominio (zustand persist).

function App() {
  const accessToken = useAuthStore((state) => state.accessToken);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
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
      </Router>
    </QueryClientProvider>
  );
}

export default App;
