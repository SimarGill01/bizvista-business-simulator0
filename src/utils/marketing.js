import { MARKETING_CHANNELS } from './types';
import { marketingROI } from './calc';

// All figures are SIMULATED estimates — not real ad-platform results.
export function channelEstimate(channel, budget, sellingPrice, costPerUnit) {
  const b = Number(budget) || 0;
  const reach = Math.round(b * channel.reachPerRupee);
  const potentialCustomers = Math.round(reach * channel.conversionRate);
  const conversions = Math.round(potentialCustomers * 0.4); // landing->purchase
  const attributableRevenue = conversions * (Number(sellingPrice) || 0);
  const attributableProfit = conversions * ((Number(sellingPrice) || 0) - (Number(costPerUnit) || 0));
  const roi = marketingROI(b, attributableProfit);
  const efficiency = b > 0 ? (attributableRevenue / b) : 0; // revenue per ₹ spent
  return {
    channel,
    budget: b,
    reach,
    potentialCustomers,
    conversions,
    attributableRevenue,
    attributableProfit,
    roi,
    efficiency,
  };
}

export function marketingSummary(budgets, sellingPrice, costPerUnit) {
  const byChannel = MARKETING_CHANNELS.map((ch) =>
    channelEstimate(ch, budgets[ch.id] || 0, sellingPrice, costPerUnit)
  );
  const totalBudget = byChannel.reduce((a, c) => a + c.budget, 0);
  const totalReach = byChannel.reduce((a, c) => a + c.reach, 0);
  const totalCustomers = byChannel.reduce((a, c) => a + c.potentialCustomers, 0);
  const totalConversions = byChannel.reduce((a, c) => a + c.conversions, 0);
  const totalRevenue = byChannel.reduce((a, c) => a + c.attributableRevenue, 0);
  const totalProfit = byChannel.reduce((a, c) => a + c.attributableProfit, 0);
  const overallRoi = marketingROI(totalBudget, totalProfit);
  const efficiency = totalBudget > 0 ? totalRevenue / totalBudget : 0;
  return {
    byChannel,
    totalBudget,
    totalReach,
    totalCustomers,
    totalConversions,
    totalRevenue,
    totalProfit,
    overallRoi,
    efficiency,
  };
}
