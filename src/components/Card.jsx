import { cn } from '@/utils/cn';

export default function Card({ className, children, hover = false, ...rest }) {
  return (
    <div className={cn('card p-5', hover && 'card-hover', className)} {...rest}>
      {children}
    </div>
  );
}

export function CardHeader({ title, subtitle, icon: Icon, action }) {
  return (
    <div className="mb-4 flex items-start justify-between gap-3">
      <div className="flex items-start gap-3">
        {Icon && (
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-accent-primary/10 text-accent-primary">
            <Icon size={18} />
          </span>
        )}
        <div>
          <h3 className="font-display text-base font-semibold text-ink-primary">{title}</h3>
          {subtitle && <p className="mt-0.5 text-sm text-ink-secondary">{subtitle}</p>}
        </div>
      </div>
      {action}
    </div>
  );
}
