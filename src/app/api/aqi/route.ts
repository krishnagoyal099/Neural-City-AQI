// ============================================================
// FILE: src/app/api/aqi/route.ts
// PURPOSE: Server-side Route Handler — proxies WAQI API for all tracked cities.
//          Merges live AQI + pollutant data with static city metadata.
//          Next.js ISR caches this response for 15 minutes server-side.
// ============================================================

import { NextResponse } from 'next/server';
import staticCityData from '@/data/cities-aqi.json';
import { getAQICategory } from '@/lib/category-utils';
import type { CityAQIData } from '@/lib/types';

/** WAQI API response shape for a single city feed */
interface WAQIResponse {
  status: 'ok' | 'error';
  data?: {
    aqi: number;
    time: { iso: string };
    iaqi?: {
      pm25?: { v: number };
      pm10?: { v: number };
      no2?:  { v: number };
      so2?:  { v: number };
      co?:   { v: number };
      o3?:   { v: number };
    };
  };
}

/**
 * Fetches live AQI for a single city from WAQI by city name.
 * Returns null on failure so the city can fall back to static data.
 */
async function fetchCityLiveAQI(
  cityName: string,
  token: string
): Promise<{ aqi: number; pollutants: Partial<CityAQIData['pollutants']>; lastUpdated: string } | null> {
  try {
    const url = `https://api.waqi.info/feed/${encodeURIComponent(cityName)}/?token=${token}`;
    const res = await fetch(url, { next: { revalidate: 900 } }); // 15-minute cache
    if (!res.ok) return null;

    const json: WAQIResponse = await res.json();
    if (json.status !== 'ok' || !json.data) return null;

    const { data } = json;
    const iaqi = data.iaqi ?? {};

    return {
      aqi: typeof data.aqi === 'number' ? data.aqi : -1,
      pollutants: {
        pm25: iaqi.pm25?.v,
        pm10: iaqi.pm10?.v,
        no2:  iaqi.no2?.v,
        so2:  iaqi.so2?.v,
        co:   iaqi.co?.v,
        o3:   iaqi.o3?.v,
      },
      lastUpdated: data.time?.iso ?? new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

/**
 * GET /api/aqi
 * Returns all 25 tracked cities with live AQI values merged in.
 * Falls back to static data per city if the WAQI call fails.
 */
export async function GET() {
  const token = process.env['WAQI_TOKEN'];

  // If no token configured, return static data immediately
  if (!token) {
    return NextResponse.json({
      isLive: false,
      fetchedAt: new Date().toISOString(),
      cities: staticCityData,
    });
  }

  // Fetch all cities in parallel
  const enriched = await Promise.all(
    (staticCityData as unknown as CityAQIData[]).map(async (city) => {
      const live = await fetchCityLiveAQI(city.cityName, token);

      if (!live || live.aqi < 0) {
        // API returned no data — return static city as-is
        return { ...city, isLive: false };
      }

      const liveCategory = getAQICategory(live.aqi);

      return {
        ...city,
        // Override AQI + category with live values
        aqiValue: live.aqi,
        aqiCategory: liveCategory,
        // Merge pollutants — live values override static where available
        pollutants: {
          ...city.pollutants,
          ...(live.pollutants.pm25 !== undefined && { pm25: live.pollutants.pm25 }),
          ...(live.pollutants.pm10 !== undefined && { pm10: live.pollutants.pm10 }),
          ...(live.pollutants.no2  !== undefined && { no2:  live.pollutants.no2  }),
          ...(live.pollutants.so2  !== undefined && { so2:  live.pollutants.so2  }),
          ...(live.pollutants.co   !== undefined && { co:   live.pollutants.co   }),
          ...(live.pollutants.o3   !== undefined && { o3:   live.pollutants.o3   }),
          // nh3 not provided by WAQI, keep static
        },
        lastUpdated: live.lastUpdated,
        isLive: true,
      };
    })
  );

  const anyLive = enriched.some((c) => c.isLive);

  return NextResponse.json({
    isLive: anyLive,
    fetchedAt: new Date().toISOString(),
    cities: enriched,
  });
}
