import { useEffect, useState } from 'react';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';
import { useApp } from '@/context/AppContext';

const toneMap = {
  success: { icon: CheckCircle2, cls: 'border-success/30 bg-success/10 text-success' },
  warning: { icon: AlertTriangle, cls: 'border-warning/30 bg-warning/10 text-warning' },
  error: { icon: XCircle, cls: 'border-danger/30 bg-danger/10 text-danger' },
  info: { icon: Info, cls: 'border-info/30 bg-info/10 text-info' },
};

export default function Toast() {
  const { toast } = useApp();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (toast) {
      setVisible(true);
      const t = setTimeout(() => setVisible(false), 3400);
      return () => clearTimeout(t);
    }
  }, [toast]);

  if (!toast) return null;
  const conf = toneMap[toast.tone] || toneMap.info;
  const Icon = conf.icon;

  return (
    <div
      className={`fixed bottom-6 right-6 z-[100] flex max-w-sm items-start gap-3 rounded-xl border px-4 py-3 shadow-card transition-all duration-300 ${conf.cls} ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
      }`}
    >
      <Icon size={18} className="mt-0.5 shrink-0" />
      <p className="text-sm text-ink-primary">{toast.message}</p>
    </div>
  );
}
