// Deterministic monthly business simulation engine.
//
// DEMAND MODEL (transparent, no randomness beyond labelled random events):
//   baseDemand  = industry base demand (units/month)
//   priceFactor = clamp(0.4 .. 1.6) mapping price 0..2x reference price to 1.4..0.3
//                 (cheaper price => higher demand, more expensive => lower)
//   qualityFactor = 0.7 + 0.006 * qualityInvestment (capped 1.6)
//   marketingFactor = 1 + sqrt(marketing / 4000) capped at 1.6
//   eventFactor = multiplier from active business event
//   demand = baseDemand * priceFactor * qualityFactor * marketingFactor * eventFactor
//   unitsSold = min(demand, productionCapacity)
// All calculations then use the shared calc functions.

import { INDUSTRIES, BUSINESS_EVENT_TYPES } from './types';
import {
  revenue,
  variableCost,
  netProfit,
  profitMargin,
} from './calc';

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

function priceFactor(sellingPrice, costPerUnit) {
  const cost = Number(costPerUnit) || 1;
  const ref = cost * 2.2; // reference "fair" price ≈ 2.2x cost
  const ratio = (Number(sellingPrice) || 0) / ref;
  // ratio 0 -> 1.4 (very cheap, high demand), ratio 1 -> 1, ratio 2 -> 0.3
  const f = 1.4 - 0.55 * clamp(ratio, 0, 2);
  return clamp(f, 0.3, 1.6);
}

function qualityFactor(qualityInvestment) {
  const q = Number(qualityInvestment) || 0;
  return clamp(0.7 + 0.000006 * q, 0.7, 1.6);
}

function marketingFactor(marketing) {
  const m = Number(marketing) || 0;
  if (m <= 0) return 0.85; // no marketing erodes demand slightly
  return clamp(1 + Math.sqrt(m / 4000), 1, 1.6);
}

export function estimateDemand(input, industry, activeEvent) {
  const base = industry?.baseDemand ?? 900;
  let demand = base * priceFactor(input.sellingPrice, input.costPerUnit) * qualityFactor(input.qualityInvestment) * marketingFactor(input.marketing);

  if (activeEvent) {
    const ev = activeEvent;
    if (ev.id === 'competitor_price_cut') demand *= 0.82;
    else if (ev.id === 'demand_surge') demand *= 1.28;
    else if (ev.id === 'marketing_success') demand *= 1.18;
    else if (ev.id === 'supply_disruption') demand *= 0.9;
    else if (ev.id === 'economic_boom') demand *= 1.12;
  }
  return Math.max(0, Math.round(demand));
}

export function runSimulation(input, industry, prevCash, activeEvent) {
  const sp = Number(input.sellingPrice) || 0;
  const cost = Number(input.costPerUnit) || 0;
  const fixed = Number(input.fixedExpenses) || 0;
  const marketing = Number(input.marketing) || 0;
  const capacity = Number(input.productionCapacity) || 0;

  const demand = estimateDemand(input, industry, activeEvent);
  const unitsSold = Math.min(demand, capacity);
  const lostSales = Math.max(0, demand - capacity);

  let rev = revenue(sp, unitsSold);
  let varCost = variableCost(cost, unitsSold);
  let totalFixed = fixed;

  // event cost impacts
  if (activeEvent?.id === 'cost_increase') totalFixed = fixed * 1.18;
  if (activeEvent?.id === 'supply_disruption') varCost = varCost * 1.12;

  const np = rev - varCost - totalFixed - marketing;
  const newCash = prevCash + np;
  const margin = rev > 0 ? (np / rev) * 100 : 0;
  const gp = rev - varCost;

  return {
    demand,
    unitsSold,
    lostSales,
    revenue: rev,
    variableCost: varCost,
    fixedExpenses: totalFixed,
    marketing,
    grossProfit: gp,
    netProfit: np,
    profitMargin: margin,
    cashAfter: newCash,
    event: activeEvent ? { id: activeEvent.id, label: activeEvent.label } : null,
  };
}

export function healthScore(history, latest, cash) {
  // 0-100 composite score from profitability, margin stability and cash runway.
  if (!latest) return 50;
  const margin = latest.profitMargin;
  const cashPart = clamp(cash / 500000, 0, 1) * 30;
  const marginPart = clamp((margin + 10) / 30, 0, 1) * 35; // -10%->0, +20%->full
  const profitPart = latest.netProfit > 0 ? 25 : latest.netProfit === 0 ? 12 : 0;
  const recent = history.slice(-3);
  const growthPart = recent.length >= 2
    ? clamp((recent[recent.length - 1].netProfit - recent[0].netProfit) / Math.max(1, Math.abs(recent[0].netProfit)) * 100, 0, 1) * 10
    : 0;
  return clamp(Math.round(cashPart + marginPart + profitPart + growthPart), 2, 99);
}

// Deterministic-but-varied event selection using a simple LCG seeded by month.
export function rollEvent(month) {
  // 45% chance of an event most months
  const seed = (month * 1103515245 + 12345) & 0x7fffffff;
  const roll = (seed % 1000) / 10; // 0..99.9
  if (roll < 55) return null;
  const idx = seed % BUSINESS_EVENT_TYPES.length;
  return BUSINESS_EVENT_TYPES[idx];
}

export { INDUSTRIES };
export { revenue, variableCost, netProfit, profitMargin };
