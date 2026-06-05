// ============================================================
// FILE: src/app/compare/page.tsx
// PURPOSE: City Comparison Tool page
// DEPENDS ON: src/hooks/useCityData.ts, src/hooks/useComparison.ts, src/components/compare/*
// ============================================================

'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';
import { useCityData } from '@/hooks/useCityData';
import { useComparison } from '@/hooks/useComparison';

import CitySelector from '@/components/compare/CitySelector';
import VerdictCard from '@/components/compare/VerdictCard';
import Card from '@/components/ui/Card';
import Skeleton from '@/components/ui/Skeleton';
import dynamic from 'next/dynamic';

const SideBySideGauge = dynamic(() => import('@/components/compare/SideBySideGauge'), {
  loading: () => <Skeleton height="350px" />
});
const PollutantComparison = dynamic(() => import('@/components/compare/PollutantComparison'), {
  loading: () => <Skeleton height="350px" />
});
const TrendOverlay = dynamic(() => import('@/components/compare/TrendOverlay'), {
  loading: () => <Skeleton height="350px" />
});
import { Scale } from 'lucide-react';

function CompareContent() {
  const searchParams = useSearchParams();
  const { cities, isLoading } = useCityData();
  const { cityAId, cityBId, cityA, cityB, comparison, verdict, setCityAId, setCityBId } = useComparison(cities);

  /** Pre-select City A from URL query parameter if present */
  useEffect(() => {
    const cityAParam = searchParams.get('cityA');
    if (cityAParam && !cityAId) {
      setCityAId(cityAParam);
    }
  }, [searchParams, cityAId, setCityAId]);

  if (isLoading) {
    return (
      <div className="space-y-8">
        <Skeleton height="80px" />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Skeleton height="300px" />
          <Skeleton height="300px" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-zinc-100 md:text-4xl">Compare Cities</h1>
        <p className="mt-2 font-medium text-slate-600 dark:text-zinc-400">Select two cities to compare their air quality profiles side by side.</p>
      </div>

      <CitySelector
        cities={cities}
        cityAId={cityAId}
        cityBId={cityBId}
        onCityAChangeAction={setCityAId}
        onCityBChangeAction={setCityBId}
      />

      {cityA && cityB ? (
        <div className="space-y-8">
          <SideBySideGauge cityA={cityA} cityB={cityB} />
          <VerdictCard verdict={verdict} />
          <PollutantComparison cityA={cityA} cityB={cityB} />
          <TrendOverlay cityA={cityA} cityB={cityB} />
        </div>
      ) : (
        <Card padding="lg" className="flex flex-col items-center justify-center py-16 text-center">
          <Scale size={48} className="text-slate-400 dark:text-zinc-600 mb-4" />
          <p className="text-lg font-bold text-slate-700 dark:text-zinc-300">Select two cities above to begin comparison</p>
          <p className="mt-1 text-sm font-medium text-slate-500 dark:text-zinc-500">You can choose any two cities from the dropdown menus.</p>
        </Card>
      )}
    </div>
  );
}

/**
 * City comparison page wrapper with Suspense. Allows users to select two cities
 * and view side-by-side gauges, pollutant comparisons,
 * trend overlays, and a generated verdict.
 */
export default function ComparePage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-8">
          <Skeleton height="80px" />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Skeleton height="300px" />
            <Skeleton height="300px" />
          </div>
        </div>
      }
    >
      <CompareContent />
    </Suspense>
  );
}