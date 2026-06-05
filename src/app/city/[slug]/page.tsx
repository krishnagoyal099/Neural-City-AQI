// ============================================================
// FILE: src/app/city/[slug]/page.tsx
// PURPOSE: City Deep Dive page showing detailed AQI profile
// DEPENDS ON: src/hooks/useCityData.ts, src/components/city/*
// ============================================================

'use client';

import { useParams, useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { useCityData } from '@/hooks/useCityData';
import { getPeerCitiesData } from '@/lib/comparison-engine';

import AQIHeroCard from '@/components/city/AQIHeroCard';
import PeerComparison from '@/components/city/PeerComparison';
import HealthScoreCard from '@/components/city/HealthScoreCard';
import Skeleton from '@/components/ui/Skeleton';
import dynamic from 'next/dynamic';

const PollutantBreakdown = dynamic(() => import('@/components/city/PollutantBreakdown'), {
  loading: () => <Skeleton height="350px" />
});
const SeasonalInsights = dynamic(() => import('@/components/city/SeasonalInsights'), {
  loading: () => <Skeleton height="350px" />
});
import Button from '@/components/ui/Button';
import { Scale } from 'lucide-react';

/**
 * City deep dive page. Reads the city slug from the URL,
 * fetches the corresponding data, and renders detailed charts.
 */
export default function CityDeepDivePage() {
  const params = useParams();
  const router = useRouter();
  const { cities, isLoading, getCity } = useCityData();

  const slug = typeof params?.['slug'] === 'string' ? params['slug'] : '';
  const city = useMemo(() => getCity(slug), [getCity, slug]);
  const peers = useMemo(() => (city ? getPeerCitiesData(city, cities) : []), [city, cities]);

  if (isLoading) {
    return (
      <div className="space-y-8">
        <Skeleton height="250px" />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Skeleton height="300px" />
          <Skeleton height="300px" />
        </div>
      </div>
    );
  }

  if (!city) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
        <p className="text-xl font-semibold text-slate-800">City not found</p>
        <p className="text-sm font-medium text-slate-500">The city you are looking for does not exist in our database.</p>
        <Button onClick={() => router.push('/')}>Return to Dashboard</Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <AQIHeroCard city={city} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <PollutantBreakdown cityName={city.cityName} pollutants={city.pollutants} />
        <HealthScoreCard pollutants={city.pollutants} />
      </div>

      <PeerComparison city={city} peers={peers} />

      <SeasonalInsights city={city} />

      <div className="flex justify-center">
        <Button
          onClick={() => router.push(`/compare?cityA=${city.cityId}`)}
          variant="secondary"
          icon={<Scale size={18} />}
        >
          Compare {city.cityName} with another city
        </Button>
      </div>
    </div>
  );
}