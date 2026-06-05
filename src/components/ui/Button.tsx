// ============================================================
// FILE: src/components/ui/Button.tsx
// PURPOSE: Reusable button primitive with variants and animations
// DEPENDS ON: None
// ============================================================

'use client';

import { type ReactNode } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';

/** Button visual variants */
type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
  icon?: ReactNode;
}

/** Maps variant to Tailwind classes */
const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-cyan-500 hover:bg-cyan-400 text-white border-cyan-500',
  secondary: 'bg-slate-700 hover:bg-slate-600 text-slate-100 border-slate-600',
  ghost: 'bg-transparent hover:bg-slate-800 text-slate-300 border-transparent',
  danger: 'bg-red-600 hover:bg-red-500 text-white border-red-600',
};

/** Maps size to Tailwind classes */
const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3 text-base',
};

/**
 * Animated button component with variant and size props.
 * Uses Framer Motion for hover/tap micro-interactions.
 */
export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  icon,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  return (
    <motion.button
      whileHover={disabled ? undefined : { scale: 1.02, filter: 'brightness(1.1)' }}
      whileTap={disabled ? undefined : { scale: 0.98 }}
      transition={{ duration: 0.15 }}
      className={`
        inline-flex items-center justify-center gap-2 rounded-lg border font-medium
        transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </motion.button>
  );
}