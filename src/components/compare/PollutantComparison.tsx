// ============================================================
// FILE: src/components/compare/PollutantComparison.tsx
// PURPOSE: Wrapper for grouped bar chart comparing two cities' pollutants
// DEPENDS ON: src/lib/types.ts, src/components/charts/ComparisonGroupedBar.tsx
// ============================================================

'use client';

import type { CityAQIData } from '@/lib/types';
import ComparisonGroupedBar from '@/components/charts/ComparisonGroupedBar';

interface PollutantComparisonProps {
  cityA: CityAQIData;
  cityB: CityAQIData;
}

/**
 * Section rendering the grouped bar chart comparing pollutant
 * concentrations between two selected cities.
 */
export default function PollutantComparison({ cityA, cityB }: PollutantComparisonProps) {
  return (
    <section>
      <ComparisonGroupedBar
        cityAName={cityA.cityName}
        cityBName={cityB.cityName}
        pollutantsA={cityA.pollutants}
        pollutantsB={cityB.pollutants}
        title="Pollutant Concentration Comparison"
      />
    </section>
  );
}