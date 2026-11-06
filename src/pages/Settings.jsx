import { useState } from 'react';
import {
  Settings as SettingsIcon,
  Building2,
  User,
  RotateCcw,
  Sparkles,
  Sun,
  Moon,
  Save,
  AlertTriangle,
  Check,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import Card, { CardHeader } from '@/components/Card';
import Modal from '@/components/Modal';
import { INDUSTRIES } from '@/utils/types';
import { cn } from '@/utils/cn';

export default function Settings() {
  const { state, updateBusiness, resetSimulation, restoreSample, notify } = useApp();
  const [form, setForm] = useState({
    companyName: state.business?.companyName || '',
    founderName: state.business?.founderName || '',
    industry: state.business?.industry || '',
    description: state.business?.description || '',
  });
  const [resetOpen, setResetOpen] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [saved, setSaved] = useState(false);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const save = () => {
    if (!form.companyName.trim() || !form.founderName.trim()) {
      notify('Company and founder name cannot be empty', 'warning');
      return;
    }
    updateBusiness({
      companyName: form.companyName.trim(),
      founderName: form.founderName.trim(),
      industry: form.industry,
      description: form.description.trim(),
    });
    setSaved(true);
    notify('Company information updated', 'success');
    setTimeout(() => setSaved(false), 2000);
  };

  const confirmReset = () => {
    resetSimulation();
    notify('Simulation reset', 'info');
    setResetOpen(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">Settings</h1>
        <p className="mt-1 text-sm text-ink-secondary">Manage your business profile and simulation data.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* company info */}
        <Card>
          <CardHeader title="Company Information" subtitle="Edit your business profile" icon={Building2} />
          <div className="space-y-4">
            <div>
              <label className="label">Company name</label>
              <input className="input" value={form.companyName} onChange={(e) => set('companyName', e.target.value)} />
            </div>
            <div>
              <label className="label">Founder name</label>
              <input className="input" value={form.founderName} onChange={(e) => set('founderName', e.target.value)} />
            </div>
            <div>
              <label className="label">Industry</label>
              <select className="input" value={form.industry} onChange={(e) => set('industry', e.target.value)}>
                {INDUSTRIES.map((i) => (
                  <option key={i.id} value={i.id}>{i.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Description</label>
              <textarea className="input min-h-[80px] resize-none" value={form.description} onChange={(e) => set('description', e.target.value)} maxLength={300} />
            </div>
            <button onClick={save} className="btn btn-primary">
              {saved ? <Check size={16} /> : <Save size={16} />}
              {saved ? 'Saved' : 'Save changes'}
            </button>
          </div>
        </Card>

        <div className="space-y-6">
          {/* theme */}
          <Card>
            <CardHeader title="Appearance" subtitle="Theme preference" icon={theme === 'dark' ? Moon : Sun} />
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => { setTheme('dark'); notify('Dark theme is active', 'info'); }}
                className={cn('flex items-center gap-3 rounded-xl border p-4 transition', theme === 'dark' ? 'border-accent-primary bg-accent-primary/10' : 'border-line hover:bg-bg-hover')}
              >
                <Moon size={18} className="text-accent-primary" />
                <span className="text-sm font-medium text-ink-primary">Dark</span>
                {theme === 'dark' && <Check size={14} className="ml-auto text-accent-primary" />}
              </button>
              <button
                onClick={() => notify('Light theme is coming soon — dark is recommended for BizVista.', 'info')}
                className={cn('flex items-center gap-3 rounded-xl border p-4 transition opacity-60', theme !== 'dark' ? 'border-accent-primary' : 'border-line hover:bg-bg-hover')}
              >
                <Sun size={18} className="text-warning" />
                <span className="text-sm font-medium text-ink-primary">Light</span>
                <span className="ml-auto text-[10px] text-ink-muted">Soon</span>
              </button>
            </div>
          </Card>

          {/* sample restore */}
          <Card>
            <CardHeader title="Sample Business" subtitle="Restore the demo company" icon={Sparkles} />
            <p className="text-sm text-ink-secondary">
              Replace your current business with the polished demo company <strong className="text-ink-primary">NovaTech Solutions</strong> and 8 months of realistic simulated history.
            </p>
            <button
              onClick={() => { restoreSample(); notify('Sample business restored', 'success'); }}
              className="btn btn-secondary mt-4"
            >
              <Sparkles size={16} /> Restore sample business
            </button>
          </Card>

          {/* danger zone */}
          <Card className="border-danger/30">
            <CardHeader title="Reset Simulation" subtitle="Erase all data and start fresh" icon={AlertTriangle} />
            <p className="text-sm text-ink-secondary">
              This permanently deletes your business, all simulation history and saved data from this browser. This cannot be undone.
            </p>
            <button onClick={() => setResetOpen(true)} className="btn btn-danger mt-4">
              <RotateCcw size={16} /> Reset everything
            </button>
          </Card>
        </div>
      </div>

      <Modal
        open={resetOpen}
        onClose={() => setResetOpen(false)}
        title="Reset all data?"
        footer={
          <>
            <button onClick={() => setResetOpen(false)} className="btn btn-ghost">Cancel</button>
            <button onClick={confirmReset} className="btn btn-danger">Yes, reset everything</button>
          </>
        }
      >
        <p className="text-sm text-ink-secondary">
          You're about to erase <strong className="text-ink-primary">{state.business?.companyName}</strong> and{' '}
          {state.history.length} months of simulation history. You'll return to the landing page with no data.
        </p>
        <p className="mt-3 text-sm text-ink-secondary">This action is permanent. Consider downloading a CSV report from the Reports page first.</p>
      </Modal>
    </div>
  );
}
