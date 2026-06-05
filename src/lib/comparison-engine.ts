// ============================================================
// FILE: src/lib/comparison-engine.ts
// PURPOSE: Algorithms for comparing two cities' air quality profiles
// DEPENDS ON: src/lib/types.ts, src/lib/aqi-calculator.ts
// ============================================================

import type { CityAQIData, ComparisonResult, PollutantData } from './types';
import { getDominantPollutant } from './aqi-calculator';

/**
 * Compares two cities and produces a structured ComparisonResult.
 * Identifies which city is cleaner, by how much, and the primary
 * pollutant driving the difference.
 */
export function compareCities(cityA: CityAQIData, cityB: CityAQIData): ComparisonResult {
  const aqiDifference = Math.abs(cityA.aqiValue - cityB.aqiValue);

  const cleanerCity = cityA.aqiValue <= cityB.aqiValue ? cityA.cityName : cityB.cityName;

  const percentDifference =
    cityA.aqiValue === 0 && cityB.aqiValue === 0
      ? 0
      : Math.round((aqiDifference / Math.max(cityA.aqiValue, cityB.aqiValue)) * 100);

  const primaryDifference = findPrimaryDifferencePollutant(cityA.pollutants, cityB.pollutants);

  return {
    cityA,
    cityB,
    aqiDifference,
    cleanerCity,
    primaryDifference,
    percentDifference,
  };
}

/**
 * Finds which pollutant has the largest relative difference between two cities.
 * Compares each pollutant's ratio against its severe threshold to find
 * the one with the biggest gap.
 */
function findPrimaryDifferencePollutant(
  pollutantsA: PollutantData,
  pollutantsB: PollutantData
): keyof PollutantData {
  const keys = Object.keys(pollutantsA) as Array<keyof PollutantData>;
  let maxDiff = 0;
  let primary: keyof PollutantData = 'pm25';

  for (const key of keys) {
    const diff = Math.abs(pollutantsA[key] - pollutantsB[key]);
    if (diff > maxDiff) {
      maxDiff = diff;
      primary = key;
    }
  }

  return primary;
}

/**
 * Generates a human-readable verdict string for a comparison.
 * Explains the key finding in plain language.
 */
export function generateVerdict(result: ComparisonResult): string {
  const { cityA, cityB, aqiDifference, cleanerCity, primaryDifference, percentDifference } = result;
  const dirtierCity = cleanerCity === cityA.cityName ? cityB.cityName : cityA.cityName;

  const pollutantLabels: Record<string, string> = {
    pm25: 'PM2.5',
    pm10: 'PM10',
    no2: 'NO₂',
    so2: 'SO₂',
    co: 'CO',
    o3: 'O₃',
    nh3: 'NH₃',
  };

  if (aqiDifference < 10) {
    return `${cityA.cityName} and ${cityB.cityName} have similar air quality, with only ${aqiDifference} AQI points difference.`;
  }

  return `${cleanerCity}'s air is ${percentDifference}% cleaner than ${dirtierCity}'s, primarily due to lower ${pollutantLabels[primaryDifference]} levels.`;
}

/**
 * Returns an array of peer city data for a given city.
 * Peer cities are defined in the city's peerCities array.
 */
export function getPeerCitiesData(
  city: CityAQIData,
  allCities: CityAQIData[]
): CityAQIData[] {
  return allCities.filter((c) => city.peerCities.includes(c.cityId));
}