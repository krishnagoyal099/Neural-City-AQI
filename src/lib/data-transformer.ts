// ============================================================
// FILE: src/lib/data-transformer.ts
// PURPOSE: Transform raw city data into derived aggregates and summaries
// DEPENDS ON: src/lib/types.ts, src/lib/aqi-calculator.ts, src/lib/category-utils.ts
// ============================================================

import type { CityAQIData, CategoryDistribution, SeasonalDataPoint } from './types';
import { getAQICategory } from './category-utils';

/**
 * Computes the national average AQI across all tracked cities.
 */
export function calculateNationalAverage(cities: CityAQIData[]): number {
  if (cities.length === 0) return 0;
  const sum = cities.reduce((acc, city) => acc + city.aqiValue, 0);
  return Math.round(sum / cities.length);
}

/**
 * Counts cities in each AQI category for distribution charts.
 */
export function calculateCategoryDistribution(cities: CityAQIData[]): CategoryDistribution {
  const distribution: CategoryDistribution = {
    Good: 0,
    Satisfactory: 0,
    Moderate: 0,
    Poor: 0,
    'Very Poor': 0,
    Severe: 0,
  };

  for (const city of cities) {
    distribution[city.aqiCategory] += 1;
  }

  return distribution;
}

/**
 * Returns the top N cities with the lowest AQI (cleanest air).
 */
export function getCleanestCities(cities: CityAQIData[], count: number): CityAQIData[] {
  return [...cities]
    .sort((a, b) => a.aqiValue - b.aqiValue)
    .slice(0, count);
}

/**
 * Returns the top N cities with the highest AQI (most polluted).
 */
export function getMostPollutedCities(cities: CityAQIData[], count: number): CityAQIData[] {
  return [...cities]
    .sort((a, b) => b.aqiValue - a.aqiValue)
    .slice(0, count);
}

/**
 * Counts how many cities have "Good" or "Satisfactory" AQI.
 */
export function countCleanCities(cities: CityAQIData[]): number {
  return cities.filter(
    (c) => c.aqiCategory === 'Good' || c.aqiCategory === 'Satisfactory'
  ).length;
}

/**
 * Counts cities in critical condition (Poor, Very Poor, or Severe).
 */
export function countCriticalCities(cities: CityAQIData[]): number {
  return cities.filter(
    (c) => c.aqiCategory === 'Poor' ||
           c.aqiCategory === 'Very Poor' ||
           c.aqiCategory === 'Severe'
  ).length;
}

/**
 * Generates seasonal trend data from all cities' monthly trends.
 * Aggregates national averages per month.
 */
export function generateSeasonalTrend(cities: CityAQIData[]): SeasonalDataPoint[] {
  const months = cities[0]?.monthlyTrend.map((m) => m.month) ?? [];

  return months.map((month, idx) => {
    let totalAQI = 0;
    let goodCount = 0;
    let moderateCount = 0;
    let poorCount = 0;

    for (const city of cities) {
      const point = city.monthlyTrend[idx];
      if (!point) continue;
      totalAQI += point.aqiValue;
      const cat = getAQICategory(point.aqiValue);
      if (cat === 'Good' || cat === 'Satisfactory') goodCount++;
      else if (cat === 'Moderate') moderateCount++;
      else poorCount++;
    }

    return {
      month,
      nationalAvg: Math.round(totalAQI / cities.length),
      goodCount,
      moderateCount,
      poorCount,
    };
  });
}

/**
 * Ranks all cities by AQI ascending and returns rank for a given city.
 */
export function getCityRank(cityId: string, cities: CityAQIData[]): number {
  const sorted = [...cities].sort((a, b) => a.aqiValue - b.aqiValue);
  const idx = sorted.findIndex((c) => c.cityId === cityId);
  return idx >= 0 ? idx + 1 : cities.length;
}

/**
 * Filters cities by a search query matching city name or state.
 */
export function searchCities(query: string, cities: CityAQIData[]): CityAQIData[] {
  const lower = query.toLowerCase().trim();
  if (!lower) return cities;
  return cities.filter(
    (c) =>
      c.cityName.toLowerCase().includes(lower) ||
      c.state.toLowerCase().includes(lower)
  );
}