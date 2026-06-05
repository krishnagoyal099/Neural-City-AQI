// ============================================================
// FILE: src/app/api/aqi/[cityId]/route.ts
// PURPOSE: Server-side Route Handler for single-city live AQI.
//          Used by city detail pages and comparison view.
// ============================================================

import { NextResponse } from 'next/server';
import staticCityData from '@/data/cities-aqi.json';
import { getAQICategory } from '@/lib/category-utils';
import type { CityAQIData } from '@/lib/types';

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
 * GET /api/aqi/[cityId]
 * Returns a single city's data enriched with live WAQI values.
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ cityId: string }> }
) {
  const { cityId } = await params;
  const token = process.env['WAQI_TOKEN'];

  const staticCity = (staticCityData as unknown as CityAQIData[]).find(
    (c) => c.cityId === cityId
  );

  if (!staticCity) {
    return NextResponse.json({ error: 'City not found' }, { status: 404 });
  }

  if (!token) {
    return NextResponse.json({ isLive: false, city: staticCity });
  }

  try {
    const url = `https://api.waqi.info/feed/${encodeURIComponent(staticCity.cityName)}/?token=${token}`;
    const res = await fetch(url, { next: { revalidate: 900 } });
    const json: WAQIResponse = await res.json();

    if (json.status !== 'ok' || !json.data || typeof json.data.aqi !== 'number') {
      return NextResponse.json({ isLive: false, city: staticCity });
    }

    const { data } = json;
    const iaqi = data.iaqi ?? {};
    const liveAQI = data.aqi;

    const enriched: CityAQIData & { isLive: boolean } = {
      ...staticCity,
      aqiValue: liveAQI,
      aqiCategory: getAQICategory(liveAQI),
      pollutants: {
        ...staticCity.pollutants,
        ...(iaqi.pm25?.v !== undefined && { pm25: iaqi.pm25.v }),
        ...(iaqi.pm10?.v !== undefined && { pm10: iaqi.pm10.v }),
        ...(iaqi.no2?.v  !== undefined && { no2:  iaqi.no2.v  }),
        ...(iaqi.so2?.v  !== undefined && { so2:  iaqi.so2.v  }),
        ...(iaqi.co?.v   !== undefined && { co:   iaqi.co.v   }),
        ...(iaqi.o3?.v   !== undefined && { o3:   iaqi.o3.v   }),
      },
      lastUpdated: data.time?.iso ?? new Date().toISOString(),
      isLive: true,
    };

    return NextResponse.json({ isLive: true, city: enriched });
  } catch {
    return NextResponse.json({ isLive: false, city: staticCity });
  }
}
