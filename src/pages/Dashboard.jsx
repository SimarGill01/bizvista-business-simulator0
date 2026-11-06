import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Banknote,
  Percent,
  HeartPulse,
  Activity,
  PlayCircle,
  Wallet as WalletIcon,
  Megaphone,
  Lightbulb,
  FileBarChart,
  ArrowRight,
  Sparkles,
  Building2,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import StatCard from '@/components/StatCard';
import Card, { CardHeader } from '@/components/Card';
import ChartCard from '@/components/charts/ChartCard';
import { RevenueExpenseChart, ProfitTrendChart, SalesChart } from '@/components/charts/Charts';
import EmptyState from '@/components/EmptyState';
import { INR, INRk, num, pct, monthLabel } from '@/utils/format';
import { avg } from '@/utils/calc';

export default function Dashboard() {
  const { state, navigate, hasBusiness } = useApp();
  if (!hasBusiness) return null;

  const { business, history, cash, healthScore } = state;
  const latest = history[history.length - 1];
  const prev = history[history.length - 2];

  const totalRevenue = history.reduce((a, h) => a + h.revenue, 0);
  const totalExpenses = history.reduce((a, h) => a + h.expenses, 0);
  const netProfit = totalRevenue - totalExpenses;
  const margin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

  const revChange = latest && prev ? ((latest.revenue - prev.revenue) / Math.max(1, prev.revenue)) * 100 : null;
  const profitChange = latest && prev && prev.netProfit !== 0
    ? ((latest.netProfit - prev.netProfit) / Math.abs(prev.netProfit)) * 100
    : null;

  const recent = [...history].slice(-5).reverse();

  const health = (score) => {
    if (score >= 75) return { label: 'Excellent', tone: 'success' };
    if (score >= 55) return { label: 'Healthy', tone: 'primary' };
    if (score >= 40) return { label: 'Fair', tone: 'warning' };
    return { label: 'At risk', tone: 'danger' };
  };
  const h = health(healthScore);

  const quickActions = [
    { label: 'Run Simulation', icon: PlayCircle, route: 'simulator', tone: 'primary' },
    { label: 'Finance Studio', icon: WalletIcon, route: 'finance', tone: 'secondary' },
    { label: 'Marketing Lab', icon: Megaphone, route: 'marketing', tone: 'info' },
    { label: 'View Insights', icon: Lightbulb, route: 'insights', tone: 'warning' },
  ];

  return (
    <div className="space-y-6">
      {/* header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-ink-secondary">
            <Building2 size={15} className="text-accent-primary" />
            {business.industry && <span className="capitalize">{business.industry}</span>}
          </div>
          <h1 className="mt-1 font-display text-2xl font-bold tracking-tight sm:text-3xl">{business.companyName}</h1>
          <p className="mt-1 text-sm text-ink-secondary">
            Founded by {business.founderName} · Simulation month {monthLabel(state.month)}
          </p>
        </div>
        <button onClick={() => navigate('simulator')} className="btn btn-primary self-start px-4 py-2.5">
          <PlayCircle size={16} /> Run Next Month
        </button>
      </div>

      {/* stat grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Revenue" value={INRk(totalRevenue)} icon={TrendingUp} tone="primary" change={revChange} changeLabel="vs last month" />
        <StatCard label="Total Expenses" value={INRk(totalExpenses)} icon={TrendingDown} tone="secondary" change={revChange != null ? -revChange : null} changeLabel="vs last month" />
        <StatCard label="Net Profit" value={INRk(netProfit)} icon={Banknote} tone={netProfit >= 0 ? 'success' : 'danger'} change={profitChange} changeLabel="vs last month" />
        <StatCard label="Available Cash" value={INRk(cash)} icon={Wallet} tone="info" hint={latest ? `After ${monthLabel(latest.month)}` : 'Starting capital'} />
      </div>

      {/* secondary stats + health */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Profit Margin" value={pct(margin)} icon={Percent} tone={margin >= 0 ? 'success' : 'danger'} />
        <StatCard label="Units Sold (latest)" value={num(latest?.unitsSold || 0)} icon={Activity} tone="primary" hint={latest ? monthLabel(latest.month) : ''} />
        <StatCard label="Months Simulated" value={num(history.length)} icon={Sparkles} tone="secondary" hint="of business history" />
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="stat-label">Business Health</span>
            <HeartPulse size={16} className={h.tone === 'danger' ? 'text-danger' : h.tone === 'warning' ? 'text-warning' : h.tone === 'success' ? 'text-success' : 'text-accent-primary'} />
          </div>
          <div className="mt-3 flex items-end gap-2">
            <span className="font-display text-2xl font-bold text-ink-primary">{healthScore}</span>
            <span className="mb-1 text-xs text-ink-secondary">/ 100</span>
          </div>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-bg-input">
            <div
              className={`h-full rounded-full transition-all duration-700 ${h.tone === 'danger' ? 'bg-danger' : h.tone === 'warning' ? 'bg-warning' : h.tone === 'success' ? 'bg-success' : 'bg-accent-primary'}`}
              style={{ width: `${Math.max(4, healthScore)}%` }}
            />
          </div>
          <p className={`mt-2 text-xs font-medium ${h.tone === 'danger' ? 'text-danger' : h.tone === 'warning' ? 'text-warning' : h.tone === 'success' ? 'text-success' : 'text-accent-primary'}`}>
            {h.label}
          </p>
        </Card>
      </div>

      {/* charts */}
      <div className="grid gap-4 lg:grid-cols-3">
        <ChartCard title="Revenue vs Expenses" subtitle="Monthly performance" icon={TrendingUp} className="lg:col-span-2" height={300}>
          <RevenueExpenseChart data={history} />
        </ChartCard>
        <ChartCard title="Profit Trend" subtitle="Net profit per month" icon={Banknote} height={300}>
          <ProfitTrendChart data={history} />
        </ChartCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <ChartCard title="Sales Performance" subtitle="Units sold vs demand" icon={Activity} className="lg:col-span-2" height={280}>
          <SalesChart data={history} />
        </ChartCard>

        {/* quick actions */}
        <Card>
          <CardHeader title="Quick Actions" subtitle="Jump to a workspace" icon={Sparkles} />
          <div className="grid gap-2.5">
            {quickActions.map((a) => {
              const Icon = a.icon;
              const toneCls = {
                primary: 'hover:border-accent-primary/40 hover:bg-accent-primary/5',
                secondary: 'hover:border-accent-secondary/40 hover:bg-accent-secondary/5',
                info: 'hover:border-info/40 hover:bg-info/5',
                warning: 'hover:border-warning/40 hover:bg-warning/5',
              }[a.tone];
              return (
                <button
                  key={a.route}
                  onClick={() => navigate(a.route)}
                  className={`group flex items-center gap-3 rounded-xl border border-line bg-bg-input/40 p-3 text-left transition-all ${toneCls}`}
                >
                  <Icon size={18} className="text-ink-secondary transition group-hover:text-ink-primary" />
                  <span className="text-sm font-medium text-ink-primary">{a.label}</span>
                  <ArrowRight size={14} className="ml-auto text-ink-muted transition group-hover:translate-x-0.5 group-hover:text-ink-primary" />
                </button>
              );
            })}
          </div>
        </Card>
      </div>

      {/* recent activity + monthly summary */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Recent Business Activities" subtitle="Latest simulated months" icon={Activity} />
          {recent.length === 0 ? (
            <EmptyState title="No activity yet" message="Run your first month simulation to start building history." icon={PlayCircle} action={<button onClick={() => navigate('simulator')} className="btn btn-primary">Run Simulation</button>} />
          ) : (
            <div className="space-y-2">
              {recent.map((h) => (
                <div key={h.month} className="flex items-center gap-4 rounded-xl border border-line bg-bg-input/30 p-3 transition hover:bg-bg-hover">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-accent-primary/10 font-mono text-xs font-bold text-accent-primary">
                    M{h.month}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-ink-primary">
                      {monthLabel(h.month)} · {num(h.unitsSold)} units sold
                    </p>
                    <p className="truncate text-xs text-ink-secondary">
                      Revenue {INRk(h.revenue)} · Expenses {INRk(h.expenses)} · Profit {INRk(h.netProfit)}
                    </p>
                  </div>
                  {h.event && (
                    <span className="chip bg-accent-secondary/10 text-accent-secondary">
                      <Sparkles size={11} /> {h.event.label}
                    </span>
                  )}
                  <span className={`text-sm font-semibold ${h.netProfit >= 0 ? 'text-success' : 'text-danger'}`}>
                    {h.netProfit >= 0 ? '+' : ''}{INRk(h.netProfit)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <CardHeader title="Monthly Summary" subtitle="Averages across history" icon={FileBarChart} />
          <div className="space-y-3">
            <SummaryRow label="Avg. monthly revenue" value={INR(avg(history, 'revenue'))} />
            <SummaryRow label="Avg. monthly expenses" value={INR(avg(history, 'expenses'))} />
            <SummaryRow label="Avg. monthly profit" value={INR(avg(history, 'netProfit'))} tone={avg(history, 'netProfit') >= 0 ? 'success' : 'danger'} />
            <SummaryRow label="Avg. units sold" value={num(Math.round(avg(history, 'unitsSold')))} />
            <SummaryRow label="Best month" value={latest ? `${INRk(Math.max(...history.map((h) => h.netProfit)))} profit` : '—'} tone="primary" />
            <SummaryRow label="Profit margin" value={pct(margin)} tone={margin >= 0 ? 'success' : 'danger'} />
          </div>
        </Card>
      </div>
    </div>
  );
}

function SummaryRow({ label, value, tone }) {
  return (
    <div className="flex items-center justify-between border-b border-line/60 pb-3 last:border-0 last:pb-0">
      <span className="text-sm text-ink-secondary">{label}</span>
      <span className={`text-sm font-semibold ${tone === 'success' ? 'text-success' : tone === 'danger' ? 'text-danger' : tone === 'primary' ? 'text-accent-primary' : 'text-ink-primary'}`}>
        {value}
      </span>
    </div>
  );
}
