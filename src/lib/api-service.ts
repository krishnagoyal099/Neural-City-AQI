// ============================================================
// FILE: src/lib/api-service.ts
// PURPOSE: Client-side API service for fetching live AQI data.
//          Calls internal Next.js route handlers (token stays server-side).
//          Falls back to static JSON if the API is unavailable.
// ============================================================

import type { CityAQIData } from '@/lib/types';
import staticCityData from '@/data/cities-aqi.json';

/** Response shape from /api/aqi */
interface AQIApiResponse {
  isLive: boolean;
  fetchedAt: string;
  cities: (CityAQIData & { isLive?: boolean })[];
}

/** Response shape from /api/aqi/[cityId] */
interface CityAQIApiResponse {
  isLive: boolean;
  city: CityAQIData & { isLive?: boolean };
}

/**
 * Fetch all cities' live AQI data from the internal API route.
 * Falls back to static JSON on any failure.
 */
export async function fetchAllCitiesAQI(): Promise<{
  cities: CityAQIData[];
  isLive: boolean;
  fetchedAt: string;
}> {
  try {
    const res = await fetch('/api/aqi', {
      // Next.js 15 fetch: don't cache on client, always get fresh
      cache: 'no-store',
    });

    if (!res.ok) throw new Error(`API responded with ${res.status}`);

    const json: AQIApiResponse = await res.json();
    return {
      cities: json.cities as CityAQIData[],
      isLive: json.isLive,
      fetchedAt: json.fetchedAt,
    };
  } catch (err) {
    console.warn('[api-service] Live AQI fetch failed, using static data:', err);
    return {
      cities: staticCityData as unknown as CityAQIData[],
      isLive: false,
      fetchedAt: new Date().toISOString(),
    };
  }
}

/**
 * Fetch a single city's live AQI from the internal API route.
 * Falls back to static data on failure.
 */
export async function fetchCityAQI(cityId: string): Promise<{
  city: CityAQIData;
  isLive: boolean;
}> {
  try {
    const res = await fetch(`/api/aqi/${cityId}`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`API responded with ${res.status}`);

    const json: CityAQIApiResponse = await res.json();
    return { city: json.city as CityAQIData, isLive: json.isLive };
  } catch (err) {
    console.warn(`[api-service] Live fetch for ${cityId} failed:`, err);
    const staticCity = (staticCityData as unknown as CityAQIData[]).find(
      (c) => c.cityId === cityId
    );
    return {
      city: staticCity ?? (staticCityData[0] as unknown as CityAQIData),
      isLive: false,
    };
  }
}
