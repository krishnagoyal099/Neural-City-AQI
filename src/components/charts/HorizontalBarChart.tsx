// ============================================================
// FILE: src/components/charts/HorizontalBarChart.tsx
// PURPOSE: Horizontal bar chart for top cleanest/most polluted cities
// DEPENDS ON: src/lib/types.ts
// ============================================================

'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Cell,
} from 'recharts';
import { motion } from 'framer-motion';
import type { CityAQIData } from '@/lib/types';
import { getAQIColor } from '@/lib/category-utils';
import { AQI_COLORS } from '@/lib/constants';

interface HorizontalBarChartProps {
  cities: CityAQIData[];
  title: string;
  ascending?: boolean;
}

const CATEGORY_GRADIENTS = [
  { id: 'grad-good', start: AQI_COLORS.good, end: '#34D399' },
  { id: 'grad-satisfactory', start: AQI_COLORS.satisfactory, end: '#A3E635' },
  { id: 'grad-moderate', start: AQI_COLORS.moderate, end: '#FBBF24' },
  { id: 'grad-poor', start: AQI_COLORS.poor, end: '#FB923C' },
  { id: 'grad-veryPoor', start: AQI_COLORS.veryPoor, end: '#F87171' },
  { id: 'grad-severe', start: AQI_COLORS.severe, end: '#DC2626' },
];

function getGradientId(aqi: number) {
  if (aqi <= 50) return 'grad-good';
  if (aqi <= 100) return 'grad-satisfactory';
  if (aqi <= 200) return 'grad-moderate';
  if (aqi <= 300) return 'grad-poor';
  if (aqi <= 400) return 'grad-veryPoor';
  return 'grad-severe';
}

/**
 * Horizontal bar chart displaying city AQI values.
 * Bars are colored by their AQI category.
 * Set ascending=true for cleanest cities (lowest AQI first).
 */
export default function HorizontalBarChart({
  cities,
  title,
  ascending = true,
}: HorizontalBarChartProps) {
  const sorted = [...cities].sort((a, b) =>
    ascending ? a.aqiValue - b.aqiValue : b.aqiValue - a.aqiValue
  );

  const data = sorted.map((city) => ({
    name: city.cityName,
    aqi: city.aqiValue,
    color: getAQIColor(city.aqiValue),
    gradId: getGradientId(city.aqiValue),
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="rounded-3xl border border-white/60 bg-white/80 p-6 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
    >
      <h3 className="mb-4 text-lg font-semibold text-slate-800">{title}</h3>

      {data.length === 0 ? (
        <div className="flex h-48 items-center justify-center text-slate-500">
          No data available
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data} layout="vertical" margin={{ left: 20, right: 20 }}>
            <XAxis
              type="number"
              domain={[0, 500]}
              tick={{ fill: '#64748B', fontSize: 12 }}
              axisLine={{ stroke: '#CBD5E1' }}
            />
            <YAxis
              type="category"
              dataKey="name"
              width={80}
              tick={{ fill: '#0F172A', fontSize: 13, fontWeight: 500 }}
              axisLine={{ stroke: '#CBD5E1' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: '8px',
                color: '#0F172A',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              }}
              formatter={(value: number) => [`AQI ${value}`, 'Air Quality']}
            />
            <defs>
              {CATEGORY_GRADIENTS.map((g) => (
                <linearGradient key={g.id} id={g.id} x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor={g.start} />
                  <stop offset="100%" stopColor={g.end} />
                </linearGradient>
              ))}
            </defs>
            <Bar dataKey="aqi" radius={10} barSize={20} style={{ filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.1))' }}>
              {data.map((entry, index) => (
                <Cell key={index} fill={`url(#${entry.gradId})`} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </motion.div>
  );
}