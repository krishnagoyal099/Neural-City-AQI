// ============================================================
// FILE: src/components/charts/ComparisonGroupedBar.tsx
// PURPOSE: Grouped bar chart for comparing pollutants between two cities
// DEPENDS ON: src/lib/types.ts, src/lib/constants.ts
// ============================================================

'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import { motion } from 'framer-motion';
import type { PollutantData } from '@/lib/types';
import { POLLUTANT_LABELS } from '@/lib/constants';

interface ComparisonGroupedBarProps {
  cityAName: string;
  cityBName: string;
  pollutantsA: PollutantData;
  pollutantsB: PollutantData;
  title?: string;
}

/** Build data array from two pollutant sets */
function buildComparisonData(
  pollutantsA: PollutantData,
  pollutantsB: PollutantData
): Array<{ name: string; cityA: number; cityB: number }> {
  return Object.entries(pollutantsA).map(([key, val]) => ({
    name: POLLUTANT_LABELS[key] ?? key,
    cityA: Math.round(val * 10) / 10,
    cityB: Math.round(pollutantsB[key as keyof PollutantData] * 10) / 10,
  }));
}

/**
 * Grouped bar chart comparing pollutant concentrations
 * between two cities side by side.
 */
export default function ComparisonGroupedBar({
  cityAName,
  cityBName,
  pollutantsA,
  pollutantsB,
  title = 'Pollutant Comparison',
}: ComparisonGroupedBarProps) {
  const data = buildComparisonData(pollutantsA, pollutantsB);

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
        <BarChart data={data} margin={{ top: 10, right: 20, bottom: 5, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
          <XAxis
            dataKey="name"
            tick={{ fill: '#64748B', fontSize: 12 }}
            axisLine={{ stroke: '#CBD5E1' }}
          />
          <YAxis
            tick={{ fill: '#64748B', fontSize: 12 }}
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
          />
          <Legend
            formatter={(value: string) => (
              <span className="text-sm font-medium text-slate-600">
                {value === 'cityA' ? cityAName : cityBName}
              </span>
            )}
          />
          <Bar dataKey="cityA" fill="#0EA5E9" radius={[4, 4, 0, 0]} barSize={24} />
          <Bar dataKey="cityB" fill="#F59E0B" radius={[4, 4, 0, 0]} barSize={24} />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}