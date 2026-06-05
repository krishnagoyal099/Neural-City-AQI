// ============================================================
// FILE: src/components/compare/SideBySideGauge.tsx
// PURPOSE: Two AQI gauges rendered side by side for comparison
// DEPENDS ON: src/lib/types.ts, src/components/ui/Gauge.tsx
// ============================================================

'use client';

import type { CityAQIData } from '@/lib/types';
import Gauge from '@/components/ui/Gauge';

interface SideBySideGaugeProps {
  cityA: CityAQIData;
  cityB: CityAQIData;
}

/**
 * Places two Gauge components side-by-side to provide an immediate
 * visual comparison of two cities' AQI values.
 */
export default function SideBySideGauge({ cityA, cityB }: SideBySideGaugeProps) {
  return (
    <section className="grid grid-cols-1 gap-8 md:grid-cols-2">
      <div className="flex flex-col items-center justify-center rounded-3xl border border-white/60 bg-gradient-to-br from-white/90 to-white/60 p-8 backdrop-blur-xl shadow-[0_2px_16px_rgba(0,0,0,0.06)] transition-all hover:-translate-y-1">
        <Gauge 
          value={cityA.aqiValue} 
          size={240} 
          title="Air Quality"
          subtitle="Real-time Monitor"
          location={`${cityA.cityName}, IN`}
          showLegend={true}
        />
      </div>
      <div className="flex flex-col items-center justify-center rounded-3xl border border-white/60 bg-gradient-to-br from-white/90 to-white/60 p-8 backdrop-blur-xl shadow-[0_2px_16px_rgba(0,0,0,0.06)] transition-all hover:-translate-y-1">
        <Gauge 
          value={cityB.aqiValue} 
          size={240} 
          title="Air Quality"
          subtitle="Real-time Monitor"
          location={`${cityB.cityName}, IN`}
          showLegend={true}
        />
      </div>
    </section>
  );
}