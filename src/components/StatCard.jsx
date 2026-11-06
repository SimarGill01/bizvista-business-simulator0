import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn } from '@/utils/cn';

export default function StatCard({ label, value, icon: Icon, tone = 'primary', change, changeLabel, hint }) {
  const tones = {
    primary: 'text-accent-primary bg-accent-primary/10',
    secondary: 'text-accent-secondary bg-accent-secondary/10',
    success: 'text-success bg-success/10',
    warning: 'text-warning bg-warning/10',
    danger: 'text-danger bg-danger/10',
    info: 'text-info bg-info/10',
  };
  const positive = typeof change === 'number' && change > 0;
  const negative = typeof change === 'number' && change < 0;

  return (
    <div className="card card-hover p-5">
      <div className="flex items-center justify-between">
        <span className="stat-label">{label}</span>
        {Icon && (
          <span className={cn('grid h-8 w-8 place-items-center rounded-lg', tones[tone])}>
            <Icon size={16} />
          </span>
        )}
      </div>
      <div className="mt-3 font-display text-2xl font-bold tracking-tight text-ink-primary">
        {value}
      </div>
      <div className="mt-2 flex items-center gap-2 text-xs">
        {typeof change === 'number' && (
          <span
            className={cn(
              'inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 font-medium',
              positive && 'bg-success/10 text-success',
              negative && 'bg-danger/10 text-danger',
              !positive && !negative && 'bg-bg-hover text-ink-secondary'
            )}
          >
            {positive ? <ArrowUpRight size={12} /> : negative ? <ArrowDownRight size={12} /> : null}
            {change > 0 ? '+' : ''}
            {typeof change === 'number' ? `${change.toFixed(1)}%` : ''}
          </span>
        )}
        {(changeLabel || hint) && <span className="text-ink-secondary">{changeLabel || hint}</span>}
      </div>
    </div>
  );
}
