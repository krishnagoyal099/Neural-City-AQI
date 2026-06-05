// ============================================================
// FILE: src/components/city/HealthScoreCard.tsx
// PURPOSE: Individual pollutant health score breakdown (0-100)
// DEPENDS ON: src/lib/types.ts, src/lib/aqi-calculator.ts
// ============================================================

'use client';

import { motion } from 'framer-motion';
import type { PollutantData } from '@/lib/types';
import { pollutantHealthScore } from '@/lib/aqi-calculator';
import { POLLUTANT_LABELS } from '@/lib/constants';
import Card from '@/components/ui/Card';

interface HealthScoreCardProps {
  pollutants: PollutantData;
}

/**
 * Grid of health score bars for each pollutant.
 * Translates raw concentrations into an intuitive 0-100 score.
 */
export default function HealthScoreCard({ pollutants }: HealthScoreCardProps) {
  const scores = Object.entries(pollutants).map(([key, value]) => ({
    key,
    label: POLLUTANT_LABELS[key] ?? key,
    score: pollutantHealthScore(key as keyof PollutantData, value),
    rawValue: value,
  }));

  return (
    <Card padding="md">
      <h3 className="mb-4 text-lg font-semibold text-slate-800">Air Health Score Breakdown</h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {scores.map((item, idx) => (
          <motion.div
            key={item.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="rounded-2xl border border-slate-100 bg-slate-50 p-4 shadow-sm"
          >
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold text-slate-700">{item.label}</span>
              <span className="font-bold text-slate-900">{item.score}/100</span>
            </div>
            <div className="mt-2.5 h-2 w-full rounded-full bg-slate-200">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${item.score}%` }}
                transition={{ duration: 1, delay: 0.5 + idx * 0.1 }}
                className="h-full rounded-full"
                style={{ backgroundColor: item.score > 70 ? '#10B981' : item.score > 40 ? '#F59E0B' : '#EF4444' }}
              />
            </div>
            <p className="mt-1 text-xs text-slate-500">Raw: {item.rawValue} µg/m³</p>
          </motion.div>
        ))}
      </div>
    </Card>
  );
}