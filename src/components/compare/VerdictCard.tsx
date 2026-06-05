// ============================================================
// FILE: src/components/compare/VerdictCard.tsx
// PURPOSE: Card displaying the human-readable comparison verdict
// DEPENDS ON: None
// ============================================================

'use client';

import { motion } from 'framer-motion';
import Card from '@/components/ui/Card';

interface VerdictCardProps {
  verdict: string;
}

/**
 * Highlights the key takeaway from a city comparison in
 * plain, actionable language for citizens and officers.
 */
export default function VerdictCard({ verdict }: VerdictCardProps) {
  if (!verdict) return null;

  return (
    <motion.section
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <Card 
        padding="lg" 
        className="relative overflow-hidden border border-white/50 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-pink-500/10 backdrop-blur-2xl text-center shadow-[0_8px_30px_rgb(0,0,0,0.06)]"
      >
        <motion.div
          animate={{ x: ['-100%', '300%'] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', repeatDelay: 1.5 }}
          className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-white/50 to-transparent w-[150%]"
        />
        <p className="relative z-10 text-sm font-bold uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
          Verdict
        </p>
        <p className="relative z-10 mt-3 text-lg font-medium leading-relaxed text-slate-800 md:text-xl">
          {verdict}
        </p>
      </Card>
    </motion.section>
  );
}