// ============================================================
// FILE: src/components/city/AQIHeroCard.tsx
// PURPOSE: Hero card for city deep dive showing AQI and health advisory
// DEPENDS ON: src/lib/types.ts, src/components/ui/Card.tsx, src/components/ui/Gauge.tsx
// ============================================================

'use client';

import { motion } from 'framer-motion';
import type { CityAQIData } from '@/lib/types';
import { useAQICategory } from '@/hooks/useAQICategory';
import Card from '@/components/ui/Card';
import Gauge from '@/components/ui/Gauge';
import Badge from '@/components/ui/Badge';
import { Leaf, Wind, Sun, AlertTriangle, AlertCircle, Siren } from 'lucide-react';

const IconMap: Record<string, React.ReactNode> = {
  Leaf: <Leaf size={16} className="inline mr-1" />,
  Wind: <Wind size={16} className="inline mr-1" />,
  Sun: <Sun size={16} className="inline mr-1" />,
  AlertTriangle: <AlertTriangle size={16} className="inline mr-1" />,
  AlertCircle: <AlertCircle size={16} className="inline mr-1" />,
  Siren: <Siren size={16} className="inline mr-1" />
};

interface AQIHeroCardProps {
  city: CityAQIData;
}

/**
 * Top-level hero card on the city deep dive page.
 * Combines an animated AQI gauge, category badge, and health advisory text.
 */
export default function AQIHeroCard({ city }: AQIHeroCardProps) {
  const { advisory } = useAQICategory(city.aqiValue);

  return (
    <Card padding="lg" className="flex flex-col items-center gap-6 md:flex-row md:items-start md:gap-10">
      <div className="flex-shrink-0">
        <Gauge 
          value={city.aqiValue} 
          size={240} 
          title="Air Quality"
          subtitle={`Last Updated ${new Date(city.lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
          location={`${city.cityName}, IN`}
          showLegend={true}
          className="rounded-[24px] bg-white/50 p-6 shadow-sm"
        />
      </div>
      
      <motion.div 
        className="flex flex-1 flex-col gap-4 text-center md:text-left"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            {city.cityName}
          </h1>
          <p className="mt-1 text-sm font-medium text-slate-500">{city.state}, India</p>
        </div>

        <div className="flex items-center justify-center gap-3 md:justify-start">
          <span className="text-6xl font-extrabold tracking-tighter" style={{ color: advisory.icon === 'Siren' ? '#DC2626' : '#0F172A' }}>
            {city.aqiValue}
          </span>
          <Badge category={city.aqiCategory} size="md" />
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
          <p className="flex items-center text-sm font-semibold text-slate-800">
            {IconMap[advisory.icon]} Health Advisory
          </p>
          <p className="mt-1.5 text-sm font-medium text-slate-600">{advisory.longText}</p>
        </div>

        <p className="text-xs text-slate-500">
          Last updated: {new Date(city.lastUpdated).toLocaleString()}
        </p>
      </motion.div>
    </Card>
  );
}