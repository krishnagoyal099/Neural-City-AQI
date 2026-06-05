// ============================================================
// FILE: src/components/charts/TrendLineChart.tsx
// PURPOSE: Line chart showing a city's 12-month AQI trend
// DEPENDS ON: src/lib/types.ts
// ============================================================

'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { motion } from 'framer-motion';
import type { MonthlyAQIPoint } from '@/lib/types';

interface TrendLineChartProps {
  data: MonthlyAQIPoint[];
  title?: string;
}

/**
 * Line chart displaying a 12-month AQI trend.
 */
export default function TrendLineChart({
  data,
  title = '12-Month AQI Trend',
}: TrendLineChartProps) {
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
        <LineChart data={data} margin={{ top: 10, right: 20, bottom: 5, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
          <XAxis
            dataKey="month"
            tick={{ fill: '#64748B', fontSize: 12 }}
            axisLine={{ stroke: '#CBD5E1' }}
          />
          <YAxis
            domain={[0, 500]}
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
          <Line
            type="monotone"
            dataKey="aqiValue"
            stroke="#0EA5E9"
            strokeWidth={3}
            dot={{ fill: '#0EA5E9', r: 4, strokeWidth: 2, stroke: '#FFFFFF' }}
            activeDot={{ r: 6, strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
}