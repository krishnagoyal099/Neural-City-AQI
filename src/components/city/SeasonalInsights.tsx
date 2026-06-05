// ============================================================
// FILE: src/components/city/SeasonalInsights.tsx
// PURPOSE: Monthly trend chart and generated seasonal text insights
// DEPENDS ON: src/lib/types.ts, src/components/charts/TrendLineChart.tsx
// ============================================================

'use client';

import type { CityAQIData, MonthlyAQIPoint } from '@/lib/types';
import TrendLineChart from '@/components/charts/TrendLineChart';
import Card from '@/components/ui/Card';

interface SeasonalInsightsProps {
  city: CityAQIData;
}

/**
 * Displays the 12-month AQI trend line alongside text-based
 * seasonal insights derived from the monthly data.
 */
export default function SeasonalInsights({ city }: SeasonalInsightsProps) {
  /** Derive peak and low months from trend data */
  const sortedTrend = [...city.monthlyTrend].sort((a, b) => b.aqiValue - a.aqiValue);
  const peakMonth = sortedTrend[0];
  const lowMonth = sortedTrend[sortedTrend.length - 1];

  const insightText = `${city.cityName}'s AQI peaks in ${peakMonth?.month ?? 'N/A'} (AQI ${peakMonth?.aqiValue ?? 'N/A'}) and is cleanest in ${lowMonth?.month ?? 'N/A'} (AQI ${lowMonth?.aqiValue ?? 'N/A'}). Plan outdoor activities and pollution control measures accordingly.`;

  return (
    <section className="space-y-6">
      <TrendLineChart
        data={city.monthlyTrend}
        title={`${city.cityName} — 12-Month Trend`}
      />

      <Card padding="md">
        <h3 className="mb-2 text-lg font-semibold text-slate-800">Seasonal Insights</h3>
        <p className="text-sm font-medium leading-relaxed text-slate-600">{insightText}</p>
      </Card>
    </section>
  );
}