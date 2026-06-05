// ============================================================
// FILE: src/components/compare/CitySelector.tsx
// PURPOSE: Dual dropdown selectors for choosing cities to compare
// DEPENDS ON: src/lib/types.ts
// ============================================================

'use client';

import type { CityAQIData } from '@/lib/types';

interface CitySelectorProps {
  cities: CityAQIData[];
  cityAId: string;
  cityBId: string;
  onCityAChangeAction: (id: string) => void;
  onCityBChangeAction: (id: string) => void;
}

/**
 * Two styled select dropdowns for choosing City A and City B.
 * Disables already-selected cities in the opposite dropdown to prevent
 * comparing a city against itself.
 */
export default function CitySelector({
  cities,
  cityAId,
  cityBId,
  onCityAChangeAction,
  onCityBChangeAction,
}: CitySelectorProps) {
  const sortedCities = [...cities].sort((a, b) => a.cityName.localeCompare(b.cityName));

  return (
    <section className="flex flex-col items-center gap-4 md:flex-row md:justify-center">
      <div className="w-full max-w-xs">
        <label htmlFor="city-a-select" className="mb-1 block text-sm font-semibold text-slate-700 dark:text-zinc-300">
          City A
        </label>
        <select
          id="city-a-select"
          value={cityAId}
          onChange={(e) => onCityAChangeAction(e.target.value)}
          aria-label="Select first city for comparison"
          className="w-full rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-black px-4 py-3 text-sm font-medium text-slate-800 dark:text-zinc-200 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
        >
          <option value="">Select City A</option>
          {sortedCities.map((c) => (
            <option key={c.cityId} value={c.cityId} disabled={c.cityId === cityBId}>
              {c.cityName}
            </option>
          ))}
        </select>
      </div>

      <span className="mt-6 text-lg font-black text-slate-400 dark:text-zinc-600 md:mt-0">VS</span>

      <div className="w-full max-w-xs">
        <label htmlFor="city-b-select" className="mb-1 block text-sm font-semibold text-slate-700 dark:text-zinc-300">
          City B
        </label>
        <select
          id="city-b-select"
          value={cityBId}
          onChange={(e) => onCityBChangeAction(e.target.value)}
          aria-label="Select second city for comparison"
          className="w-full rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-black px-4 py-3 text-sm font-medium text-slate-800 dark:text-zinc-200 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
        >
          <option value="">Select City B</option>
          {sortedCities.map((c) => (
            <option key={c.cityId} value={c.cityId} disabled={c.cityId === cityAId}>
              {c.cityName}
            </option>
          ))}
        </select>
      </div>
    </section>
  );
}