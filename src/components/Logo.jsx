import { cn } from '@/utils/cn';

export default function Logo({ size = 'md', showText = true, className }) {
  const sizes = {
    sm: { box: 'h-8 w-8', bar: 'h-3.5 w-1.5', dot: 'h-1.5 w-1.5', text: 'text-base' },
    md: { box: 'h-9 w-9', bar: 'h-4 w-1.5', dot: 'h-2 w-2', text: 'text-lg' },
    lg: { box: 'h-12 w-12', bar: 'h-5 w-2', dot: 'h-2.5 w-2.5', text: 'text-2xl' },
  };
  const s = sizes[size] || sizes.md;
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <div className={cn('relative grid place-items-center rounded-xl border border-accent-primary/30 bg-bg-sidebar', s.box)}>
        <div className="flex items-end gap-[2px]">
          <div className={cn('rounded-sm bg-accent-primary', s.bar)} />
          <div className={cn('rounded-sm bg-accent-secondary', s.bar)} style={{ height: '60%' }} />
        </div>
      </div>
      {showText && (
        <span className={cn('font-display font-extrabold tracking-tight text-ink-primary', s.text)}>
          Biz<span className="text-accent-primary">Vista</span>
        </span>
      )}
    </div>
  );
}
