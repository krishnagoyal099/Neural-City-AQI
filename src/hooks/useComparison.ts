// ============================================================
// FILE: src/hooks/useComparison.ts
// PURPOSE: Manages comparison state between two selected cities
// DEPENDS ON: src/lib/types.ts, src/lib/comparison-engine.ts
// ============================================================

'use client';

import { useState, useMemo, useCallback } from 'react';
import type { CityAQIData, ComparisonResult } from '@/lib/types';
import { compareCities, generateVerdict } from '@/lib/comparison-engine';

/**
 * Manages city comparison state: selection of two cities,
 * computed comparison result, and generated verdict text.
 */
export function useComparison(cities: CityAQIData[]) {
  const [cityAId, setCityAId] = useState<string>('');
  const [cityBId, setCityBId] = useState<string>('');

  /** Look up full city data for both selections */
  const cityA = useMemo(
    () => cities.find((c) => c.cityId === cityAId),
    [cities, cityAId]
  );

  const cityB = useMemo(
    () => cities.find((c) => c.cityId === cityBId),
    [cities, cityBId]
  );

  /** Compute comparison only when both cities are selected */
  const comparison: ComparisonResult | null = useMemo(() => {
    if (!cityA || !cityB) return null;
    return compareCities(cityA, cityB);
  }, [cityA, cityB]);

  /** Generate human-readable verdict */
  const verdict: string = useMemo(() => {
    if (!comparison) return '';
    return generateVerdict(comparison);
  }, [comparison]);

  /** Reset both selections */
  const resetComparison = useCallback(() => {
    setCityAId('');
    setCityBId('');
  }, []);

  return {
    cityAId,
    cityBId,
    cityA,
    cityB,
    comparison,
    verdict,
    setCityAId,
    setCityBId,
    resetComparison,
  };
}