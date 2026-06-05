// ============================================================
// FILE: src/hooks/useAQICategory.ts
// PURPOSE: Derive AQI category, color, and advisory from a numeric value
// DEPENDS ON: src/lib/category-utils.ts, src/lib/constants.ts
// ============================================================

'use client';

import { useMemo } from 'react';
import { getAQICategory, getCategoryColor, getAdvisoryIndex } from '@/lib/category-utils';
import { HEALTH_ADVISORIES } from '@/lib/constants';
import type { AQICategory } from '@/lib/types';

/** Return type for the useAQICategory hook */
interface AQICategoryInfo {
  category: AQICategory;
  color: string;
  advisory: typeof HEALTH_ADVISORIES[number];
  isCritical: boolean;
}

/**
 * Given a numeric AQI value, returns the category, color,
 * advisory text, and critical status. Memoized for performance.
 */
export function useAQICategory(aqiValue: number): AQICategoryInfo {
  return useMemo(() => {
    const category = getAQICategory(aqiValue);
    const color = getCategoryColor(category);
    const advisoryIndex = getAdvisoryIndex(category);
    const advisory = HEALTH_ADVISORIES[advisoryIndex]!;
    const isCritical =
      category === 'Poor' || category === 'Very Poor' || category === 'Severe';

    return { category, color, advisory, isCritical };
  }, [aqiValue]);
}