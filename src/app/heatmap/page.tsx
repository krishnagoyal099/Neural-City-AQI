'use client';

import { useRouter } from 'next/navigation';
import { useCityData } from '@/hooks/useCityData';
import dynamic from 'next/dynamic';
import Skeleton from '@/components/ui/Skeleton';

const IndiaHeatMap = dynamic(() => import('@/components/charts/IndiaHeatMap'), {
  ssr: false,
  loading: () => <Skeleton className="w-full h-full min-h-[400px] rounded-[32px]" />
});
import type { CityAQIData } from '@/lib/types';

export default function HeatmapPage() {
  const { cities, isLoading } = useCityData();
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="w-full h-[calc(100vh-80px)] p-6">
        <Skeleton className="w-full h-full rounded-[32px]" />
      </div>
    );
  }

  const handleCityClick = (city: CityAQIData) => {
    router.push(`/city/${city.cityId}`);
  };

  return (
    <div className="w-full h-[calc(100vh-80px)] flex flex-col p-4 md:p-6 pb-0 overflow-hidden">
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between px-2 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">National Air Quality Heatmap</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">Real-time geospatial distribution of AQI readings across India.</p>
          <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
            <span className="flex h-2 w-2 rounded-full bg-blue-500"></span>
            Tip: Scroll or pinch to zoom in and view the map more closely.
          </div>
        </div>
      </div>

      <div className="flex-grow w-full relative pb-6 min-h-0">
        <IndiaHeatMap 
          cities={cities} 
          onCityClick={handleCityClick} 
          hideTitle={true}
        />
      </div>
    </div>
  );
}
