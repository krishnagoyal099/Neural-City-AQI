// ============================================================
// FILE: src/components/government/AlertCalendar.tsx
// PURPOSE: 12-month calendar color-coded by historical AQI risk
// DEPENDS ON: src/lib/types.ts, src/lib/category-utils.ts
// ============================================================

'use client';

import { useMemo } from 'react';
import type { CityAQIData, AQICategory } from '@/lib/types';
import { getAQICategory, getAQIColor } from '@/lib/category-utils';
import Card from '@/components/ui/Card';
import { MONTH_LABELS } from '@/lib/constants';

interface AlertCalendarProps {
  city: CityAQIData | null;
}

/** Determine overall risk level of a month based on its category */
function getRiskLevel(category: AQICategory): 'Low' | 'Medium' | 'High' | 'Critical' {
  if (category === 'Good' || category === 'Satisfactory') return 'Low';
  if (category === 'Moderate') return 'Medium';
  if (category === 'Poor') return 'High';
  return 'Critical';
}

/**
 * Visual calendar showing 12 months color-coded by historical AQI risk.
 * Helps officers plan ahead for high-pollution seasons.
 */
export default function AlertCalendar({ city }: AlertCalendarProps) {
  const calendarData = useMemo(() => {
    if (!city) return [];
    return city.monthlyTrend.map((point) => ({
      month: point.month,
      aqi: point.aqiValue,
      category: getAQICategory(point.aqiValue),
      color: getAQIColor(point.aqiValue),
      risk: getRiskLevel(getAQICategory(point.aqiValue)),
    }));
  }, [city]);

  return (
    <Card padding="md">
      <h3 className="mb-4 text-lg font-semibold text-slate-800 dark:text-zinc-100">Seasonal Alert Calendar</h3>
      {!city ? (
        <p className="text-sm text-slate-500 dark:text-zinc-400">Select a city to view its seasonal risk calendar.</p>
      ) : (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
          {calendarData.map((month) => (
            <div
              key={month.month}
              className="flex flex-col items-center rounded-2xl p-4 transition-transform hover:-translate-y-1 shadow-sm bg-white dark:bg-black"
              style={{ border: `2px solid ${month.color}20` }}
            >
              <span className="text-xs font-bold text-slate-500 dark:text-zinc-500 uppercase tracking-wider">{month.month}</span>
              <span className="mt-2 text-2xl font-bold" style={{ color: month.color }}>
                {month.aqi}
              </span>
              <span className="mt-1 text-xs font-medium" style={{ color: month.color }}>
                {month.risk}
              </span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}