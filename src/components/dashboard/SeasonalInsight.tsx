// ============================================================
// FILE: src/components/dashboard/SeasonalInsight.tsx
// PURPOSE: Wrapper for the seasonal area chart on the landing page
// DEPENDS ON: src/lib/types.ts, src/components/charts/SeasonalAreaChart.tsx
// ============================================================

'use client';

import type { SeasonalDataPoint } from '@/lib/types';
import SeasonalAreaChart from '@/components/charts/SeasonalAreaChart';

interface SeasonalInsightProps {
  data: SeasonalDataPoint[];
}

/**
 * Section displaying the 12-month seasonal AQI trend
 * showing how city categories shift across the year.
 */
export default function SeasonalInsight({ data }: SeasonalInsightProps) {
  return <SeasonalAreaChart data={data} />;
}