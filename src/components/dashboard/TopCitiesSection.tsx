// ============================================================
// FILE: src/components/dashboard/TopCitiesSection.tsx
// PURPOSE: Side-by-side horizontal bar charts for top/bottom cities
// DEPENDS ON: src/lib/types.ts, src/components/charts/HorizontalBarChart.tsx
// ============================================================

'use client';

import Link from 'next/link';
import type { CityAQIData } from '@/lib/types';
import { getCategoryColor } from '@/lib/category-utils';
import Card from '@/components/ui/Card';
import { TOP_CITIES_COUNT } from '@/lib/constants';

interface TopCitiesSectionProps {
  cities: CityAQIData[];
}

/**
 * Displays a vertical list of cities for the Bento Box left column
 */
export default function TopCitiesSection({ cities }: TopCitiesSectionProps) {
  const sorted = [...cities].sort((a, b) => a.aqiValue - b.aqiValue).slice(0, 10);

  return (
    <Card padding="sm" className="flex-grow flex flex-col h-full">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-100">Other Cities</h3>
        <Link href="/compare" className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300">View all</Link>
      </div>
      <div className="flex flex-col gap-2 overflow-y-auto pr-1" style={{ maxHeight: '380px' }}>
        {sorted.map((city) => {
          const color = getCategoryColor(city.aqiCategory);
          return (
            <Link 
              key={city.cityId} 
              href={`/city/${city.cityId}`}
              className="flex items-center justify-between rounded-xl bg-slate-50/80 dark:bg-white/5 p-3 transition-all hover:bg-white dark:hover:bg-white/10 hover:shadow-sm border border-transparent hover:border-slate-100 dark:hover:border-white/10"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white shadow-sm" style={{ color }}>
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                </div>
                <div className="flex flex-col justify-center">
                  <h4 className="text-sm font-bold text-slate-800 dark:text-zinc-100 leading-tight">{city.cityName}</h4>
                  <p className="text-[10px] font-bold tracking-wider text-slate-400 dark:text-zinc-500 uppercase mt-0.5">{city.state}</p>
                </div>
              </div>
              <div className="text-right flex flex-col justify-center items-end">
                <p className="text-base font-bold leading-none tracking-tight" style={{ color }}>
                  {city.aqiValue}
                </p>
                <p className="text-[10px] font-bold leading-none mt-1 uppercase tracking-widest text-slate-400">
                  {city.aqiCategory}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </Card>
  );
}