// ============================================================
// FILE: src/components/ui/MetricCard.tsx
// PURPOSE: Single metric display card with icon, value, and trend
// DEPENDS ON: src/lib/types.ts
// ============================================================

'use client';

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { MetricCardProps } from '@/lib/types';

/**
 * Displays a key metric (number/stat) with label, optional icon,
 * subtitle, and trend indicator. Animates on scroll into view.
 */
export default function MetricCard({
  label,
  value,
  subtitle,
  icon,
  trend,
  color = '#06B6D4',
}: MetricCardProps) {
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor =
    trend === 'up' ? '#059669' : trend === 'down' ? '#DC2626' : '#94A3B8';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -4 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex flex-col justify-center h-full rounded-3xl border-x-2 border-y-0 border-slate-200/80 dark:border-white/5 bg-white/70 dark:bg-white/5 p-5 backdrop-blur-2xl shadow-[0_8px_30px_rgb(0,0,0,0.05)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] transition-all hover:shadow-[0_16px_40px_rgb(0,0,0,0.08)] dark:hover:shadow-[0_16px_40px_rgb(0,0,0,0.5)] hover:bg-white/90 dark:hover:bg-white/10"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-semibold text-slate-500 dark:text-zinc-400 leading-tight">
            {label}
          </p>
          {subtitle && (
            <p className="mt-0.5 text-xs font-medium text-slate-500 dark:text-zinc-500">{subtitle}</p>
          )}
          <p className="mt-4 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            {value}
          </p>
        </div>
        {icon && (
          <div
            className="flex h-12 w-12 items-center justify-center rounded-2xl text-xl backdrop-blur-sm"
            style={{ 
              background: `linear-gradient(135deg, ${color}25, ${color}05)`, 
              color,
              boxShadow: `0 4px 12px ${color}20, inset 0 1px 0 ${color}30`,
              border: `1px solid ${color}20`
            }}
          >
            {icon}
          </div>
        )}
      </div>
      {trend && (
        <div className="mt-4">
          <div className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold" style={{ backgroundColor: `${trendColor}15`, color: trendColor }}>
            <TrendIcon size={14} className="stroke-[3]" />
            <span>{trend === 'up' ? 'Increasing' : trend === 'down' ? 'Decreasing' : 'Stable'}</span>
          </div>
        </div>
      )}
    </motion.div>
  );
}