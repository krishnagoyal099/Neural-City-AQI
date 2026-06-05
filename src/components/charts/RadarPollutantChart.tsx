// ============================================================
// FILE: src/components/charts/RadarPollutantChart.tsx
// PURPOSE: Radar chart showing pollutant concentration breakdown
// DEPENDS ON: src/lib/types.ts, src/lib/constants.ts
// ============================================================

'use client';

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { motion } from 'framer-motion';
import type { PollutantData } from '@/lib/types';
import { POLLUTANT_LABELS } from '@/lib/constants';

interface RadarPollutantChartProps {
  pollutants: PollutantData;
  cityNames?: [string, string];
  secondPollutants?: PollutantData;
  title?: string;
}

/** Normalize pollutant values to 0-100 scale for radar chart */
function normalizePollutants(pollutants: PollutantData): Array<{ pollutant: string; value: number }> {
  const maxValues: Record<string, number> = {
    pm25: 250, pm10: 430, no2: 280, so2: 380, co: 46, o3: 380, nh3: 1800,
  };

  return Object.entries(pollutants).map(([key, val]) => ({
    pollutant: POLLUTANT_LABELS[key] ?? key,
    value: Math.round((val / (maxValues[key] || 1)) * 100),
  }));
}

/**
 * Radar chart visualizing pollutant concentrations normalized to 0-100.
 * Supports overlaying a second city for comparison.
 */
export default function RadarPollutantChart({
  pollutants,
  cityNames,
  secondPollutants,
  title = 'Pollutant Breakdown',
}: RadarPollutantChartProps) {
  const primaryData = normalizePollutants(pollutants);

  /** Merge second city data into the same array if provided */
  const data = secondPollutants
    ? primaryData.map((item, idx) => {
        const secondary = normalizePollutants(secondPollutants);
        return {
          ...item,
          valueB: secondary[idx]?.value ?? 0,
        };
      })
    : primaryData;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="rounded-3xl border border-white/60 bg-white/80 p-6 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
    >
      <h3 className="mb-4 text-lg font-semibold text-slate-800">{title}</h3>

      <ResponsiveContainer width="100%" height={300}>
        <RadarChart data={data} cx="50%" cy="50%" outerRadius="70%">
          <PolarGrid stroke="#E2E8F0" />
          <PolarAngleAxis
            dataKey="pollutant"
            tick={{ fill: '#64748B', fontSize: 12 }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{ fill: '#64748B', fontSize: 10 }}
          />
          <Radar
            name={cityNames?.[0] ?? 'City A'}
            dataKey="value"
            stroke="#0EA5E9"
            fill="#0EA5E9"
            fillOpacity={0.3}
          />
          {secondPollutants && (
            <Radar
              name={cityNames?.[1] ?? 'City B'}
              dataKey="valueB"
              stroke="#F59E0B"
              fill="#F59E0B"
              fillOpacity={0.2}
            />
          )}
          <Tooltip
            contentStyle={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '8px',
              color: '#0F172A',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}