// ============================================================
// FILE: src/components/dashboard/KeyMetricsRow.tsx
// PURPOSE: Row of key metric cards for the overview dashboard
// DEPENDS ON: src/components/ui/MetricCard.tsx
// ============================================================

'use client';

import MetricCard from '@/components/ui/MetricCard';
import { Building2, Leaf, AlertTriangle, Map } from 'lucide-react';

interface KeyMetricsRowProps {
  totalCities: number;
  cleanCities: number;
  criticalCities: number;
  nationalAvgAQI: number;
}

/**
 * Displays a horizontal row of the four most important high-level metrics:
 * cities tracked, clean cities, critical cities, and national average AQI.
 */
export default function KeyMetricsRow({
  totalCities,
  cleanCities,
  criticalCities,
  nationalAvgAQI,
}: KeyMetricsRowProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 h-full">
      <MetricCard
        label="Cities Tracked"
        value={totalCities}
        subtitle="Active monitoring nodes"
        icon={<Building2 size={24} />}
        color="#0EA5E9"
        trend="up"
      />
      <MetricCard
        label="Clean Cities"
        value={cleanCities}
        subtitle="Good or Satisfactory"
        icon={<Leaf size={24} />}
        color="#10B981"
        trend="up"
      />
      <MetricCard
        label="Cities Critical"
        value={criticalCities}
        subtitle="Poor, Very Poor, or Severe"
        icon={<AlertTriangle size={24} />}
        color="#F97316"
        trend="down"
      />
      <MetricCard
        label="National Avg AQI"
        value={nationalAvgAQI}
        subtitle="Across all tracked cities"
        icon={<Map size={24} />}
        color="#F59E0B"
        trend="stable"
      />
    </div>
  );
}