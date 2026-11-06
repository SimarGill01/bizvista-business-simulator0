import { useState } from 'react';
import {
  Megaphone,
  Share2,
  Star,
  Search,
  Newspaper,
  Users,
  Target,
  TrendingUp,
  Gauge,
  Rocket,
  Info,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import Card, { CardHeader } from '@/components/Card';
import ChartCard from '@/components/charts/ChartCard';
import { MarketingPie } from '@/components/charts/Charts';
import NumberInput from '@/components/NumberInput';
import { MARKETING_CHANNELS } from '@/utils/types';
import { marketingSummary } from '@/utils/marketing';
import { INR, INRk, num, pct } from '@/utils/format';

const ICONS = { Share2, Star, Search, Newspaper };

export default function MarketingLab() {
  const { state, updateMarketing, notify } = useApp();
  const [budgets, setBudgets] = useState(state.marketing);
  const sp = Number(state.finance.sellingPrice) || 0;
  const cost = Number(state.finance.costPerUnit) || 0;

  const setBudget = (id, v) => {
    const next = { ...budgets, [id]: v };
    setBudgets(next);
    updateMarketing(next);
  };

  const summary = marketingSummary(budgets, sp, cost);

  const totals = [
    { label: 'Total Budget', value: INR(summary.totalBudget), icon: Megaphone, tone: 'primary' },
    { label: 'Estimated Reach', value: num(summary.totalReach), icon: Users, tone: 'secondary' },
    { label: 'Potential Customers', value: num(summary.totalCustomers), icon: Target, tone: 'info' },
    { label: 'Est. Conversions', value: num(summary.totalConversions), icon: TrendingUp, tone: 'success' },
    { label: 'Marketing Efficiency', value: `₹${summary.efficiency.toFixed(2)}`, icon: Gauge, tone: 'warning', hint: 'revenue per ₹ spent' },
    { label: 'Return on MI', value: pct(summary.overallRoi), icon: Rocket, tone: summary.overallRoi >= 0 ? 'success' : 'danger' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">Marketing Lab</h1>
          <p className="mt-1 text-sm text-ink-secondary">
            Allocate budgets across channels and see simulated estimates of reach and return.
          </p>
        </div>
      </div>

      <div className="flex items-start gap-2 rounded-xl border border-info/30 bg-info/10 p-3 text-xs text-info">
        <Info size={14} className="mt-0.5 shrink-0" />
        <span>
          Marketing results are <strong>simulated estimates</strong> for educational purposes — they are
          not real advertising campaign results and do not reflect actual platform performance.
        </span>
      </div>

      {/* total stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {totals.map((t) => {
          const Icon = t.icon;
          const toneCls = {
            primary: 'text-accent-primary bg-accent-primary/10',
            secondary: 'text-accent-secondary bg-accent-secondary/10',
            info: 'text-info bg-info/10',
            success: 'text-success bg-success/10',
            warning: 'text-warning bg-warning/10',
            danger: 'text-danger bg-danger/10',
          }[t.tone];
          return (
            <Card key={t.label} className="p-4">
              <span className={`grid h-8 w-8 place-items-center rounded-lg ${toneCls}`}>
                <Icon size={15} />
              </span>
              <p className="mt-3 stat-label">{t.label}</p>
              <p className="mt-1 font-display text-xl font-bold text-ink-primary">{t.value}</p>
              {t.hint && <p className="text-[11px] text-ink-muted">{t.hint}</p>}
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* channel budget inputs */}
        <Card className="lg:col-span-3">
          <CardHeader title="Channel Budgets" subtitle="Set monthly spend per channel" icon={Megaphone} />
          <div className="grid gap-5 sm:grid-cols-2">
            {MARKETING_CHANNELS.map((ch) => {
              const Icon = ICONS[ch.icon] || Megaphone;
              const est = summary.byChannel.find((c) => c.channel.id === ch.id);
              return (
                <div key={ch.id} className="rounded-xl border border-line bg-bg-input/30 p-4">
                  <div className="mb-3 flex items-center gap-3">
                    <span className="grid h-9 w-9 place-items-center rounded-lg" style={{ backgroundColor: `${ch.color}1a`, color: ch.color }}>
                      <Icon size={17} />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-ink-primary">{ch.label}</p>
                      <p className="truncate text-[11px] text-ink-muted">{ch.blurb}</p>
                    </div>
                  </div>
                  <NumberInput label="Monthly budget" prefix="₹" value={budgets[ch.id] || 0} onChange={(v) => setBudget(ch.id, v)} min={0} step={500} />
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <p className="text-ink-muted">Reach</p>
                      <p className="font-semibold text-ink-primary">{num(est.reach)}</p>
                    </div>
                    <div>
                      <p className="text-ink-muted">ROI</p>
                      <p className={`font-semibold ${est.roi >= 0 ? 'text-success' : 'text-danger'}`}>{pct(est.roi)}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* pie + breakdown */}
        <div className="space-y-6 lg:col-span-2">
          <ChartCard title="Budget Allocation" subtitle="Share of spend by channel" icon={Target} height={240}>
            <MarketingPie data={summary.byChannel.filter((c) => c.budget > 0)} />
          </ChartCard>
          <Card>
            <CardHeader title="Channel Comparison" subtitle="Estimated conversions" icon={TrendingUp} />
            <div className="space-y-2.5">
              {summary.byChannel.map((c) => {
                const maxConv = Math.max(1, ...summary.byChannel.map((x) => x.conversions));
                return (
                  <div key={c.channel.id}>
                    <div className="mb-1 flex items-center justify-between text-xs">
                      <span className="text-ink-secondary">{c.channel.label}</span>
                      <span className="font-semibold text-ink-primary">{num(c.conversions)}</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-bg-input">
                      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${(c.conversions / maxConv) * 100}%`, backgroundColor: c.channel.color }} />
                    </div>
                  </div>
                );
              })}
              {summary.totalBudget === 0 && <p className="text-sm text-ink-muted">Set a budget to see estimates.</p>}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
