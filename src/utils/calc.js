// Pure, deterministic business calculations shared across Finance, Simulator, Insights.

export function revenue(sellingPrice, unitsSold) {
  return (Number(sellingPrice) || 0) * (Number(unitsSold) || 0);
}

export function variableCost(costPerUnit, unitsSold) {
  return (Number(costPerUnit) || 0) * (Number(unitsSold) || 0);
}

export function grossProfit(sellingPrice, costPerUnit, unitsSold) {
  return revenue(sellingPrice, unitsSold) - variableCost(costPerUnit, unitsSold);
}

export function netProfit(sellingPrice, costPerUnit, unitsSold, fixedExpenses, marketing) {
  return (
    revenue(sellingPrice, unitsSold) -
    variableCost(costPerUnit, unitsSold) -
    (Number(fixedExpenses) || 0) -
    (Number(marketing) || 0)
  );
}

export function profitMargin(sellingPrice, costPerUnit, unitsSold, fixedExpenses, marketing) {
  const rev = revenue(sellingPrice, unitsSold);
  if (rev <= 0) return 0;
  return (netProfit(sellingPrice, costPerUnit, unitsSold, fixedExpenses, marketing) / rev) * 100;
}

export function breakEvenUnits(fixedExpenses, sellingPrice, costPerUnit) {
  const contribution = (Number(sellingPrice) || 0) - (Number(costPerUnit) || 0);
  if (contribution <= 0) return Infinity;
  return (Number(fixedExpenses) || 0) / contribution;
}

export function breakEvenRevenue(fixedExpenses, sellingPrice, costPerUnit) {
  const units = breakEvenUnits(fixedExpenses, sellingPrice, costPerUnit);
  if (!isFinite(units)) return Infinity;
  return units * (Number(sellingPrice) || 0);
}

export function contributionMargin(sellingPrice, costPerUnit) {
  const sp = Number(sellingPrice) || 0;
  if (sp <= 0) return 0;
  return ((sp - (Number(costPerUnit) || 0)) / sp) * 100;
}

export function marketingROI(marketingSpend, profitAttributable) {
  if ((Number(marketingSpend) || 0) <= 0) return 0;
  return ((Number(profitAttributable) || 0) / Number(marketingSpend)) * 100;
}

export function sum(arr, key) {
  return arr.reduce((acc, item) => acc + (key ? item[key] || 0 : item || 0), 0);
}

export function avg(arr, key) {
  if (!arr.length) return 0;
  return sum(arr, key) / arr.length;
}
