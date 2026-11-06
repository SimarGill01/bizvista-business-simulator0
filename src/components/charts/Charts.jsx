import {
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from 'recharts';
import { monthLabel, INRk } from '@/utils/format';
import { tooltipStyle, axisStyle } from './ChartCard';

export function RevenueExpenseChart({ data }) {
  const d = data.map((h) => ({
    name: monthLabel(h.month),
    Revenue: Math.round(h.revenue),
    Expenses: Math.round(h.expenses),
  }));
  return (
    <AreaChart data={d} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
      <defs>
        <linearGradient id="gRev" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#B8F34A" stopOpacity={0.35} />
          <stop offset="100%" stopColor="#B8F34A" stopOpacity={0} />
        </linearGradient>
        <linearGradient id="gExp" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7C83FF" stopOpacity={0.3} />
          <stop offset="100%" stopColor="#7C83FF" stopOpacity={0} />
        </linearGradient>
      </defs>
      <CartesianGrid strokeDasharray="3 3" vertical={false} />
      <XAxis dataKey="name" {...axisStyle} tickLine={false} axisLine={false} />
      <YAxis {...axisStyle} tickLine={false} axisLine={false} tickFormatter={(v) => INRk(v)} width={56} />
      <Tooltip {...tooltipStyle} formatter={(v) => INRk(v)} />
      <Legend iconType="plainline" />
      <Area type="monotone" dataKey="Revenue" stroke="#B8F34A" strokeWidth={2.5} fill="url(#gRev)" />
      <Area type="monotone" dataKey="Expenses" stroke="#7C83FF" strokeWidth={2.5} fill="url(#gExp)" />
    </AreaChart>
  );
}

export function ProfitTrendChart({ data }) {
  const d = data.map((h) => ({
    name: monthLabel(h.month),
    Profit: Math.round(h.netProfit),
    margin: Number(h.profitMargin.toFixed(1)),
  }));
  return (
    <LineChart data={d} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
      <CartesianGrid strokeDasharray="3 3" vertical={false} />
      <XAxis dataKey="name" {...axisStyle} tickLine={false} axisLine={false} />
      <YAxis {...axisStyle} tickLine={false} axisLine={false} tickFormatter={(v) => INRk(v)} width={56} />
      <Tooltip {...tooltipStyle} formatter={(v) => INRk(v)} />
      <ReferenceLine y={0} stroke="#64748B" strokeDasharray="4 4" />
      <Line type="monotone" dataKey="Profit" stroke="#B8F34A" strokeWidth={2.5} dot={{ r: 3, fill: '#B8F34A' }} activeDot={{ r: 5 }} />
    </LineChart>
  );
}

export function SalesChart({ data }) {
  const d = data.map((h) => ({
    name: monthLabel(h.month),
    Sold: h.unitsSold,
    Demand: h.demand,
  }));
  return (
    <BarChart data={d} margin={{ top: 10, right: 12, left: 0, bottom: 0 }} barGap={2}>
      <CartesianGrid strokeDasharray="3 3" vertical={false} />
      <XAxis dataKey="name" {...axisStyle} tickLine={false} axisLine={false} />
      <YAxis {...axisStyle} tickLine={false} axisLine={false} width={48} />
      <Tooltip {...tooltipStyle} />
      <Legend iconType="plainline" />
      <Bar dataKey="Sold" fill="#B8F34A" radius={[4, 4, 0, 0]} maxBarSize={26} />
      <Bar dataKey="Demand" fill="#7C83FF" radius={[4, 4, 0, 0]} maxBarSize={26} opacity={0.6} />
    </BarChart>
  );
}

export function MarketingPie({ data }) {
  const colors = data.map((d) => d.channel.color);
  return (
    <PieChart>
      <Pie
        data={data}
        dataKey="budget"
        nameKey={(d) => d.channel.label}
        cx="50%"
        cy="50%"
        innerRadius={58}
        outerRadius={92}
        paddingAngle={3}
        stroke="none"
      >
        {data.map((_, i) => (
          <Cell key={i} fill={colors[i]} />
        ))}
      </Pie>
      <Tooltip {...tooltipStyle} formatter={(v) => INRk(v)} />
      <Legend iconType="circle" />
    </PieChart>
  );
}

export function MarginBarChart({ data }) {
  return (
    <BarChart data={data} layout="vertical" margin={{ top: 4, right: 16, left: 8, bottom: 4 }}>
      <CartesianGrid strokeDasharray="3 3" horizontal={false} />
      <XAxis type="number" {...axisStyle} tickLine={false} axisLine={false} unit="%" />
      <YAxis type="category" dataKey="name" {...axisStyle} tickLine={false} axisLine={false} width={92} />
      <Tooltip {...tooltipStyle} formatter={(v) => `${v.toFixed(1)}%`} />
      <Bar dataKey="value" radius={[0, 6, 6, 0]} maxBarSize={22}>
        {data.map((d, i) => (
          <Cell key={i} fill={d.value >= 0 ? '#B8F34A' : '#F87171'} />
        ))}
      </Bar>
    </BarChart>
  );
}
