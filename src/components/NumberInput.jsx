import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/utils/cn';

export default function NumberInput({
  label,
  value,
  onChange,
  prefix,
  suffix,
  min = 0,
  max,
  step = 1,
  hint,
  icon: Icon,
}) {
  const num = Number(value) || 0;
  const setVal = (v) => {
    const clamped = Math.max(min, v);
    onChange(clamped);
  };
  return (
    <div>
      <label className="label">{label}</label>
      <div className="relative flex items-center">
        {Icon && (
          <span className="pointer-events-none absolute left-3 text-ink-muted">
            <Icon size={16} />
          </span>
        )}
        {prefix && <span className="pointer-events-none absolute left-3 text-sm text-ink-secondary">{prefix}</span>}
        <input
          type="number"
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={(e) => setVal(parseFloat(e.target.value) || 0)}
          className={cn('input', (Icon || prefix) && 'pl-8', suffix && 'pr-12')}
        />
        {suffix && <span className="pointer-events-none absolute right-3 text-sm text-ink-secondary">{suffix}</span>}
      </div>
      {hint && <p className="mt-1.5 text-xs text-ink-muted">{hint}</p>}
    </div>
  );
}

export function Slider({ label, value, onChange, min = 0, max = 100, step = 1, format, tone = 'primary' }) {
  const toneClass = tone === 'secondary' ? 'accent-secondary' : 'accent-primary';
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <label className="text-sm font-medium text-ink-secondary">{label}</label>
        <span className="font-mono text-sm font-semibold text-ink-primary">{format ? format(value) : value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className={cn('h-1.5 w-full cursor-pointer appearance-none rounded-full bg-bg-input', `accent-${toneClass}`)}
        style={{ accentColor: tone === 'secondary' ? '#7C83FF' : '#B8F34A' }}
      />
    </div>
  );
}
