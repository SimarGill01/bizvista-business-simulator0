import { useState } from 'react';
import { ArrowLeft, ArrowRight, Cpu, Shirt, UtensilsCrossed, ShoppingBag, GraduationCap, HeartPulse, Check, Building2 } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { INDUSTRIES, CAPITAL_OPTIONS } from '@/utils/types';
import Logo from '@/components/Logo';
import { cn } from '@/utils/cn';

const ICONS = { Cpu, Shirt, UtensilsCrossed, ShoppingBag, GraduationCap, HeartPulse };

export default function BusinessSetup() {
  const { navigate, createBusiness, notify } = useApp();
  const [form, setForm] = useState({
    companyName: '',
    founderName: '',
    industry: '',
    startingCapital: 500000,
    description: '',
  });
  const [errors, setErrors] = useState({});

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.companyName.trim()) e.companyName = 'Company name is required';
    else if (form.companyName.trim().length < 2) e.companyName = 'Too short';
    if (!form.founderName.trim()) e.founderName = 'Founder name is required';
    if (!form.industry) e.industry = 'Select an industry';
    if (!form.startingCapital) e.startingCapital = 'Choose starting capital';
    if (form.description && form.description.length > 300) e.description = 'Keep it under 300 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = (ev) => {
    ev.preventDefault();
    if (!validate()) {
      notify('Please fix the highlighted fields', 'warning');
      return;
    }
    createBusiness({
      companyName: form.companyName.trim(),
      founderName: form.founderName.trim(),
      industry: form.industry,
      startingCapital: form.startingCapital,
      description: form.description.trim(),
    });
    notify('Your business has been created', 'success');
  };

  return (
    <div className="relative min-h-screen bg-bg-base text-ink-primary">
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-30" />
      <div className="pointer-events-none absolute -top-32 left-1/2 h-96 w-[700px] -translate-x-1/2 radial-glow" />

      <header className="relative z-10 mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
        <Logo size="md" />
        <button onClick={() => navigate('landing')} className="btn btn-ghost">
          <ArrowLeft size={16} /> Back
        </button>
      </header>

      <main className="relative z-10 mx-auto max-w-5xl px-6 pb-20">
        <div className="mb-8 text-center">
          <span className="chip border border-accent-secondary/30 bg-accent-secondary/10 text-accent-secondary">
            <Building2 size={12} /> Business Setup
          </span>
          <h1 className="mt-4 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">Create your virtual company</h1>
          <p className="mx-auto mt-3 max-w-xl text-ink-secondary">
            Tell BizVista about your business. You can change everything later from Settings.
          </p>
        </div>

        <form onSubmit={submit} className="card animate-fadeIn p-6 sm:p-8">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="label">Company name</label>
              <input
                className="input"
                placeholder="e.g. NovaTech Solutions"
                value={form.companyName}
                onChange={(e) => set('companyName', e.target.value)}
              />
              {errors.companyName && <p className="mt-1 text-xs text-danger">{errors.companyName}</p>}
            </div>
            <div>
              <label className="label">Founder name</label>
              <input
                className="input"
                placeholder="e.g. Aarav Mehta"
                value={form.founderName}
                onChange={(e) => set('founderName', e.target.value)}
              />
              {errors.founderName && <p className="mt-1 text-xs text-danger">{errors.founderName}</p>}
            </div>
          </div>

          <div className="mt-6">
            <label className="label">Choose your industry</label>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {INDUSTRIES.map((ind) => {
                const Icon = ICONS[ind.icon] || Building2;
                const active = form.industry === ind.id;
                return (
                  <button
                    type="button"
                    key={ind.id}
                    onClick={() => set('industry', ind.id)}
                    className={cn(
                      'group flex items-start gap-3 rounded-xl border p-4 text-left transition-all',
                      active
                        ? 'border-accent-primary bg-accent-primary/10 shadow-glow'
                        : 'border-line bg-bg-input/40 hover:border-ink-muted hover:bg-bg-hover'
                    )}
                  >
                    <span className={cn('grid h-10 w-10 shrink-0 place-items-center rounded-lg', active ? 'bg-accent-primary text-bg-base' : 'bg-bg-hover text-ink-secondary')}>
                      <Icon size={18} />
                    </span>
                    <div className="min-w-0">
                      <p className="font-semibold text-ink-primary">{ind.label}</p>
                      <p className="truncate text-xs text-ink-secondary">{ind.blurb}</p>
                    </div>
                    {active && <Check size={16} className="ml-auto text-accent-primary" />}
                  </button>
                );
              })}
            </div>
            {errors.industry && <p className="mt-1 text-xs text-danger">{errors.industry}</p>}
          </div>

          <div className="mt-6">
            <label className="label">Starting capital</label>
            <div className="grid gap-3 sm:grid-cols-3">
              {CAPITAL_OPTIONS.map((c) => {
                const active = form.startingCapital === c.value;
                return (
                  <button
                    type="button"
                    key={c.id}
                    onClick={() => set('startingCapital', c.value)}
                    className={cn(
                      'rounded-xl border p-4 text-left transition-all',
                      active ? 'border-accent-primary bg-accent-primary/10 shadow-glow' : 'border-line bg-bg-input/40 hover:border-ink-muted hover:bg-bg-hover'
                    )}
                  >
                    <p className="font-display text-lg font-bold text-ink-primary">{c.label}</p>
                    <p className="text-xs text-ink-secondary">{c.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-6">
            <label className="label">Business description <span className="text-ink-muted">(optional)</span></label>
            <textarea
              className="input min-h-[96px] resize-none"
              placeholder="What does your company do? Who are your customers?"
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              maxLength={300}
            />
            <div className="mt-1 flex justify-between text-xs">
              <span className="text-danger">{errors.description}</span>
              <span className="text-ink-muted">{form.description.length}/300</span>
            </div>
          </div>

          <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button type="button" onClick={() => navigate('landing')} className="btn btn-ghost">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary px-5 py-3 text-base">
              Create business <ArrowRight size={18} />
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
