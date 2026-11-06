import {
  FileBarChart,
  Download,
  TrendingUp,
  TrendingDown,
  Banknote,
  Activity,
  Sparkles,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import Card, { CardHeader } from '@/components/Card';
import ChartCard from '@/components/charts/ChartCard';
import { RevenueExpenseChart, ProfitTrendChart, SalesChart } from '@/components/charts/Charts';
import EmptyState from '@/components/EmptyState';
import { monthLabel, INR, INRk, num, pct } from '@/utils/format';

export default function Reports() {
  const { state, navigate, notify } = useApp();
  const { history } = state;

  const totalRevenue = history.reduce((a, h) => a + h.revenue, 0);
  const totalExpenses = history.reduce((a, h) => a + h.expenses, 0);
  const netProfit = totalRevenue - totalExpenses;
  const totalUnits = history.reduce((a, h) => a + h.unitsSold, 0);
  const margin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;
  const growth = history.length >= 2
    ? ((history[history.length - 1].revenue - history[0].revenue) / Math.max(1, history[0].revenue)) * 100
    : 0;

  const downloadCSV = () => {
    if (history.length === 0) {
      notify('No data to export yet', 'warning');
      return;
    }
    const header = ['Month', 'Revenue', 'Expenses', 'VariableCost', 'FixedExpenses', 'Marketing', 'GrossProfit', 'NetProfit', 'ProfitMargin(%)', 'UnitsSold', 'Demand', 'LostSales', 'CashAfter', 'Event'];
    const rows = history.map((h) => [
      monthLabel(h.month),
      h.revenue,
      h.expenses,
      h.variableCost ?? '',
      h.fixedExpenses ?? '',
      h.marketing ?? '',
      h.grossProfit ?? '',
      h.netProfit,
      h.profitMargin,
      h.unitsSold,
      h.demand,
      h.lostSales ?? '',
      h.cashAfter,
      h.event?.label || '',
    ]);
    const csv = [header, ...rows].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bizvista-report-${state.business?.companyName?.replace(/\s+/g, '-').toLowerCase() || 'business'}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    notify('CSV report downloaded', 'success');
  };

  if (history.length === 0) {
    return (
      <div className="space-y-6">
        <Header onDownload={downloadCSV} />
        <Card>
          <EmptyState
            title="No reports yet"
            message="Run a few month simulations and your full financial reports will appear here, ready to download as CSV."
            icon={FileBarChart}
            action={<button onClick={() => navigate('simulator')} className="btn btn-primary">Run Simulation</button>}
          />
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Header onDownload={downloadCSV} />

      {/* summary cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard label="Total Revenue" value={INRk(totalRevenue)} icon={TrendingUp} tone="primary" />
        <SummaryCard label="Total Expenses" value={INRk(totalExpenses)} icon={TrendingDown} tone="secondary" />
        <SummaryCard label="Net Profit" value={INRk(netProfit)} icon={Banknote} tone={netProfit >= 0 ? 'success' : 'danger'} />
        <SummaryCard label="Overall Growth" value={pct(growth)} icon={Sparkles} tone={growth >= 0 ? 'success' : 'danger'} />
      </div>

      {/* charts */}
      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Monthly Revenue History" subtitle="Revenue across all simulated months" icon={TrendingUp} height={260}>
          <RevenueExpenseChart data={history} />
        </ChartCard>
        <ChartCard title="Monthly Expense History" subtitle="Total expenses per month" icon={TrendingDown} height={260}>
          <ExpenseChart data={history} />
        </ChartCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Profit & Loss" subtitle="Net profit trend" icon={Banknote} height={260}>
          <ProfitTrendChart data={history} />
        </ChartCard>
        <ChartCard title="Sales Performance" subtitle="Units sold vs demand" icon={Activity} height={260}>
          <SalesChart data={history} />
        </ChartCard>
      </div>

      {/* P&L table */}
      <Card>
        <CardHeader title="Profit & Loss Report" subtitle="Detailed monthly breakdown" icon={FileBarChart} />
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-ink-muted">
                <th className="px-3 py-2.5 font-medium">Month</th>
                <th className="px-3 py-2.5 text-right font-medium">Revenue</th>
                <th className="px-3 py-2.5 text-right font-medium">Expenses</th>
                <th className="px-3 py-2.5 text-right font-medium">Net Profit</th>
                <th className="px-3 py-2.5 text-right font-medium">Margin</th>
                <th className="px-3 py-2.5 text-right font-medium">Units</th>
                <th className="px-3 py-2.5 font-medium">Event</th>
              </tr>
            </thead>
            <tbody>
              {history.map((h) => (
                <tr key={h.month} className="border-b border-line/60 transition hover:bg-bg-hover">
                  <td className="px-3 py-2.5 font-medium text-ink-primary">{monthLabel(h.month)}</td>
                  <td className="px-3 py-2.5 text-right text-ink-primary">{INR(h.revenue)}</td>
                  <td className="px-3 py-2.5 text-right text-ink-secondary">{INR(h.expenses)}</td>
                  <td className={`px-3 py-2.5 text-right font-semibold ${h.netProfit >= 0 ? 'text-success' : 'text-danger'}`}>{INR(h.netProfit)}</td>
                  <td className="px-3 py-2.5 text-right text-ink-secondary">{pct(h.profitMargin)}</td>
                  <td className="px-3 py-2.5 text-right text-ink-secondary">{num(h.unitsSold)}</td>
                  <td className="px-3 py-2.5 text-ink-secondary">{h.event?.label || '—'}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-line font-semibold">
                <td className="px-3 py-3 text-ink-primary">Total</td>
                <td className="px-3 py-3 text-right text-ink-primary">{INR(totalRevenue)}</td>
                <td className="px-3 py-3 text-right text-ink-primary">{INR(totalExpenses)}</td>
                <td className={`px-3 py-3 text-right ${netProfit >= 0 ? 'text-success' : 'text-danger'}`}>{INR(netProfit)}</td>
                <td className="px-3 py-3 text-right text-ink-primary">{pct(margin)}</td>
                <td className="px-3 py-3 text-right text-ink-primary">{num(totalUnits)}</td>
                <td className="px-3 py-3" />
              </tr>
            </tfoot>
          </table>
        </div>
      </Card>
    </div>
  );
}

function Header({ onDownload }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">Reports</h1>
        <p className="mt-1 text-sm text-ink-secondary">Full financial history and downloadable CSV reports.</p>
      </div>
      <button onClick={onDownload} className="btn btn-secondary self-start">
        <Download size={16} /> Download CSV
      </button>
    </div>
  );
}

function SummaryCard({ label, value, icon: Icon, tone }) {
  const toneCls = {
    primary: 'text-accent-primary bg-accent-primary/10',
    secondary: 'text-accent-secondary bg-accent-secondary/10',
    success: 'text-success bg-success/10',
    danger: 'text-danger bg-danger/10',
  }[tone];
  return (
    <Card className="p-4">
      <span className={`grid h-8 w-8 place-items-center rounded-lg ${toneCls}`}>
        <Icon size={15} />
      </span>
      <p className="mt-3 stat-label">{label}</p>
      <p className={`mt-1 font-display text-xl font-bold ${tone === 'danger' ? 'text-danger' : 'text-ink-primary'}`}>{value}</p>
    </Card>
  );
}

function ExpenseChart({ data }) {
  // reuse area chart style via composition
  const d = data.map((h) => ({ name: monthLabel(h.month), Expenses: Math.round(h.expenses) }));
  return (
    <RevenueExpenseChart data={d.map((x, i) => ({ ...x, Revenue: 0, month: i + 1 }))} />
  );
}
