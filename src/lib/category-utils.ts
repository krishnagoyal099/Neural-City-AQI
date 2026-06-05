// ============================================================
// FILE: src/lib/category-utils.ts
// PURPOSE: Determine AQI category and colors from numeric values
// DEPENDS ON: src/lib/types.ts, src/lib/constants.ts
// ============================================================

import type { AQICategory } from './types';
import { AQI_RANGES, AQI_COLORS } from './constants';

/**
 * Determines the AQI category from a numeric AQI value.
 * Returns 'Severe' for values exceeding the maximum defined range.
 */
export function getAQICategory(value: number): AQICategory {
  for (const range of AQI_RANGES) {
    if (value >= range.min && value <= range.max) {
      return range.label;
    }
  }
  return 'Severe';
}

/**
 * Returns the color associated with an AQI category.
 * Useful for consistent coloring across all components.
 */
export function getCategoryColor(category: AQICategory): string {
  const colorMap: Record<AQICategory, string> = {
    'Good': AQI_COLORS.good,
    'Satisfactory': AQI_COLORS.satisfactory,
    'Moderate': AQI_COLORS.moderate,
    'Poor': AQI_COLORS.poor,
    'Very Poor': AQI_COLORS.veryPoor,
    'Severe': AQI_COLORS.severe,
  };
  return colorMap[category];
}

/**
 * Returns the color for a numeric AQI value directly.
 * Convenience wrapper combining getAQICategory and getCategoryColor.
 */
export function getAQIColor(value: number): string {
  const category = getAQICategory(value);
  return getCategoryColor(category);
}

/**
 * Returns the health advisory index for a given category.
 * Used to look up advisory text from HEALTH_ADVISORIES array.
 */
export function getAdvisoryIndex(category: AQICategory): number {
  const indexMap: Record<AQICategory, number> = {
    'Good': 0,
    'Satisfactory': 1,
    'Moderate': 2,
    'Poor': 3,
    'Very Poor': 4,
    'Severe': 5,
  };
  return indexMap[category];
}

/**
 * Determines if an AQI value represents a critical situation.
 * Critical means Poor, Very Poor, or Severe.
 */
export function isCriticalAQI(value: number): boolean {
  const category = getAQICategory(value);
  return category === 'Poor' || category === 'Very Poor' || category === 'Severe';
}

/**
 * Returns a human-readable category with emoji indicator.
 * Used in badge and card components.
 */
export function getCategoryWithEmoji(category: AQICategory): string {
  const emojiMap: Record<AQICategory, string> = {
    'Good': 'Good',
    'Satisfactory': 'Satisfactory',
    'Moderate': 'Moderate',
    'Poor': 'Poor',
    'Very Poor': 'Very Poor',
    'Severe': 'Severe',
  };
  return emojiMap[category];
}
