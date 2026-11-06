import { useState } from 'react';
import {
  Wallet,
  IndianRupee,
  Package,
  Building,
  Megaphone,
  ShoppingCart,
  TrendingUp,
  Calculator,
  Target,
  Percent,
  Scale,
  Info,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import Card, { CardHeader } from '@/components/Card';
import NumberInput from '@/components/NumberInput';
import { INR, num, pct } from '@/utils/format';
import {
  revenue,
  variableCost,
  grossProfit,
  netProfit,
  profitMargin,
  breakEvenUnits,
  breakEvenRevenue,
  contributionMargin,
} from '@/utils/calc';

export default function FinanceStudio() {
  const { state, updateFinance, notify } = useApp();
  const [local, setLocal] = useState(state.finance);

  const set = (k, v) => {
    const next = { ...local, [k]: v };
    setLocal(next);
    updateFinance(next);
  };

  const sp = Number(local.sellingPrice) || 0;
  const cost = Number(local.costPerUnit) || 0;
  const fixed = Number(local.fixedExpenses) || 0;
  const mkt = Number(local.marketing) || 0;
  const units = Number(local.monthlySalesVolume) || 0;

  const rev = revenue(sp, units);
  const vc = variableCost(cost, units);
  const gp = grossProfit(sp, cost, units);
  const np = netProfit(sp, cost, units, fixed, mkt);
  const margin = profitMargin(sp, cost, units, fixed, mkt);
  const beUnits = breakEvenUnits(fixed, sp, cost);
  const beRevenue = breakEvenRevenue(fixed, sp, cost);
  const cm = contributionMargin(sp, cost);

  const metrics = [
    { label: 'Revenue', value: INR(rev), icon: TrendingUp, tone: 'primary', formula: 'Selling Price × Units Sold' },
    { label: 'Variable Cost', value: INR(vc), icon: Package, tone: 'secondary', formula: 'Cost Per Unit × Units Sold' },
    { label: 'Gross Profit', value: INR(gp), icon: Calculator, tone: gp >= 0 ? 'success' : 'danger', formula: 'Revenue − Variable Cost' },
    { label: 'Net Profit', value: INR(np), icon: Wallet, tone: np >= 0 ? 'success' : 'danger', formula: 'Revenue − Var Cost − Fixed − Marketing' },
    { label: 'Profit Margin', value: pct(margin), icon: Percent, tone: margin >= 0 ? 'success' : 'danger', formula: '(Net Profit ÷ Revenue) × 100' },
    { label: 'Contribution Margin', value: pct(cm), icon: Scale, tone: 'info', formula: '((Price − Cost) ÷ Price) × 100' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">Finance Studio</h1>
        <p className="mt-1 text-sm text-ink-secondary">
          Adjust your inputs and every metric below recalculates instantly using transparent formulas.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* inputs */}
        <Card className="lg:col-span-2">
          <CardHeader title="Inputs" subtitle="Pricing, costs and volume" icon={Calculator} />
          <div className="space-y-4">
            <NumberInput label="Product selling price" icon={IndianRupee} prefix="₹" value={local.sellingPrice} onChange={(v) => set('sellingPrice', v)} min={0} step={10} />
            <NumberInput label="Cost per unit" icon={Package} prefix="₹" value={local.costPerUnit} onChange={(v) => set('costPerUnit', v)} min={0} step={5} />
            <NumberInput label="Monthly fixed expenses" icon={Building} prefix="₹" value={local.fixedExpenses} onChange={(v) => set('fixedExpenses', v)} min={0} step={1000} />
            <NumberInput label="Marketing expenditure" icon={Megaphone} prefix="₹" value={local.marketing} onChange={(v) => set('marketing', v)} min={0} step={500} />
            <NumberInput label="Monthly sales volume" icon={ShoppingCart} suffix="units" value={local.monthlySalesVolume} onChange={(v) => set('monthlySalesVolume', v)} min={0} step={10} />
          </div>
        </Card>

        {/* results */}
        <div className="space-y-4 lg:col-span-3">
          <div className="grid gap-4 sm:grid-cols-2">
            {metrics.map((m) => {
              const Icon = m.icon;
              const toneCls = {
                primary: 'text-accent-primary',
                secondary: 'text-accent-secondary',
                success: 'text-success',
                danger: 'text-danger',
                info: 'text-info',
              }[m.tone];
              return (
                <Card key={m.label} hover className="p-4">
                  <div className="flex items-center justify-between">
                    <span className="stat-label">{m.label}</span>
                    <Icon size={16} className={toneCls} />
                  </div>
                  <p className={`mt-2 font-display text-2xl font-bold ${toneCls}`}>{m.value}</p>
                  <p className="mt-1.5 font-mono text-[11px] text-ink-muted">{m.formula}</p>
                </Card>
              );
            })}
          </div>

          {/* break-even */}
          <Card>
            <CardHeader title="Break-Even Analysis" subtitle="Where profit starts" icon={Target} />
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-line bg-bg-input/40 p-4">
                <p className="stat-label">Break-even units</p>
                <p className="mt-1 font-display text-xl font-bold text-accent-primary">
                  {isFinite(beUnits) ? num(Math.round(beUnits)) : '∞'}
                </p>
                <p className="mt-1 font-mono text-[11px] text-ink-muted">Fixed ÷ (Price − Cost)</p>
              </div>
              <div className="rounded-xl border border-line bg-bg-input/40 p-4">
                <p className="stat-label">Break-even revenue</p>
                <p className="mt-1 font-display text-xl font-bold text-accent-secondary">
                  {isFinite(beRevenue) ? INR(beRevenue) : '∞'}
                </p>
                <p className="mt-1 font-mono text-[11px] text-ink-muted">BE units × Price</p>
              </div>
              <div className="rounded-xl border border-line bg-bg-input/40 p-4">
                <p className="stat-label">Current vs break-even</p>
                <p className={`mt-1 font-display text-xl font-bold ${units >= beUnits ? 'text-success' : 'text-warning'}`}>
                  {isFinite(beUnits) ? pct((units / beUnits) * 100) : '—'}
                </p>
                <p className="mt-1 font-mono text-[11px] text-ink-muted">Units sold ÷ BE units</p>
              </div>
            </div>
            {sp <= cost && (
              <div className="mt-4 flex items-start gap-2 rounded-lg border border-danger/30 bg-danger/10 p-3 text-xs text-danger">
                <Info size={14} className="mt-0.5 shrink-0" />
                <span>Your selling price is at or below unit cost, so break-even is impossible. Raise the price or lower unit cost.</span>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
