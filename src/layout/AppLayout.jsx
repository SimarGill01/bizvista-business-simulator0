import { useState } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { useApp } from '@/context/AppContext';

export default function AppLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { hasBusiness } = useApp();

  if (!hasBusiness) return <main className="min-h-screen">{children}</main>;

  return (
    <div className="min-h-screen bg-bg-base">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="lg:pl-72">
        <Topbar onMenu={() => setSidebarOpen(true)} />
        <main className="px-4 py-6 lg:px-8 lg:py-8">
          <div key={location.pathname} className="animate-fadeIn">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
