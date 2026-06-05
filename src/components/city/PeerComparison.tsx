// ============================================================
// FILE: src/components/city/PeerComparison.tsx
// PURPOSE: Bar chart comparing city's AQI against its peer cities
// DEPENDS ON: src/lib/types.ts, src/components/charts/HorizontalBarChart.tsx
// ============================================================

'use client';

import type { CityAQIData } from '@/lib/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Cell } from 'recharts';
import { getAQIColor } from '@/lib/category-utils';
import Card from '@/components/ui/Card';

interface PeerComparisonProps {
  city: CityAQIData;
  peers: CityAQIData[];
}

/**
 * Bar chart comparing the selected city's AQI against its peer cities
 * and the national average, with AQI-category-colored bars.
 */
export default function PeerComparison({ city, peers }: PeerComparisonProps) {
  /** Include the city itself and its peers, sorted by AQI */
  const data = [city, ...peers]
    .sort((a, b) => a.aqiValue - b.aqiValue)
    .map((c) => ({
      name: c.cityName,
      aqi: c.aqiValue,
      color: getAQIColor(c.aqiValue),
      isCurrent: c.cityId === city.cityId,
    }));

  return (
    <Card padding="md">
      <h3 className="mb-4 text-lg font-semibold text-slate-800">Peer City Comparison</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
          <XAxis dataKey="name" tick={{ fill: '#64748B', fontSize: 12 }} axisLine={{ stroke: '#CBD5E1' }} />
          <YAxis domain={[0, 500]} tick={{ fill: '#64748B', fontSize: 12 }} axisLine={{ stroke: '#CBD5E1' }} />
          <Tooltip
            contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', color: '#0F172A', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            formatter={(value: number) => [`AQI ${value}`, 'Air Quality']}
          />
          <Bar dataKey="aqi" radius={[6, 6, 0, 0]} barSize={32}>
            {data.map((entry, index) => (
              <Cell
                key={index}
                fill={entry.color}
                stroke={entry.isCurrent ? '#0F172A' : 'none'}
                strokeWidth={entry.isCurrent ? 2 : 0}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}