// ============================================================
// FILE: src/components/government/BenchmarkTable.tsx
// PURPOSE: Sortable, color-coded data table of all cities
// DEPENDS ON: src/lib/types.ts, src/lib/category-utils.ts
// ============================================================

'use client';

import { useState, useMemo } from 'react';
import type { CityAQIData, AQICategory } from '@/lib/types';
import { getAQIColor } from '@/lib/category-utils';
import Card from '@/components/ui/Card';

type SortKey = 'cityName' | 'aqiValue' | 'airHealthScore' | 'aqiCategory';
type SortDir = 'asc' | 'desc';

interface BenchmarkTableProps {
  cities: CityAQIData[];
}

/** Category sort order mapping */
const CATEGORY_ORDER: Record<AQICategory, number> = {
  Good: 1, Satisfactory: 2, Moderate: 3, Poor: 4, 'Very Poor': 5, Severe: 6,
};

/**
 * Sortable and filterable data table listing all tracked cities.
 * Cells are color-coded by AQI category for quick scanning.
 */
export default function BenchmarkTable({ cities }: BenchmarkTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('aqiValue');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [filterCategory, setFilterCategory] = useState<AQICategory | 'All'>('All');

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const filteredAndSorted = useMemo(() => {
    let data = [...cities];

    if (filterCategory !== 'All') {
      data = data.filter((c) => c.aqiCategory === filterCategory);
    }

    data.sort((a, b) => {
      let comparison = 0;
      if (sortKey === 'aqiCategory') {
        comparison = CATEGORY_ORDER[a.aqiCategory] - CATEGORY_ORDER[b.aqiCategory];
      } else if (sortKey === 'cityName') {
        comparison = a.cityName.localeCompare(b.cityName);
      } else {
        comparison = (a[sortKey] as number) - (b[sortKey] as number);
      }
      return sortDir === 'asc' ? comparison : -comparison;
    });

    return data;
  }, [cities, sortKey, sortDir, filterCategory]);

  const categories: Array<AQICategory | 'All'> = ['All', 'Good', 'Satisfactory', 'Moderate', 'Poor', 'Very Poor', 'Severe'];

  return (
    <Card padding="md">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-slate-800 dark:text-zinc-100">Peer Benchmarking Table</h3>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value as AQICategory | 'All')}
          aria-label="Filter by AQI category"
          className="px-3 py-1.5 text-sm font-medium rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-black text-slate-700 dark:text-zinc-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat === 'All' ? 'All Categories' : cat}</option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 dark:border-white/10">
            <tr className="text-slate-500 dark:text-zinc-500 font-bold uppercase tracking-wider text-xs">
              <th className="cursor-pointer px-4 py-3" onClick={() => handleSort('cityName')}>
                City {sortKey === 'cityName' ? (sortDir === 'asc' ? '↑' : '↓') : ''}
              </th>
              <th className="cursor-pointer px-4 py-3" onClick={() => handleSort('aqiValue')}>
                AQI {sortKey === 'aqiValue' ? (sortDir === 'asc' ? '↑' : '↓') : ''}
              </th>
              <th className="cursor-pointer px-4 py-3" onClick={() => handleSort('airHealthScore')}>
                Health Score {sortKey === 'airHealthScore' ? (sortDir === 'asc' ? '↑' : '↓') : ''}
              </th>
              <th className="cursor-pointer px-4 py-3" onClick={() => handleSort('aqiCategory')}>
                Category {sortKey === 'aqiCategory' ? (sortDir === 'asc' ? '↑' : '↓') : ''}
              </th>
              <th className="px-4 py-3">State</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSorted.map((city) => (
              <tr key={city.cityId} className="border-b border-slate-100 dark:border-white/5 transition-colors hover:bg-slate-50 dark:hover:bg-white/5">
                <td className="px-4 py-3 font-semibold text-slate-800 dark:text-zinc-200">{city.cityName}</td>
                <td className="px-4 py-3">
                  <span className="font-bold text-lg" style={{ color: getAQIColor(city.aqiValue) }}>
                    {city.aqiValue}
                  </span>
                </td>
                <td className="px-4 py-3 font-medium text-slate-600 dark:text-zinc-400">{city.airHealthScore}/100</td>
                <td className="px-4 py-3">
                  <span
                    className="inline-flex rounded-full px-2 py-0.5 text-xs font-semibold"
                    style={{
                      backgroundColor: `${getAQIColor(city.aqiValue)}20`,
                      color: getAQIColor(city.aqiValue),
                    }}
                  >
                    {city.aqiCategory}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-500">{city.state}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}