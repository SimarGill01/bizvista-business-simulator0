import { ResponsiveContainer } from 'recharts';
import Card, { CardHeader } from '@/components/Card';

export default function ChartCard({ title, subtitle, icon: Icon, action, height = 280, children }) {
  return (
    <Card>
      <CardHeader title={title} subtitle={subtitle} icon={Icon} action={action} />
      <div style={{ width: '100%', height }}>
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

export const axisStyle = {
  stroke: '#27384F',
  tick: { fill: '#94A3B8', fontSize: 12 },
};

export const tooltipStyle = {
  contentStyle: {
    backgroundColor: '#101827',
    border: '1px solid #27384F',
    borderRadius: 12,
    boxShadow: '0 8px 28px rgba(0,0,0,0.4)',
    fontSize: 13,
  },
  labelStyle: { color: '#F5F7FA', fontWeight: 600 },
  itemStyle: { color: '#94A3B8' },
};
