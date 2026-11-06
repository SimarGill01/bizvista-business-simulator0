import { ArrowRight, Target, Wallet, TrendingUp, BarChart3, Sparkles, ShieldCheck } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import Logo from '@/components/Logo';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const demoData = [
  { m: 'M1', v: 180 }, { m: 'M2', v: 240 }, { m: 'M3', v: 210 },
  { m: 'M4', v: 320 }, { m: 'M5', v: 380 }, { m: 'M6', v: 460 },
  { m: 'M7', v: 540 }, { m: 'M8', v: 690 },
];

const highlights = [
  { icon: Target, title: 'Strategy', desc: 'Pick an industry, price your product and outmaneuver the market.', tone: 'text-accent-primary bg-accent-primary/10' },
  { icon: Wallet, title: 'Finance', desc: 'Track revenue, costs, break-even and profit with transparent math.', tone: 'text-accent-secondary bg-accent-secondary/10' },
  { icon: TrendingUp, title: 'Growth', desc: 'Run month-by-month simulations and watch your empire expand.', tone: 'text-success bg-success/10' },
];

export default function Landing() {
  const { navigate, state, restoreSample, notify } = useApp();

  const start = () => {
    if (state.business) navigate('dashboard');
    else navigate('setup');
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-bg-base text-ink-primary">
      {/* ambient background */}
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-40" />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[480px] w-[820px] -translate-x-1/2 radial-glow" />

      {/* nav */}
      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-10">
        <Logo size="lg" />
        <div className="flex items-center gap-3">
          <button
            onClick={() => { restoreSample(); notify('Sample business restored', 'success'); }}
            className="hidden rounded-xl border border-line bg-bg-card/60 px-4 py-2 text-sm font-medium text-ink-secondary transition hover:text-ink-primary sm:inline-flex"
          >
            Try demo
          </button>
          <button onClick={start} className="btn btn-primary">
            Get Started <ArrowRight size={16} />
          </button>
        </div>
      </header>

      {/* hero */}
      <section className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 px-6 pt-10 pb-20 lg:grid-cols-2 lg:px-10 lg:pt-16">
        <div className="animate-fadeIn">
          <span className="chip border border-accent-primary/30 bg-accent-primary/10 text-accent-primary">
            <Sparkles size={12} /> The Business Empire Simulator
          </span>
          <h1 className="mt-5 font-display text-4xl font-extrabold leading-[1.1] tracking-tight text-balance sm:text-5xl lg:text-6xl">
            Your Business. <br />
            Your Decisions. <br />
            <span className="bg-gradient-to-r from-accent-primary to-accent-secondary bg-clip-text text-transparent">
              Your Empire.
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-ink-secondary sm:text-lg">
            BizVista is an interactive business simulator built for aspiring entrepreneurs.
            Create a virtual company, manage its finances, run marketing campaigns, simulate
            month-by-month operations, and watch real numbers drive your empire's growth.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button onClick={start} className="btn btn-primary px-5 py-3 text-base">
              Build Your Empire <ArrowRight size={18} />
            </button>
            <button
              onClick={() => { restoreSample(); notify('Sample business restored', 'success'); }}
              className="btn btn-ghost px-5 py-3 text-base"
            >
              Explore demo business
            </button>
          </div>
          <div className="mt-8 flex items-center gap-6 text-sm text-ink-muted">
            <span className="inline-flex items-center gap-2"><ShieldCheck size={15} className="text-success" /> No sign-up needed</span>
            <span className="inline-flex items-center gap-2"><BarChart3 size={15} className="text-accent-primary" /> Real calculations</span>
          </div>
        </div>

        {/* analytics visual */}
        <div className="animate-scaleIn">
          <div className="relative rounded-3xl border border-line bg-bg-card/60 p-6 shadow-card backdrop-blur-xl">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider text-ink-secondary">Revenue growth</p>
                <p className="font-display text-2xl font-bold">₹6.9L <span className="text-sm font-medium text-success">+28%</span></p>
              </div>
              <span className="chip bg-accent-primary/10 text-accent-primary">
                <TrendingUp size={12} /> Live demo
              </span>
            </div>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={demoData} margin={{ top: 6, right: 6, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="hero" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#B8F34A" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="#B8F34A" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27384F" />
                  <XAxis dataKey="m" tick={{ fill: '#94A3B8', fontSize: 12 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fill: '#94A3B8', fontSize: 12 }} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ background: '#101827', border: '1px solid #27384F', borderRadius: 12 }}
                    labelStyle={{ color: '#F5F7FA' }}
                  />
                  <Area type="monotone" dataKey="v" stroke="#B8F34A" strokeWidth={3} fill="url(#hero)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3">
              {[['Revenue', '₹6.9L', 'text-accent-primary'], ['Profit', '₹2.1L', 'text-success'], ['Health', '84', 'text-accent-secondary']].map(([l, v, c]) => (
                <div key={l} className="rounded-xl border border-line bg-bg-input/60 p-3">
                  <p className="text-[11px] uppercase tracking-wide text-ink-muted">{l}</p>
                  <p className={`mt-1 font-display text-lg font-bold ${c}`}>{v}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* highlights */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 pb-20 lg:px-10">
        <div className="grid gap-5 sm:grid-cols-3">
          {highlights.map((h) => {
            const Icon = h.icon;
            return (
              <div key={h.title} className="card card-hover p-6">
                <span className={`grid h-11 w-11 place-items-center rounded-xl ${h.tone}`}>
                  <Icon size={20} />
                </span>
                <h3 className="mt-4 font-display text-lg font-semibold">{h.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-secondary">{h.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      <footer className="relative z-10 border-t border-line py-8 text-center text-sm text-ink-muted">
        <p>BizVista — Build. Manage. Grow. Your Business Empire.</p>
        <p className="mt-1">An educational business simulator. All data is fictional and stays on your device.</p>
      </footer>
    </div>
  );
}
