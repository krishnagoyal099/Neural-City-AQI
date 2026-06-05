// ============================================================
// FILE: src/hooks/useCityData.ts
// PURPOSE: Hook for loading live AQI data from the WAQI API via internal route.
//          Auto-refreshes every 15 minutes. Gracefully falls back to static JSON.
// DEPENDS ON: src/lib/api-service.ts, src/lib/types.ts
// ============================================================

'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import type { CityAQIData } from '@/lib/types';
import { fetchAllCitiesAQI } from '@/lib/api-service';

const REFRESH_INTERVAL_MS = 15 * 60 * 1000; // 15 minutes

/**
 * Provides access to the full city dataset sourced from the live WAQI API.
 * Includes loading state, live indicator, last-fetched timestamp,
 * and a manual refresh trigger. Auto-refreshes every 15 minutes.
 */
export function useCityData() {
  const [cities, setCities]         = useState<CityAQIData[]>([]);
  const [isLoading, setIsLoading]   = useState<boolean>(true);
  const [isLive, setIsLive]         = useState<boolean>(false);
  const [fetchedAt, setFetchedAt]   = useState<string>('');
  const [error, setError]           = useState<string | null>(null);

  /** Core fetch function — shared by initial load and auto-refresh */
  const loadData = useCallback(async (): Promise<void> => {
    try {
      const { cities: data, isLive: live, fetchedAt: ts } = await fetchAllCitiesAQI();
      setCities(data);
      setIsLive(live);
      setFetchedAt(ts);
      setError(null);
    } catch (err) {
      setError('Failed to load air quality data.');
      console.error('[useCityData]', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /** Initial load */
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoading(true);
    loadData();
  }, [loadData]);

  /** Auto-refresh every 15 minutes */
  useEffect(() => {
    const interval = setInterval(loadData, REFRESH_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [loadData]);

  /** City lookup by ID — O(1) via Map */
  const cityMap = useMemo(() => {
    const map = new Map<string, CityAQIData>();
    for (const city of cities) {
      map.set(city.cityId, city);
    }
    return map;
  }, [cities]);

  /** Get a single city by its slug/ID */
  const getCity = useMemo(
    () => (cityId: string): CityAQIData | undefined => cityMap.get(cityId),
    [cityMap]
  );

  /** All city names sorted alphabetically for search/autocomplete */
  const cityNames = useMemo(
    () => cities.map((c) => c.cityName).sort(),
    [cities]
  );

  return {
    cities,
    isLoading,
    isLive,
    fetchedAt,
    error,
    getCity,
    cityMap,
    cityNames,
    refresh: loadData,
  };
}