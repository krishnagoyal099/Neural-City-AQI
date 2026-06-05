// ============================================================
// FILE: src/components/city/PollutantBreakdown.tsx
// PURPOSE: Radar chart showing city's pollutant breakdown
// DEPENDS ON: src/lib/types.ts, src/components/charts/RadarPollutantChart.tsx
// ============================================================

'use client';

import type { PollutantData } from '@/lib/types';
import RadarPollutantChart from '@/components/charts/RadarPollutantChart';

interface PollutantBreakdownProps {
  cityName: string;
  pollutants: PollutantData;
}

/**
 * Section rendering the radar chart for a city's pollutant concentrations.
 */
export default function PollutantBreakdown({ cityName, pollutants }: PollutantBreakdownProps) {
  return (
    <section>
      <RadarPollutantChart
        pollutants={pollutants}
        cityNames={[cityName, '']}
        title={`${cityName} Pollutant Profile`}
      />
    </section>
  );
}