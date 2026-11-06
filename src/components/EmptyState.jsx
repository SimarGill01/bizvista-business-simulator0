import { Rocket } from 'lucide-react';

export default function EmptyState({ title, message, action, icon: Icon = Rocket }) {
  return (
    <div className="grid place-items-center px-6 py-16 text-center">
      <div className="max-w-md">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-accent-primary/10 text-accent-primary">
          <Icon size={28} />
        </div>
        <h3 className="mt-5 font-display text-xl font-semibold text-ink-primary">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-ink-secondary">{message}</p>
        {action && <div className="mt-6 flex justify-center">{action}</div>}
      </div>
    </div>
  );
}
