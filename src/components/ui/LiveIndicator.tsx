'use client';

import { Radio } from 'lucide-react';

interface LiveIndicatorProps {
  isLive: boolean;
  fetchedAt?: string;
}

/**
 * Pulsing indicator badge shown in the dashboard header.
 * Displays "LIVE" with a green pulse when real-time data is active,
 * or a subtle "CACHED" label when falling back to static data.
 */
export default function LiveIndicator({ isLive, fetchedAt }: LiveIndicatorProps) {
  const timeLabel = fetchedAt
    ? new Date(fetchedAt).toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      })
    : null;

  if (!isLive) {
    return (
      <div className="flex items-center gap-1.5 rounded-full bg-slate-100 dark:bg-white/10 px-3 py-1">
        <div className="w-2 h-2 rounded-full bg-slate-400 dark:bg-zinc-500" />
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-zinc-400">
          Cached
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 rounded-full bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/50 px-3 py-1">
      {/* Pulsing dot */}
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
      </span>
      <Radio size={11} className="text-emerald-600 dark:text-emerald-400" />
      <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
        Live
      </span>
      {timeLabel && (
        <span className="text-[10px] text-emerald-500 dark:text-emerald-500/80 font-medium">
          · {timeLabel}
        </span>
      )}
    </div>
  );
}
