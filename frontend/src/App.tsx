import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LoginPage } from './pages/Login';
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

function App() {
  const token = useAuthStore((state) => state.token);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route 
            path="/login" 
            element={token ? <Navigate to="/dashboard/overview" /> : <LoginPage />} 
          />
          
          <Route 
            path="/dashboard" 
            element={token ? <DashboardLayout /> : <Navigate to="/login" />}
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

          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
