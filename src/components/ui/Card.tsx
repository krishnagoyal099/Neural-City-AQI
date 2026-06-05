// ============================================================
// FILE: src/components/ui/Card.tsx
// PURPOSE: Reusable card container with hover glow effect
// DEPENDS ON: None
// ============================================================

'use client';

import { type ReactNode } from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const paddingClasses = {
  none: '',
  sm: 'p-3',
  md: 'p-5',
  lg: 'p-6',
};

/**
 * Card container with consistent dark theme styling.
 * Optional hover glow effect for interactive cards.
 */
export default function Card({
  children,
  className = '',
  hoverable = false,
  padding = 'md',
}: CardProps) {
  return (
    <motion.div
      whileHover={
        hoverable
          ? { boxShadow: '0 20px 40px -10px rgba(0,0,0,0.08)', y: -2 }
          : undefined
      }
      transition={{ duration: 0.2 }}
      className={`
        rounded-3xl border-x-2 border-y-0 border-slate-200/80 dark:border-white/5 bg-white/70 dark:bg-white/5 backdrop-blur-2xl shadow-[0_8px_30px_rgb(0,0,0,0.05)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)]
        ${hoverable ? 'cursor-pointer transition-all hover:shadow-[0_16px_40px_rgb(0,0,0,0.08)] dark:hover:shadow-[0_16px_40px_rgb(0,0,0,0.5)] hover:bg-white/90 dark:hover:bg-white/10' : ''}
        ${paddingClasses[padding]}
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
}