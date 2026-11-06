import {
  LayoutDashboard,
  Wallet,
  Megaphone,
  PlayCircle,
  Lightbulb,
  FileBarChart,
  Settings,
  X,
  Rocket,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { cn } from '@/utils/cn';
import Logo from '@/components/Logo';
import { monthLabel } from '@/utils/format';

const NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'finance', label: 'Finance Studio', icon: Wallet },
  { id: 'marketing', label: 'Marketing Lab', icon: Megaphone },
  { id: 'simulator', label: 'Simulator', icon: PlayCircle },
  { id: 'insights', label: 'Insights', icon: Lightbulb },
  { id: 'reports', label: 'Reports', icon: FileBarChart },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ open, onClose }) {
  const { route, navigate, state, hasBusiness } = useApp();

  if (!hasBusiness) return null;

  return (
    <>
      {/* mobile overlay */}
      <div
        className={cn(
          'fixed inset-0 z-40 bg-bg-base/60 backdrop-blur-sm transition-opacity lg:hidden',
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
        onClick={onClose}
      />
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-line bg-bg-sidebar transition-transform duration-300 lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-16 shrink-0 items-center justify-between px-5">
          <button onClick={() => navigate('dashboard')} className="transition hover:opacity-80">
            <Logo />
          </button>
          <button onClick={onClose} className="rounded-lg p-1.5 text-ink-secondary hover:bg-bg-hover lg:hidden">
            <X size={18} />
          </button>
        </div>

        {/* business mini-card */}
        <div className="mx-4 mb-4 rounded-xl border border-line bg-bg-card/60 p-3">
          <p className="truncate text-sm font-semibold text-ink-primary">{state.business?.companyName}</p>
          <p className="truncate text-xs text-ink-secondary">{state.business?.founderName}</p>
          <div className="mt-2 flex items-center gap-2 text-xs">
            <span className="chip bg-accent-primary/10 text-accent-primary">
              <Rocket size={11} /> Month {monthLabel(state.month)}
            </span>
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 scrollbar-thin">
          {NAV.map((item) => {
            const active = route === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  navigate(item.id);
                  onClose();
                }}
                className={cn(
                  'group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                  active
                    ? 'bg-accent-primary/10 text-accent-primary shadow-[inset_0_0_0_1px_rgba(184,243,74,0.18)]'
                    : 'text-ink-secondary hover:bg-bg-hover hover:text-ink-primary'
                )}
              >
                <Icon size={18} className={cn('transition-transform group-hover:scale-110', active && 'text-accent-primary')} />
                {item.label}
                {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-accent-primary" />}
              </button>
            );
          })}
        </nav>

        <div className="border-t border-line p-4">
          <p className="text-[11px] leading-relaxed text-ink-muted">
            BizVista is an educational business simulator. All financial figures are simulated.
          </p>
        </div>
      </aside>
    </>
  );
}
