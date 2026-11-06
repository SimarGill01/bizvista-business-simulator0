import { INDUSTRIES, MARKETING_CHANNELS } from './types';
import { runSimulation, healthScore, rollEvent } from './simulation';

// Builds a polished sample business with realistic, fully-derived demo data.
export function buildSampleBusiness() {
  const industry = INDUSTRIES.find((i) => i.id === 'technology');
  const finance = {
    sellingPrice: 1499,
    costPerUnit: 540,
    fixedExpenses: 85000,
    marketing: 60000,
    monthlySalesVolume: 1180,
  };

  const business = {
    companyName: 'NovaTech Solutions',
    founderName: 'Aarav Mehta',
    industry: industry.id,
    startingCapital: 1000000,
    description:
      'NovaTech Solutions builds affordable productivity software for small Indian businesses — invoicing, inventory and lightweight analytics in one clean suite.',
    createdAt: Date.now(),
  };

  // Simulate 8 months of history deterministically to derive realistic numbers.
  let cash = business.startingCapital;
  const history = [];
  const inputs = {
    sellingPrice: finance.sellingPrice,
    costPerUnit: finance.costPerUnit,
    fixedExpenses: finance.fixedExpenses,
    marketing: finance.marketing,
    productionCapacity: 1500,
    qualityInvestment: 40000,
  };

  // gradually raise capacity + sales to show growth
  for (let m = 1; m <= 8; m++) {
    const ev = rollEvent(m);
    const monthInputs = {
      ...inputs,
      productionCapacity: 1200 + m * 60,
      marketing: inputs.marketing + (m > 4 ? 15000 : 0),
      qualityInvestment: inputs.qualityInvestment + m * 3000,
    };
    const result = runSimulation(monthInputs, industry, cash, ev);
    cash = result.cashAfter;
    history.push({
      month: m,
      revenue: Math.round(result.revenue),
      expenses: Math.round(result.variableCost + result.fixedExpenses + result.marketing),
      netProfit: Math.round(result.netProfit),
      unitsSold: result.unitsSold,
      demand: result.demand,
      grossProfit: Math.round(result.grossProfit),
      marketing: result.marketing,
      cashAfter: Math.round(cash),
      profitMargin: Number(result.profitMargin.toFixed(2)),
      event: result.event,
    });
  }

  const latest = history[history.length - 1];
  const score = healthScore(history, latest, cash);

  const marketingBudgets = { social: 25000, influencer: 15000, search: 12000, traditional: 8000 };

  return {
    business,
    finance,
    marketing: marketingBudgets,
    history,
    cash: Math.round(cash),
    month: 9, // next simulation month
    healthScore: score,
    seeded: true,
  };
}

export function emptyState() {
  return {
    business: null,
    finance: {
      sellingPrice: 0,
      costPerUnit: 0,
      fixedExpenses: 0,
      marketing: 0,
      monthlySalesVolume: 0,
    },
    marketing: { social: 0, influencer: 0, search: 0, traditional: 0 },
    history: [],
    cash: 0,
    month: 1,
    healthScore: 0,
    seeded: false,
  };
}
