// ============================================================
// FILE: src/lib/aqi-calculator.ts
// PURPOSE: Calculations for AQI dominance and health scores
// DEPENDS ON: src/lib/types.ts
// ============================================================

import type { PollutantData } from './types';

const MAX_VALUES: Record<string, number> = {
  pm25: 250, pm10: 430, no2: 280, so2: 380, co: 46, o3: 380, nh3: 1800,
};

/**
 * Identifies the dominant pollutant based on its ratio to its max severe threshold.
 */
export function getDominantPollutant(pollutants: PollutantData): keyof PollutantData {
  let dominant: keyof PollutantData = 'pm25';
  let maxRatio = 0;

  for (const [key, val] of Object.entries(pollutants)) {
    const ratio = val / (MAX_VALUES[key] || 1);
    if (ratio > maxRatio) {
      maxRatio = ratio;
      dominant = key as keyof PollutantData;
    }
  }

  return dominant;
}

/**
 * Calculates a 0-100 health score for a specific pollutant.
 * 100 = perfectly clean air, 0 = severe pollution.
 */
export function pollutantHealthScore(pollutant: keyof PollutantData, value: number): number {
  const max = MAX_VALUES[pollutant] || 1;
  const ratio = Math.min(value / max, 1); // Cap at 1
  return Math.round(100 - (ratio * 100));
}

/**
 * Calculates the projected rank of a city if its AQI improves by a certain percentage.
 */
export function projectedRank(currentAQI: number, improvementPercent: number, allAQIs: { cityId: string; aqiValue: number }[]): number {
  const improvedAQI = Math.round(currentAQI * (1 - improvementPercent / 100));
  const sorted = [...allAQIs].map((c) => c.aqiValue).sort((a, b) => a - b);
  const rank = sorted.findIndex((val) => improvedAQI <= val);
  return rank >= 0 ? rank + 1 : sorted.length + 1;
}

/**
 * Estimates the economic health cost based on AQI and population.
 */
export function estimateHealthCost(aqiValue: number, populationInMillions: number): string {
  // Simple heuristic: Cost increases non-linearly with AQI
  const cost = Math.round((aqiValue / 50) * populationInMillions * 12);
  return `₹${cost} Cr/year`;
}
