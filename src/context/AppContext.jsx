import { createContext, useContext, useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { loadState, saveState, clearState } from '@/utils/storage';
import { emptyState, buildSampleBusiness } from '@/utils/sampleData';
import { INDUSTRIES } from '@/utils/types';
import { runSimulation, healthScore, rollEvent } from '@/utils/simulation';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [state, setState] = useState(() => loadState() || buildSampleBusiness());
  const [route, setRoute] = useState(() => (loadState()?.business ? 'dashboard' : 'landing'));
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  // Persist on every change.
  useEffect(() => {
    saveState(state);
  }, [state]);

  const notify = useCallback((message, tone = 'info') => {
    setToast({ message, tone, id: Date.now() });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3600);
  }, []);

  const navigate = useCallback((r) => {
    setRoute(r);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const createBusiness = useCallback((data) => {
    const industry = INDUSTRIES.find((i) => i.id === data.industry) || INDUSTRIES[0];
    const finance = {
      sellingPrice: Math.round(industry.costProfile * 1000 * 1.6),
      costPerUnit: Math.round(industry.costProfile * 1000),
      fixedExpenses: 60000,
      marketing: 25000,
      monthlySalesVolume: Math.round(industry.baseDemand * 0.6),
    };
    setState({
      business: { ...data, createdAt: Date.now() },
      finance,
      marketing: { social: 10000, influencer: 5000, search: 8000, traditional: 2000 },
      history: [],
      cash: data.startingCapital,
      month: 1,
      healthScore: 50,
      seeded: false,
    });
    setRoute('dashboard');
  }, []);

  const updateBusiness = useCallback((patch) => {
    setState((s) => ({ ...s, business: { ...s.business, ...patch } }));
  }, []);

  const updateFinance = useCallback((patch) => {
    setState((s) => ({ ...s, finance: { ...s.finance, ...patch } }));
  }, []);

  const updateMarketing = useCallback((patch) => {
    setState((s) => ({ ...s, marketing: { ...s.marketing, ...patch } }));
  }, []);

  const runMonth = useCallback((simInputs) => {
    setState((s) => {
      const industry = INDUSTRIES.find((i) => i.id === s.business?.industry) || INDUSTRIES[0];
      const event = rollEvent(s.month);
      const result = runSimulation(simInputs, industry, s.cash, event);
      const entry = {
        month: s.month,
        revenue: Math.round(result.revenue),
        expenses: Math.round(result.variableCost + result.fixedExpenses + result.marketing),
        variableCost: Math.round(result.variableCost),
        fixedExpenses: Math.round(result.fixedExpenses),
        marketing: result.marketing,
        netProfit: Math.round(result.netProfit),
        grossProfit: Math.round(result.grossProfit),
        unitsSold: result.unitsSold,
        demand: result.demand,
        lostSales: result.lostSales,
        cashAfter: Math.round(result.cashAfter),
        profitMargin: Number(result.profitMargin.toFixed(2)),
        event: result.event,
      };
      const history = [...s.history, entry];
      const score = healthScore(history, entry, entry.cashAfter);
      return {
        ...s,
        history,
        cash: entry.cashAfter,
        month: s.month + 1,
        healthScore: score,
        finance: {
          ...s.finance,
          sellingPrice: simInputs.sellingPrice,
          costPerUnit: simInputs.costPerUnit,
          fixedExpenses: simInputs.fixedExpenses,
          marketing: simInputs.marketing,
          monthlySalesVolume: entry.unitsSold,
        },
      };
    });
  }, []);

  const resetSimulation = useCallback(() => {
    clearState();
    setState(emptyState());
    setRoute('landing');
  }, []);

  const restoreSample = useCallback(() => {
    const sample = buildSampleBusiness();
    setState(sample);
    setRoute('dashboard');
  }, []);

  const value = useMemo(
    () => ({
      state,
      route,
      navigate,
      notify,
      createBusiness,
      updateBusiness,
      updateFinance,
      updateMarketing,
      runMonth,
      resetSimulation,
      restoreSample,
      hasBusiness: Boolean(state.business),
    }),
    [state, route, navigate, notify, createBusiness, updateBusiness, updateFinance, updateMarketing, runMonth, resetSimulation, restoreSample]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
