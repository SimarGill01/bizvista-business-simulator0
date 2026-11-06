import { AppProvider, useApp } from '@/context/AppContext';
import AppLayout from '@/layout/AppLayout';
import Toast from '@/components/Toast';
import Landing from '@/pages/Landing';
import BusinessSetup from '@/pages/BusinessSetup';
import Dashboard from '@/pages/Dashboard';
import FinanceStudio from '@/pages/FinanceStudio';
import MarketingLab from '@/pages/MarketingLab';
import Simulator from '@/pages/Simulator';
import Insights from '@/pages/Insights';
import Reports from '@/pages/Reports';
import Settings from '@/pages/Settings';

const ROUTES = {
  landing: Landing,
  setup: BusinessSetup,
  dashboard: Dashboard,
  finance: FinanceStudio,
  marketing: MarketingLab,
  simulator: Simulator,
  insights: Insights,
  reports: Reports,
  settings: Settings,
};

function Router() {
  const { route } = useApp();
  const Page = ROUTES[route] || Dashboard;
  const Component = Page as React.ComponentType;
  return <Component />;
}

function Shell() {
  const { route } = useApp();
  return (
    <AppLayout>
      <Router key={route} />
    </AppLayout>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Shell />
      <Toast />
    </AppProvider>
  );
}
