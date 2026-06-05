'use client';

import { useMemo, useEffect } from 'react';
import { useCityData } from '@/hooks/useCityData';
import { useDashboard } from '@/context/DashboardContext';
import { calculateNationalAverage, calculateCategoryDistribution, countCleanCities, countCriticalCities, generateSeasonalTrend } from '@/lib/data-transformer';
import { getAQICategory } from '@/lib/category-utils';
import { HEALTH_ADVISORIES } from '@/lib/constants';

import HeroSection from '@/components/dashboard/HeroSection';
import KeyMetricsRow from '@/components/dashboard/KeyMetricsRow';
import TopCitiesSection from '@/components/dashboard/TopCitiesSection';
import Skeleton from '@/components/ui/Skeleton';
import dynamic from 'next/dynamic';

const AQIDonutChart = dynamic(() => import('@/components/charts/AQIDonutChart'), {
  loading: () => <Skeleton height="350px" />
});
const SeasonalInsight = dynamic(() => import('@/components/dashboard/SeasonalInsight'), {
  loading: () => <Skeleton height="350px" />
});

/**
 * Overview dashboard page. Assembles all high-level dashboard composites
 * and passes derived data (averages, distributions, etc.) to them.
 * Syncs live AQI status into global DashboardContext for the nav LiveIndicator.
 */
export default function OverviewPage() {
  const { cities, isLoading, isLive, fetchedAt } = useCityData();
  const { setIsLive, setFetchedAt } = useDashboard();

  // Sync live status into context so the navbar LiveIndicator can read it
  useEffect(() => {
    if (!isLoading) {
      setIsLive(isLive);
      setFetchedAt(fetchedAt);
    }
  }, [isLive, fetchedAt, isLoading, setIsLive, setFetchedAt]);

  const nationalAvg    = useMemo(() => calculateNationalAverage(cities), [cities]);
  const distribution   = useMemo(() => calculateCategoryDistribution(cities), [cities]);
  const cleanCount     = useMemo(() => countCleanCities(cities), [cities]);
  const criticalCount  = useMemo(() => countCriticalCities(cities), [cities]);
  const seasonalTrend  = useMemo(() => generateSeasonalTrend(cities), [cities]);

  const advisoryText = useMemo(() => {
    const category = getAQICategory(nationalAvg);
    const advisory = HEALTH_ADVISORIES.find((a) => a.category === category);
    return advisory?.shortText ?? 'Air quality data loading...';
  }, [nationalAvg]);

  if (isLoading) {
    return (
      <div className="grid gap-4 p-6" style={{
        gridTemplateColumns: 'repeat(12, 1fr)',
        gridTemplateRows: 'auto',
      }}>
        {[...Array(8)].map((_, i) => (
          <div key={i} className="col-span-3"><Skeleton height="180px" /></div>
        ))}
      </div>
    );
  }

  return (
    <div className="w-full p-4 md:p-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ── Left Column (4/12) ── */}
        <div className="flex flex-col gap-6 lg:col-span-4">
          <HeroSection
            nationalAverageAQI={nationalAvg}
            cities={cities}
            advisoryText={advisoryText}
          />
          <TopCitiesSection cities={cities} />
        </div>

        {/* ── Right Column (8/12) ── */}
        <div className="flex flex-col gap-6 lg:col-span-8">
          
          {/* Top Row: Donut + Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AQIDonutChart distribution={distribution} />
            <KeyMetricsRow
              totalCities={cities.length}
              cleanCities={cleanCount}
              criticalCities={criticalCount}
              nationalAvgAQI={nationalAvg}
            />
          </div>

          {/* Bottom Row: Seasonal Trend */}
          <div className="w-full">
            <SeasonalInsight data={seasonalTrend} />
          </div>

        </div>

      </div>
    </div>
  );
}