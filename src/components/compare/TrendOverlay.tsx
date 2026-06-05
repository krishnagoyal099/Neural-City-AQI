// ============================================================
// FILE: src/components/compare/TrendOverlay.tsx
// PURPOSE: Wrapper for dual trend line chart comparing two cities
// DEPENDS ON: src/lib/types.ts, src/components/charts/DualTrendLine.tsx
// ============================================================

'use client';

import type { CityAQIData } from '@/lib/types';
import DualTrendLine from '@/components/charts/DualTrendLine';

interface TrendOverlayProps {
  cityA: CityAQIData;
  cityB: CityAQIData;
}

/**
 * Section rendering the dual line chart overlaying the 12-month
 * AQI trends of two selected cities.
 */
export default function TrendOverlay({ cityA, cityB }: TrendOverlayProps) {
  return (
    <section>
      <DualTrendLine
        cityAName={cityA.cityName}
        cityBName={cityB.cityName}
        trendA={cityA.monthlyTrend}
        trendB={cityB.monthlyTrend}
        title="12-Month Trend Overlay"
      />
    </section>
  );
}