// ============================================================
// FILE: src/components/dashboard/HeroSection.tsx
// PURPOSE: Landing page hero with animated national gauge and search
// DEPENDS ON: src/components/ui/Gauge.tsx, src/components/ui/SearchBar.tsx
// ============================================================

'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import type { CityAQIData } from '@/lib/types';
import Gauge from '@/components/ui/Gauge';
import Card from '@/components/ui/Card';
import SearchBar from '@/components/ui/SearchBar';

interface HeroSectionProps {
  nationalAverageAQI: number;
  cities: CityAQIData[];
  advisoryText: string;
}

/**
 * Hero section for the overview dashboard featuring the national average
 * AQI gauge, a health advisory, and a city search bar.
 */
export default function HeroSection({ nationalAverageAQI, cities, advisoryText }: HeroSectionProps) {
  const router = useRouter();

  const handleCitySelect = (city: CityAQIData) => {
    router.push(`/city/${city.cityId}`);
  };

  return (
    <Card padding="sm" className="w-full flex flex-col justify-center items-center">
      <Gauge 
        value={nationalAverageAQI} 
        size={220} 
        title="National Average"
        subtitle={`Last Updated ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
        location="India"
        showLegend={true}
        className="w-full p-4"
      />
      <SearchBar cities={cities} onSelectAction={handleCitySelect} />
    </Card>
  );
}