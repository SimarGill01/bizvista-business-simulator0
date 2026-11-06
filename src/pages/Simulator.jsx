import { useState, useMemo } from 'react';
import {
  PlayCircle,
  IndianRupee,
  Package,
  Building,
  Megaphone,
  Factory,
  Gem,
  TrendingUp,
  AlertTriangle,
  Rocket,
  Info,
  Sparkles,
  Swords,
  Truck,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import Card, { CardHeader } from '@/components/Card';
import NumberInput, { Slider } from '@/components/NumberInput';
import { INDUSTRIES } from '@/utils/types';
import { estimateDemand, runSimulation, rollEvent } from '@/utils/simulation';
import { INR, INRk, num, pct, monthLabel } from '@/utils/format';

const EVENT_ICONS = { Swords, TrendingUp, AlertTriangle, Rocket, Truck, Sparkles };

export default function Simulator() {
  const { state, runMonth, notify } = useApp();
  const industry = INDUSTRIES.find((i) => i.id === state.business?.industry) || INDUSTRIES[0];

  const [inputs, setInputs] = useState({
    sellingPrice: state.finance.sellingPrice || 1499,
    costPerUnit: state.finance.costPerUnit || 540,
    fixedExpenses: state.finance.fixedExpenses || 85000,
    marketing: state.finance.marketing || 60000,
    productionCapacity: 1500,
    qualityInvestment: 40000,
  });
  const [previewEvent, setPreviewEvent] = useState(null);
  const [running, setRunning] = useState(false);

  const set = (k, v) => setInputs((p) => ({ ...p, [k]: v }));

  // live preview (before running)
  const preview = useMemo(() => {
    const event = previewEvent || rollEvent(state.month);
    const result = runSimulation(inputs, industry, state.cash, event);
    return { ...result, event };
  }, [inputs, industry, state.cash, state.month, previewEvent]);

  const run = () => {
    setRunning(true);
    setTimeout(() => {
      runMonth(inputs);
      notify(`Month ${monthLabel(state.month)} simulated — ${preview.netProfit >= 0 ? 'profit' : 'loss'} of ${INRk(preview.netProfit)}`, preview.netProfit >= 0 ? 'success' : 'warning');
      setRunning(false);
      setPreviewEvent(null);
    }, 600);
  };

  const results = [
    { label: 'Est. Demand', value: num(preview.demand), icon: TrendingUp, tone: 'info', suffix: 'units' },
    { label: 'Units Sold', value: num(preview.unitsSold), icon: Package, tone: 'primary', suffix: 'units' },
    { label: 'Revenue', value: INRk(preview.revenue), icon: IndianRupee, tone: 'primary' },
    { label: 'Expenses', value: INRk(preview.variableCost + preview.fixedExpenses + preview.marketing), icon: Building, tone: 'secondary' },
    { label: 'Net Profit', value: INRk(preview.netProfit), icon: TrendingUp, tone: preview.netProfit >= 0 ? 'success' : 'danger' },
    { label: 'Cash After', value: INRk(preview.cashAfter), icon: Gem, tone: preview.cashAfter >= 0 ? 'success' : 'danger' },
  ];

  const EventIcon = preview.event ? EVENT_ICONS[preview.event.id] || Sparkles : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">Business Simulator</h1>
          <p className="mt-1 text-sm text-ink-secondary">
            Tune your levers and run the next month. Current month: <span className="font-semibold text-accent-primary">{monthLabel(state.month)}</span>
          </p>
        </div>
        <button onClick={run} disabled={running} className="btn btn-primary px-6 py-3 text-base animate-pulseGlow">
          <PlayCircle size={20} className={running ? 'animate-spin' : ''} />
          {running ? 'Running…' : 'Run Month Simulation'}
        </button>
      </div>

      {/* demand model explainer */}
      <div className="flex items-start gap-2 rounded-xl border border-line bg-bg-card/60 p-3 text-xs text-ink-secondary">
        <Info size={14} className="mt-0.5 shrink-0 text-accent-primary" />
        <div>
          <span className="font-medium text-ink-primary">How demand is estimated: </span>
          demand = industry base × price factor × quality factor × marketing factor × event factor.
          Cheaper price, higher quality investment and more marketing raise demand; capacity caps units sold.
          Events are deterministic, labelled fictional scenarios.
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* inputs */}
        <Card className="lg:col-span-2">
          <CardHeader title="Simulation Levers" subtitle="Adjust then run the month" icon={Factory} />
          <div className="space-y-4">
            <NumberInput label="Selling price" prefix="₹" icon={IndianRupee} value={inputs.sellingPrice} onChange={(v) => set('sellingPrice', v)} min={0} step={10} />
            <NumberInput label="Cost per unit" prefix="₹" icon={Package} value={inputs.costPerUnit} onChange={(v) => set('costPerUnit', v)} min={0} step={5} />
            <NumberInput label="Fixed expenses" prefix="₹" icon={Building} value={inputs.fixedExpenses} onChange={(v) => set('fixedExpenses', v)} min={0} step={1000} />
            <NumberInput label="Marketing budget" prefix="₹" icon={Megaphone} value={inputs.marketing} onChange={(v) => set('marketing', v)} min={0} step={500} />
            <NumberInput label="Production capacity" suffix="units" icon={Factory} value={inputs.productionCapacity} onChange={(v) => set('productionCapacity', v)} min={0} step={50} />
            <Slider
              label="Product quality investment"
              value={inputs.qualityInvestment}
              onChange={(v) => set('qualityInvestment', v)}
              min={0}
              max={200000}
              step={1000}
              tone="secondary"
              format={(v) => INRk(v)}
            />
          </div>
        </Card>

        {/* preview + event */}
        <div className="space-y-6 lg:col-span-3">
          {/* event banner */}
          <Card className={preview.event ? 'border-accent-secondary/40' : ''}>
            <div className="flex items-center gap-3">
              <span className={`grid h-10 w-10 place-items-center rounded-lg ${preview.event ? 'bg-accent-secondary/15 text-accent-secondary' : 'bg-bg-hover text-ink-secondary'}`}>
                {EventIcon ? <EventIcon size={18} /> : <Info size={18} />}
              </span>
              <div className="flex-1">
                <p className="text-xs uppercase tracking-wide text-ink-muted">Business event this month</p>
                <p className="font-display text-base font-semibold text-ink-primary">
                  {preview.event ? preview.event.label : 'No event — stable conditions'}
                </p>
              </div>
              <span className="chip bg-accent-secondary/10 text-accent-secondary">Fictional scenario</span>
            </div>
            {preview.event && (
              <p className="mt-3 text-xs text-ink-secondary">
                {eventDescription(preview.event.id)}
              </p>
            )}
          </Card>

          {/* results preview */}
          <Card>
            <CardHeader title="Projected Results" subtitle={`If you run ${monthLabel(state.month)} now`} icon={TrendingUp} />
            <div className="grid gap-3 sm:grid-cols-3">
              {results.map((r) => {
                const Icon = r.icon;
                const toneCls = {
                  primary: 'text-accent-primary',
                  secondary: 'text-accent-secondary',
                  info: 'text-info',
                  success: 'text-success',
                  danger: 'text-danger',
                }[r.tone];
                return (
                  <div key={r.label} className="rounded-xl border border-line bg-bg-input/40 p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] uppercase tracking-wide text-ink-muted">{r.label}</span>
                      <Icon size={14} className={toneCls} />
                    </div>
                    <p className={`mt-1.5 font-display text-lg font-bold ${toneCls}`}>{r.value}</p>
                    {r.suffix && <p className="text-[10px] text-ink-muted">{r.suffix}</p>}
                  </div>
                );
              })}
            </div>

            {preview.lostSales > 0 && (
              <div className="mt-4 flex items-start gap-2 rounded-lg border border-warning/30 bg-warning/10 p-3 text-xs text-warning">
                <AlertTriangle size={14} className="mt-0.5 shrink-0" />
                <span>Demand exceeds capacity by {num(preview.lostSales)} units — you're leaving revenue on the table. Raise production capacity.</span>
              </div>
            )}
            {preview.cashAfter < 0 && (
              <div className="mt-4 flex items-start gap-2 rounded-lg border border-danger/30 bg-danger/10 p-3 text-xs text-danger">
                <AlertTriangle size={14} className="mt-0.5 shrink-0" />
                <span>Projected cash after this month is negative. Reduce costs or raise price to avoid insolvency.</span>
              </div>
            )}
          </Card>

          <button onClick={run} disabled={running} className="btn btn-primary w-full px-6 py-3.5 text-base">
            <PlayCircle size={20} /> {running ? 'Simulating…' : `Run ${monthLabel(state.month)} Simulation`}
          </button>
        </div>
      </div>
    </div>
  );
}

function eventDescription(id) {
  const map = {
    competitor_price_cut: 'A competitor slashes prices, pulling ~18% of your demand away this month.',
    demand_surge: 'Market demand jumps ~28% — a great month to have capacity available.',
    cost_increase: 'Operating costs rise ~18% this month due to inflationary pressure.',
    marketing_success: 'Your latest campaign lands well, boosting demand ~18%.',
    supply_disruption: 'Supply chain issues raise unit cost ~12% and trim demand ~10%.',
    economic_boom: 'A broader economic lift raises demand ~12% across the board.',
  };
  return map[id] || '';
}
