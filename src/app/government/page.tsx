// ============================================================
// FILE: src/app/government/page.tsx
// PURPOSE: Government Insight Panel for municipal officers
// DEPENDS ON: src/hooks/useCityData.ts, src/components/government/*
// ============================================================

'use client';

import { useState, useMemo } from 'react';
import { useCityData } from '@/hooks/useCityData';
import type { InterventionItem } from '@/lib/types';
import { getDominantPollutant } from '@/lib/aqi-calculator';

import Skeleton from '@/components/ui/Skeleton';
import dynamic from 'next/dynamic';

const BudgetJustifier = dynamic(() => import('@/components/government/BudgetJustifier'), {
  loading: () => <Skeleton height="300px" />
});
const InterventionMatrix = dynamic(() => import('@/components/government/InterventionMatrix'), {
  loading: () => <Skeleton height="300px" />
});
const BenchmarkTable = dynamic(() => import('@/components/government/BenchmarkTable'), {
  loading: () => <Skeleton height="300px" />
});
const AlertCalendar = dynamic(() => import('@/components/government/AlertCalendar'), {
  loading: () => <Skeleton height="300px" />
});

/** Generate intervention recommendations based on dominant pollutants */
function generateInterventions(dominant: keyof import('@/lib/types').PollutantData): InterventionItem[] {
  const interventionMap: Record<string, InterventionItem[]> = {
    pm25: [
      { pollutant: 'pm25', reductionTarget: 20, impact: 'High', feasibility: 'Medium', description: 'Enforce construction dust control regulations' },
      { pollutant: 'pm25', reductionTarget: 30, impact: 'High', feasibility: 'Low', description: 'Subsidize clean cooking fuel in informal settlements' },
      { pollutant: 'pm25', reductionTarget: 15, impact: 'Medium', feasibility: 'High', description: 'Increase green cover along major transit corridors' },
    ],
    pm10: [
      { pollutant: 'pm10', reductionTarget: 25, impact: 'High', feasibility: 'Medium', description: 'Deploy mechanical street sweepers on arterial roads' },
      { pollutant: 'pm10', reductionTarget: 10, impact: 'Medium', feasibility: 'High', description: 'Pave unpaved shoulders and access roads' },
    ],
    no2: [
      { pollutant: 'no2', reductionTarget: 15, impact: 'High', feasibility: 'Medium', description: 'Accelerate BS-VI emission norms enforcement' },
      { pollutant: 'no2', reductionTarget: 10, impact: 'Medium', feasibility: 'High', description: 'Create low-emission zones around schools and hospitals' },
    ],
    default: [
      { pollutant: dominant, reductionTarget: 15, impact: 'Medium', feasibility: 'Medium', description: 'Implement general pollution monitoring and public alerts' },
      { pollutant: dominant, reductionTarget: 10, impact: 'Low', feasibility: 'High', description: 'Launch public awareness campaign on air quality' },
    ],
  };

  return interventionMap[dominant] ?? interventionMap['default'] ?? [];
}

/**
 * Government insight panel page. Designed for municipal officers
 * to justify budgets, plan interventions, and benchmark against peers.
 */
export default function GovernmentPage() {
  const { cities, isLoading } = useCityData();
  const [selectedCityId, setSelectedCityId] = useState<string>('');

  const selectedCity = useMemo(
    () => cities.find((c) => c.cityId === selectedCityId) ?? null,
    [cities, selectedCityId]
  );

  const interventions = useMemo(() => {
    if (!selectedCity) return [];
    const dominant = getDominantPollutant(selectedCity.pollutants);
    return generateInterventions(dominant);
  }, [selectedCity]);

  if (isLoading) {
    return (
      <div className="space-y-8">
        <Skeleton height="60px" />
        <Skeleton height="400px" />
        <Skeleton height="300px" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-zinc-100 md:text-4xl">Municipal Officer View</h1>
        <p className="mt-2 font-medium text-slate-600 dark:text-zinc-400">Data-driven insights for budget allocation and pollution control planning.</p>
      </div>

      {/* City Selector */}
      <div className="mx-auto max-w-md">
        <label htmlFor="gov-city-select" className="mb-1 block text-sm font-semibold text-slate-700 dark:text-zinc-300">
          Select your jurisdiction
        </label>
        <select
          id="gov-city-select"
          value={selectedCityId}
          onChange={(e) => setSelectedCityId(e.target.value)}
          aria-label="Select city for government analysis"
          className="w-full rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-black px-4 py-3 text-sm font-medium text-slate-800 dark:text-zinc-200 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
        >
          <option value="">-- Choose City --</option>
          {[...cities].sort((a, b) => a.cityName.localeCompare(b.cityName)).map((c) => (
            <option key={c.cityId} value={c.cityId}>{c.cityName}</option>
          ))}
        </select>
      </div>

      <BudgetJustifier cities={cities} selectedCityId={selectedCityId} />
      
      {selectedCity && interventions.length > 0 && (
        <InterventionMatrix interventions={interventions} />
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <AlertCalendar city={selectedCity} />
        <BenchmarkTable cities={cities} />
      </div>
    </div>
  );
}