import { Menu, Bell, Search, Building2 } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import Logo from '@/components/Logo';
import { INRk, monthLabel } from '@/utils/format';

export default function Topbar({ onMenu }) {
  const { state, hasBusiness } = useApp();
  if (!hasBusiness) return null;

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-line bg-bg-base/80 px-4 backdrop-blur-xl lg:px-8">
      <button onClick={onMenu} className="rounded-lg p-2 text-ink-secondary hover:bg-bg-hover lg:hidden">
        <Menu size={20} />
      </button>

      <div className="lg:hidden">
        <Logo size="sm" showText={false} />
      </div>

      <div className="hidden flex-1 items-center gap-3 md:flex">
        <div className="relative max-w-xs flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
          <input
            placeholder="Search BizVista…"
            className="h-9 w-full rounded-lg border border-line bg-bg-input pl-9 pr-3 text-sm text-ink-primary placeholder-ink-muted outline-none focus:border-accent-primary/50"
          />
        </div>
      </div>

      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        <div className="hidden items-center gap-2 rounded-lg border border-line bg-bg-card px-3 py-1.5 sm:flex">
          <Building2 size={14} className="text-accent-primary" />
          <span className="text-xs font-medium text-ink-secondary">Cash</span>
          <span className="text-sm font-semibold text-ink-primary">{INRk(state.cash)}</span>
        </div>
        <div className="hidden items-center gap-2 rounded-lg border border-line bg-bg-card px-3 py-1.5 sm:flex">
          <span className="text-xs font-medium text-ink-secondary">Month</span>
          <span className="text-sm font-semibold text-ink-primary">{monthLabel(state.month)}</span>
        </div>
        <button className="relative rounded-lg border border-line bg-bg-card p-2 text-ink-secondary transition hover:text-ink-primary">
          <Bell size={16} />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-accent-primary" />
        </button>
        <div className="grid h-9 w-9 place-items-center rounded-full bg-accent-secondary/15 text-sm font-bold text-accent-secondary">
          {(state.business?.founderName || '?').slice(0, 1).toUpperCase()}
        </div>
      </div>
    </header>
  );
}
