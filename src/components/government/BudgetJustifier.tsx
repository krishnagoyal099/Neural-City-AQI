// ============================================================
// FILE: src/components/government/BudgetJustifier.tsx
// PURPOSE: Calculate projected rank improvements and health costs
// DEPENDS ON: src/lib/types.ts, src/lib/aqi-calculator.ts, src/lib/data-transformer.ts
// ============================================================

'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import type { CityAQIData } from '@/lib/types';
import { projectedRank, estimateHealthCost } from '@/lib/aqi-calculator';
import { getCityRank } from '@/lib/data-transformer';
import Card from '@/components/ui/Card';

interface BudgetJustifierProps {
  cities: CityAQIData[];
  selectedCityId: string;
}

/** Population estimates in millions for health cost calculation */
const POPULATION_MAP: Record<string, number> = {
  delhi: 32, mumbai: 21, bangalore: 14, chennai: 12, hyderabad: 10,
  kolkata: 15, pune: 7, ahmedabad: 8, jaipur: 4, lucknow: 4,
  kanpur: 3, varanasi: 1.5, patna: 2.5, bhopal: 2, chandigarh: 1.2,
  kochi: 0.8, coimbatore: 1.5, indore: 2, nagpur: 2.5, surat: 7,
  agra: 2, gurgaon: 1.5, noida: 1, thiruvananthapuram: 1, visakhapatnam: 2,
};

/**
 * Interactive tool for municipal officers to see how improving AQI
 * by a certain percentage would affect their city's national rank
 * and reduce estimated health costs.
 */
export default function BudgetJustifier({ cities, selectedCityId }: BudgetJustifierProps) {
  const [improvementPercent, setImprovementPercent] = useState<number>(20);

  const city = useMemo(
    () => cities.find((c) => c.cityId === selectedCityId),
    [cities, selectedCityId]
  );

  const currentRank = useMemo(
    () => (city ? getCityRank(city.cityId, cities) : 0),
    [city, cities]
  );

  const projected = useMemo(() => {
    if (!city) return 0;
    const allAQIs = cities.map((c) => ({ cityId: c.cityId, aqiValue: c.aqiValue }));
    return projectedRank(city.aqiValue, improvementPercent, allAQIs);
  }, [city, cities, improvementPercent]);

  const healthCost = useMemo(() => {
    if (!city) return '₹0 Cr/year';
    const pop = POPULATION_MAP[city.cityId] ?? 2;
    return estimateHealthCost(city.aqiValue, pop);
  }, [city]);

  const projectedHealthCost = useMemo(() => {
    if (!city) return '₹0 Cr/year';
    const pop = POPULATION_MAP[city.cityId] ?? 2;
    const improvedAQI = Math.round(city.aqiValue * (1 - improvementPercent / 100));
    return estimateHealthCost(improvedAQI, pop);
  }, [city, improvementPercent]);

  if (!city) {
    return (
      <Card padding="lg">
        <p className="text-slate-500 dark:text-zinc-400">Select a city to see budget justification analysis.</p>
      </Card>
    );
  }

  return (
    <Card padding="lg">
      <h3 className="mb-4 text-xl font-semibold text-slate-800 dark:text-zinc-100">Budget Justification Mode</h3>
      <p className="mb-6 text-sm text-slate-500 dark:text-zinc-400">
        See how targeted AQI reductions can improve your city's rank and reduce health costs.
      </p>

      <div className="mb-6">
        <label htmlFor="improvement-slider" className="mb-2 block text-sm font-semibold text-slate-700 dark:text-zinc-300">
          Target AQI Improvement: <span className="text-emerald-600">{improvementPercent}%</span>
        </label>
        <input
          id="improvement-slider"
          type="range"
          min={5}
          max={50}
          step={5}
          value={improvementPercent}
          onChange={(e) => setImprovementPercent(Number(e.target.value))}
          className="w-full accent-emerald-500"
          aria-label="AQI improvement percentage slider"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <motion.div
          key={`rank-${projected}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-black p-4 text-center shadow-sm"
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-500">Current Rank</p>
          <p className="mt-1 text-2xl font-bold text-slate-800 dark:text-zinc-100">#{currentRank}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-950/20 p-4 text-center shadow-sm"
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">Projected Rank</p>
          <p className="mt-1 text-2xl font-bold text-emerald-700">#{projected}</p>
          <p className="mt-1 text-xs font-medium text-emerald-500">+{currentRank - projected} positions</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-black p-4 text-center shadow-sm"
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-500">Health Cost Saved</p>
          <p className="mt-1 text-lg font-bold text-emerald-600">{healthCost} → {projectedHealthCost}</p>
        </motion.div>
      </div>
    </Card>
  );
}