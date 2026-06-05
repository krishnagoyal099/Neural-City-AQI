// ============================================================
// FILE: src/components/charts/SeasonalAreaChart.tsx
// PURPOSE: Stacked area chart showing national seasonal AQI trends
// DEPENDS ON: src/lib/types.ts, src/lib/constants.ts
// ============================================================

'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import { motion } from 'framer-motion';
import type { SeasonalDataPoint } from '@/lib/types';

interface SeasonalAreaChartProps {
  data: SeasonalDataPoint[];
  title?: string;
}

/**
 * Stacked area chart visualizing the count of cities in Good, Moderate,
 * and Poor AQI categories over 12 months, along with the national average line.
 */
export default function SeasonalAreaChart({ data, title = 'National Seasonal Trend' }: SeasonalAreaChartProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="rounded-3xl border-x-2 border-y-0 border-slate-200/80 dark:border-white/5 bg-white/70 dark:bg-white/5 p-6 backdrop-blur-2xl shadow-[0_8px_30px_rgb(0,0,0,0.05)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] h-full"
    >
      <h3 className="mb-4 text-lg font-semibold text-slate-800 dark:text-zinc-100">{title}</h3>

      {data.length === 0 ? (
        <div className="flex h-48 items-center justify-center text-slate-500">
          No seasonal data available
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data} margin={{ top: 10, right: 20, bottom: 5, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis
              dataKey="month"
              tick={{ fill: '#64748B', fontSize: 12 }}
              axisLine={{ stroke: '#CBD5E1' }}
            />
            <YAxis
              tick={{ fill: '#64748B', fontSize: 12 }}
              axisLine={{ stroke: '#CBD5E1' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--tooltip-bg, #FFFFFF)',
                border: '1px solid var(--tooltip-border, #E2E8F0)',
                borderRadius: '8px',
                color: 'var(--tooltip-text, #0F172A)',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              }}
            />
            <Legend formatter={(value: string) => <span className="text-sm font-medium text-slate-600 dark:text-zinc-400">{value}</span>} />
            <Area type="monotone" dataKey="poorCount" name="Poor/Severe Cities" stackId="1" stroke="#F97316" fill="#F97316" fillOpacity={0.4} />
            <Area type="monotone" dataKey="moderateCount" name="Moderate Cities" stackId="1" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.4} />
            <Area type="monotone" dataKey="goodCount" name="Clean Cities" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.4} />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </motion.div>
  );
}