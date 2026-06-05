// ============================================================
// FILE: src/components/charts/PriorityMatrix.tsx
// PURPOSE: Quadrant scatter chart mapping intervention impact vs feasibility
// DEPENDS ON: src/lib/types.ts, src/lib/constants.ts
// ============================================================

'use client';

import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  ReferenceLine,
  Cell,
} from 'recharts';
import { motion } from 'framer-motion';
import type { InterventionItem } from '@/lib/types';
import { POLLUTANT_LABELS } from '@/lib/constants';

interface PriorityMatrixProps {
  interventions: InterventionItem[];
  title?: string;
}

/** Maps impact/feasibility strings to numeric values for the chart */
const levelToNumber: Record<string, number> = {
  Low: 1,
  Medium: 2,
  High: 3,
};

/** Color based on quadrant (High Impact + High Feasibility = Green) */
function getQuadrantColor(impact: number, feasibility: number): string {
  if (impact >= 2 && feasibility >= 2) return '#10B981'; // Do first
  if (impact >= 2 && feasibility < 2) return '#F59E0B'; // Strategic
  if (impact < 2 && feasibility >= 2) return '#0EA5E9'; // Quick wins
  return '#94A3B8'; // Deprioritize
}

/**
 * Scatter plot mapping interventions by Impact (Y) vs Feasibility (X).
 * Quadrants are delineated by reference lines, helping officers
 * prioritize pollution control measures.
 */
export default function PriorityMatrix({ interventions, title = 'Intervention Priority Matrix' }: PriorityMatrixProps) {
  const data = interventions.map((item) => ({
    name: `${POLLUTANT_LABELS[item.pollutant] ?? item.pollutant} (-${item.reductionTarget}%)`,
    feasibility: levelToNumber[item.feasibility] ?? 1,
    impact: levelToNumber[item.impact] ?? 1,
    description: item.description,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="rounded-3xl border border-white/60 dark:border-white/5 bg-white/80 dark:bg-white/5 p-6 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)]"
    >
      <h3 className="mb-4 text-lg font-semibold text-slate-800 dark:text-zinc-100">{title}</h3>

      <ResponsiveContainer width="100%" height={300}>
        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
          <XAxis
            type="number"
            dataKey="feasibility"
            name="Feasibility"
            domain={[0, 4]}
            ticks={[1, 2, 3]}
            tickFormatter={(val: number) => ['', 'Low', 'Medium', 'High'][val] ?? ''}
            tick={{ fill: '#64748B', fontSize: 12 }}
            axisLine={{ stroke: '#CBD5E1' }}
            label={{ value: 'Feasibility', position: 'bottom', fill: '#64748B', fontSize: 12 }}
          />
          <YAxis
            type="number"
            dataKey="impact"
            name="Impact"
            domain={[0, 4]}
            ticks={[1, 2, 3]}
            tickFormatter={(val: number) => ['', 'Low', 'Medium', 'High'][val] ?? ''}
            tick={{ fill: '#64748B', fontSize: 12 }}
            axisLine={{ stroke: '#CBD5E1' }}
            label={{ value: 'Impact', angle: -90, position: 'insideLeft', fill: '#64748B', fontSize: 12 }}
          />
          <ReferenceLine x={2} stroke="#CBD5E1" strokeDasharray="5 5" />
          <ReferenceLine y={2} stroke="#CBD5E1" strokeDasharray="5 5" />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--tooltip-bg, #FFFFFF)',
              border: '1px solid var(--tooltip-border, #E2E8F0)',
              borderRadius: '8px',
              color: 'var(--tooltip-text, #0F172A)',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            }}
            formatter={(_: number, name: string, props: any) => [
              props.payload?.description,
              props.payload?.name,
            ]}
          />
          <Scatter name="Interventions" data={data} fill="#8884d8">
            {data.map((entry, index) => (
              <Cell
                key={index}
                fill={getQuadrantColor(entry.impact, entry.feasibility)}
                stroke="#FFFFFF"
                strokeWidth={1.5}
              />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
      
      <div className="mt-4 flex flex-wrap justify-center gap-4 text-xs font-medium text-slate-600 dark:text-zinc-400">
        <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full" style={{ backgroundColor: '#10B981' }} /> Do First</span>
        <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full" style={{ backgroundColor: '#F59E0B' }} /> Strategic</span>
        <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full" style={{ backgroundColor: '#0EA5E9' }} /> Quick Wins</span>
        <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full" style={{ backgroundColor: '#94A3B8' }} /> Deprioritize</span>
      </div>
    </motion.div>
  );
}