import {
  Lightbulb,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Info,
  TrendingUp,
  Target,
  Percent,
  Activity,
  Gauge,
  ThumbsUp,
  AlertOctagon,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import Card, { CardHeader } from '@/components/Card';
import { generateInsights } from '@/utils/insights';
import { INR, num, pct } from '@/utils/format';

const TYPE = {
  positive: { icon: CheckCircle2, cls: 'border-success/30 bg-success/10 text-success', badge: 'Strength' },
  info: { icon: Info, cls: 'border-info/30 bg-info/10 text-info', badge: 'Note' },
  warning: { icon: AlertTriangle, cls: 'border-warning/30 bg-warning/10 text-warning', badge: 'Watch' },
  critical: { icon: XCircle, cls: 'border-danger/30 bg-danger/10 text-danger', badge: 'Critical' },
};

export default function Insights() {
  const { state } = useApp();
  const insights = generateInsights(state);

  const perf = [
    { label: 'Financial performance', icon: TrendingUp, value: scoreLabel(state, 'finance'), tone: toneForScore(state, 'finance') },
    { label: 'Sales growth', icon: Activity, value: scoreLabel(state, 'sales'), tone: toneForScore(state, 'sales') },
    { label: 'Profitability', icon: Percent, value: scoreLabel(state, 'profit'), tone: toneForScore(state, 'profit') },
    { label: 'Marketing efficiency', icon: Gauge, value: scoreLabel(state, 'marketing'), tone: toneForScore(state, 'marketing') },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">Business Insights</h1>
        <p className="mt-1 text-sm text-ink-secondary">
          Evidence-based analysis and recommendations generated from your real numbers.
        </p>
      </div>

      {/* performance scores */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {perf.map((p) => {
          const Icon = p.icon;
          const toneCls = {
            success: 'text-success bg-success/10',
            primary: 'text-accent-primary bg-accent-primary/10',
            warning: 'text-warning bg-warning/10',
            danger: 'text-danger bg-danger/10',
          }[p.tone];
          return (
            <Card key={p.label} className="p-4">
              <span className={`grid h-8 w-8 place-items-center rounded-lg ${toneCls}`}>
                <Icon size={15} />
              </span>
              <p className="mt-3 stat-label">{p.label}</p>
              <p className="mt-1 font-display text-lg font-bold text-ink-primary">{p.value}</p>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* recommendations */}
        <Card className="lg:col-span-2">
          <CardHeader title="Recommendations" subtitle="Based on your current numbers" icon={Lightbulb} />
          <div className="space-y-3">
            {insights.recommendations.map((r, i) => {
              const conf = TYPE[r.type] || TYPE.info;
              const Icon = conf.icon;
              return (
                <div key={i} className={`flex items-start gap-3 rounded-xl border p-4 ${conf.cls}`}>
                  <Icon size={18} className="mt-0.5 shrink-0" />
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-ink-primary">{r.title}</p>
                      <span className="chip bg-white/5 text-ink-secondary">{conf.badge}</span>
                    </div>
                    <p className="mt-1 text-sm leading-relaxed text-ink-secondary">{r.body}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* strengths + improvements */}
        <div className="space-y-6">
          <Card>
            <CardHeader title="Strengths" icon={ThumbsUp} />
            {insights.strengths.length === 0 ? (
              <p className="text-sm text-ink-muted">No clear strengths yet — keep optimizing.</p>
            ) : (
              <div className="space-y-2">
                {insights.strengths.map((s, i) => (
                  <div key={i} className="flex items-center justify-between rounded-lg border border-success/20 bg-success/5 px-3 py-2">
                    <span className="text-sm text-ink-secondary">{s.label}</span>
                    <span className="text-sm font-semibold text-success">{s.value}</span>
                  </div>
                ))}
              </div>
            )}
          </Card>
          <Card>
            <CardHeader title="Areas to Improve" icon={AlertOctagon} />
            {insights.improvements.length === 0 ? (
              <p className="text-sm text-ink-muted">Nothing critical flagged. Nice work.</p>
            ) : (
              <div className="space-y-2">
                {insights.improvements.map((s, i) => (
                  <div key={i} className="flex items-center justify-between rounded-lg border border-warning/20 bg-warning/5 px-3 py-2">
                    <span className="text-sm text-ink-secondary">{s.label}</span>
                    <span className={`text-sm font-semibold ${s.tone === 'bad' ? 'text-danger' : 'text-warning'}`}>{s.value}</span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* key metrics */}
      <Card>
        <CardHeader title="Calculated Metrics" subtitle="The numbers behind the recommendations" icon={Target} />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Metric label="Monthly revenue" value={INR(insights.metrics.revenue)} />
          <Metric label="Net profit" value={INR(insights.metrics.netProfit)} tone={insights.metrics.netProfit >= 0 ? 'success' : 'danger'} />
          <Metric label="Profit margin" value={pct(insights.metrics.margin)} tone={insights.metrics.margin >= 0 ? 'success' : 'danger'} />
          <Metric label="Contribution margin" value={pct(insights.metrics.contributionMargin)} />
          <Metric label="Break-even units" value={isFinite(insights.metrics.breakEvenUnits) ? num(Math.round(insights.metrics.breakEvenUnits)) : '∞'} />
          <Metric label="Cash runway" value={insights.metrics.cashRunway != null ? `${insights.metrics.cashRunway} months` : 'Profitable'} tone={insights.metrics.cashRunway != null && insights.metrics.cashRunway < 3 ? 'danger' : 'success'} />
        </div>
      </Card>
    </div>
  );
}

function Metric({ label, value, tone }) {
  return (
    <div className="rounded-xl border border-line bg-bg-input/30 p-3">
      <p className="stat-label">{label}</p>
      <p className={`mt-1 font-display text-lg font-bold ${tone === 'success' ? 'text-success' : tone === 'danger' ? 'text-danger' : 'text-ink-primary'}`}>{value}</p>
    </div>
  );
}

function scoreLabel(state, key) {
  const { history, finance, cash } = state;
  const rev = (finance.sellingPrice || 0) * (finance.monthlySalesVolume || 0);
  const np = rev - (finance.costPerUnit || 0) * (finance.monthlySalesVolume || 0) - (finance.fixedExpenses || 0) - (finance.marketing || 0);
  const margin = rev > 0 ? (np / rev) * 100 : 0;
  if (key === 'finance') return cash > 0 && np > 0 ? 'Strong' : np > 0 ? 'Stable' : cash > 0 ? 'Strained' : 'At risk';
  if (key === 'sales') {
    if (history.length < 2) return 'Baseline';
    const g = (history[history.length - 1].unitsSold - history[history.length - 2].unitsSold) / Math.max(1, history[history.length - 2].unitsSold) * 100;
    return g > 5 ? 'Growing' : g < -5 ? 'Declining' : 'Flat';
  }
  if (key === 'profit') return margin >= 15 ? 'Healthy' : margin >= 0 ? 'Thin' : 'Loss-making';
  if (key === 'marketing') {
    const r = rev > 0 ? (finance.marketing / rev) * 100 : 100;
    return r < 15 ? 'Efficient' : r < 30 ? 'Adequate' : 'Overspending';
  }
  return '—';
}

function toneForScore(state, key) {
  const label = scoreLabel(state, key);
  if (['Strong', 'Growing', 'Healthy', 'Efficient'].includes(label)) return 'success';
  if (['Stable', 'Flat', 'Thin', 'Adequate', 'Baseline'].includes(label)) return 'primary';
  if (['Strained', 'Declining', 'Overspending'].includes(label)) return 'warning';
  return 'danger';
}
