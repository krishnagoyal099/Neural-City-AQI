// ============================================================
// FILE: src/components/charts/AQIDonutChart.tsx
// PURPOSE: Donut chart showing distribution of cities across AQI categories
// DEPENDS ON: src/lib/types.ts, src/lib/constants.ts
// ============================================================

'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import Card from '@/components/ui/Card';
import type { CategoryDistribution } from '@/lib/types';
import { AQI_COLORS } from '@/lib/constants';

interface AQIDonutChartProps {
  distribution: CategoryDistribution;
  title?: string;
}

/** Map categories to their linear gradient colors for the chart */
const CATEGORY_GRADIENTS: Record<string, [string, string]> = {
  Good: [AQI_COLORS.good, '#34D399'],
  Satisfactory: [AQI_COLORS.satisfactory, '#A3E635'],
  Moderate: [AQI_COLORS.moderate, '#FBBF24'],
  Poor: [AQI_COLORS.poor, '#FB923C'],
  'Very Poor': [AQI_COLORS.veryPoor, '#F87171'],
  Severe: [AQI_COLORS.severe, '#DC2626'],
};

/**
 * Donut chart visualizing how many cities fall into each AQI category.
 * Excludes categories with zero cities for a cleaner display.
 */
export default function AQIDonutChart({ distribution, title = 'AQI Category Distribution' }: AQIDonutChartProps) {
  const data = Object.entries(distribution)
    .filter(([, value]) => value > 0)
    .map(([name, value]) => ({
      name,
      value,
    }));

  return (
    <Card padding="md" className="flex flex-col h-full">
      <h3 className="mb-4 text-sm font-bold text-slate-800 dark:text-zinc-100">{title}</h3>

      {data.length === 0 ? (
        <div className="flex h-48 items-center justify-center text-slate-500 dark:text-zinc-400">
          No data available
        </div>
      ) : (
        <div className="flex flex-col flex-grow items-center justify-center">
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <defs>
                {Object.entries(CATEGORY_GRADIENTS).map(([key, colors]) => (
                  <linearGradient key={key} id={`grad-${key.replace(/\s+/g, '')}`} x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor={colors[0]} />
                    <stop offset="100%" stopColor={colors[1]} />
                  </linearGradient>
                ))}
              </defs>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
                stroke="transparent"
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={`url(#grad-${entry.name.replace(/\s+/g, '')})`} 
                  />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'var(--tooltip-bg, #FFFFFF)',
                  border: '1px solid var(--tooltip-border, #E2E8F0)',
                  borderRadius: '8px',
                  color: 'var(--tooltip-text, #0F172A)',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                }}
                formatter={(value: number, name: string) => [`${value} cities`, name]}
                cursor={{ fill: 'transparent' }}
              />
            </PieChart>
          </ResponsiveContainer>
          
          {/* Custom Vertical Legend List */}
          <div className="w-full mt-2 px-2 flex flex-col gap-2.5">
            {data.map((entry) => {
              const colors = CATEGORY_GRADIENTS[entry.name] || ['#CBD5E1', '#94A3B8'];
              return (
                <div key={entry.name} className="flex items-center justify-between px-3 py-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-2.5">
                    <div 
                      className="w-3 h-3 rounded-full shadow-sm" 
                      style={{ background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})` }} 
                    />
                    <span className="text-sm font-semibold text-slate-700 dark:text-zinc-300">{entry.name}</span>
                  </div>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">{entry.value}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </Card>
  );
}