import { breakEvenUnits, contributionMargin } from './calc';

// Generates deterministic, evidence-based recommendations from current inputs.
export function generateInsights(state) {
  const out = [];
  const {
    finance = {},
    marketing = {},
    history = [],
    cash = 0,
    industry,
  } = state;

  const sp = Number(finance.sellingPrice) || 0;
  const cost = Number(finance.costPerUnit) || 0;
  const fixed = Number(finance.fixedExpenses) || 0;
  const mkt = Number(finance.marketing) || 0;
  const units = Number(finance.monthlySalesVolume) || 0;
  const rev = sp * units;
  const np = rev - cost * units - fixed - mkt;
  const margin = rev > 0 ? (np / rev) * 100 : 0;
  const be = breakEvenUnits(fixed, sp, cost);
  const cm = contributionMargin(sp, cost);

  const strengths = [];
  const improvements = [];

  // 1. Pricing vs cost
  if (sp > 0 && cost > 0 && sp <= cost) {
    out.push({
      type: 'critical',
      title: 'Pricing below cost',
      body: `Your selling price (₹${sp}) is at or below your unit cost (₹${cost}). No volume will make this profitable — raise the price or reduce unit cost immediately.`,
    });
    improvements.push({ label: 'Unit economics', value: 'Negative', tone: 'bad' });
  } else if (cm < 25) {
    out.push({
      type: 'warning',
      title: 'Thin contribution margin',
      body: `Your contribution margin is ${cm.toFixed(1)}% — only ${cm.toFixed(1)}% of each sale covers fixed costs and profit. Raising price or lowering unit cost will materially help.`,
    });
    improvements.push({ label: 'Contribution margin', value: `${cm.toFixed(1)}%`, tone: 'warn' });
  } else if (cm >= 50) {
    strengths.push({ label: 'Contribution margin', value: `${cm.toFixed(1)}%` });
  }

  // 2. Break-even
  if (isFinite(be) && units > 0) {
    const ratio = units / be;
    if (ratio < 0.85) {
      out.push({
        type: 'warning',
        title: 'Approaching break-even',
        body: `You are selling ${units.toLocaleString('en-IN')} units/month against a break-even of ${Math.round(be).toLocaleString('en-IN')} units (${(ratio * 100).toFixed(0)}% of target). Increase volume or marketing to cross break-even.`,
      });
      improvements.push({ label: 'Break-even coverage', value: `${(ratio * 100).toFixed(0)}%`, tone: 'warn' });
    } else if (ratio >= 1.1) {
      strengths.push({ label: 'Above break-even', value: `${(ratio * 100).toFixed(0)}%` });
      out.push({
        type: 'positive',
        title: 'Past break-even',
        body: `You sell ${units.toLocaleString('en-IN')} units against a break-even of ${Math.round(be).toLocaleString('en-IN')} — every unit above that is pure profit.`,
      });
    }
  } else if (!isFinite(be) && sp <= cost) {
    out.push({
      type: 'critical',
      title: 'Break-even unreachable',
      body: 'Because price does not exceed unit cost, break-even is mathematically impossible. Fix the unit economics first.',
    });
  }

  // 3. Marketing efficiency
  if (mkt > 0 && rev > 0) {
    const mktRatio = (mkt / rev) * 100;
    if (mktRatio > 25) {
      out.push({
        type: 'warning',
        title: 'Marketing spend high vs revenue',
        body: `Marketing is ${mktRatio.toFixed(1)}% of revenue (a healthy ceiling is ~15–20%). Either trim spend or channel it into higher-converting channels.`,
      });
      improvements.push({ label: 'Marketing / revenue', value: `${mktRatio.toFixed(1)}%`, tone: 'warn' });
    } else if (mktRatio < 3 && units > 0) {
      out.push({
        type: 'info',
        title: 'Room to invest in marketing',
        body: `Marketing is only ${mktRatio.toFixed(1)}% of revenue. Increasing it could lift demand without hurting margin.`,
      });
      strengths.push({ label: 'Marketing efficiency', value: `${mktRatio.toFixed(1)}%` });
    } else {
      strengths.push({ label: 'Marketing efficiency', value: `${mktRatio.toFixed(1)}%` });
    }
  }

  // 4. Cash runway
  const burn = np < 0 ? Math.abs(np) : 0;
  if (burn > 0) {
    const months = cash > 0 ? Math.floor(cash / burn) : 0;
    out.push({
      type: months < 3 ? 'critical' : 'warning',
      title: 'Operating at a loss',
      body: `You are losing ₹${Math.round(burn).toLocaleString('en-IN')}/month. At current cash (₹${Math.round(cash).toLocaleString('en-IN')}), you have ~${months} months of runway before funds run out.`,
    });
    improvements.push({ label: 'Cash runway', value: `${months} mo`, tone: months < 3 ? 'bad' : 'warn' });
  } else if (np > 0) {
    strengths.push({ label: 'Profitable', value: `₹${Math.round(np).toLocaleString('en-IN')}/mo` });
  }

  // 5. Fixed cost burden
  if (rev > 0 && fixed / rev > 0.4) {
    out.push({
      type: 'warning',
      title: 'Fixed costs weigh on margin',
      body: `Fixed expenses are ${(fixed / rev * 100).toFixed(0)}% of revenue. Reducing overhead or growing revenue will improve resilience.`,
    });
    improvements.push({ label: 'Fixed cost load', value: `${(fixed / rev * 100).toFixed(0)}%`, tone: 'warn' });
  }

  // 6. Trend
  if (history.length >= 3) {
    const last3 = history.slice(-3);
    const trend = last3[2].netProfit - last3[0].netProfit;
    if (trend > 0) {
      out.push({
        type: 'positive',
        title: 'Profit trend improving',
        body: `Net profit is up ₹${Math.round(trend).toLocaleString('en-IN')} over the last 3 simulated months. Keep the current strategy.`,
      });
      strengths.push({ label: '3-month trend', value: 'Improving' });
    } else if (trend < 0) {
      out.push({
        type: 'warning',
        title: 'Profit trend declining',
        body: `Net profit is down ₹${Math.round(Math.abs(trend)).toLocaleString('en-IN')} over the last 3 simulated months. Review pricing, costs and marketing.`,
      });
      improvements.push({ label: '3-month trend', value: 'Declining', tone: 'warn' });
    }
  }

  // Always ensure at least one insight
  if (out.length === 0) {
    out.push({
      type: 'info',
      title: 'Run a simulation to begin',
      body: 'Once you simulate a few months, insights will appear here based on your real numbers.',
    });
  }

  return {
    recommendations: out,
    strengths,
    improvements,
    metrics: {
      revenue: rev,
      netProfit: np,
      margin,
      breakEvenUnits: be,
      contributionMargin: cm,
      cashRunway: burn > 0 ? Math.floor((cash > 0 ? cash : 0) / burn) : null,
    },
  };
}
