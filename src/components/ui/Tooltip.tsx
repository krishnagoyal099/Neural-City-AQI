// ============================================================
// FILE: src/components/ui/Tooltip.tsx
// PURPOSE: Simple tooltip component for chart hover info
// DEPENDS ON: None
// ============================================================

'use client';

import { type ReactNode } from 'react';

interface TooltipProps {
  children: ReactNode;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

/**
 * Hover tooltip wrapping any child element.
 * Shows content string on hover with a small arrow.
 */
export default function Tooltip({ children, content, position = 'top' }: TooltipProps) {
  const positionClasses: Record<string, string> = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div className="group relative inline-flex">
      {children}
      <div
        role="tooltip"
        className={`pointer-events-none absolute z-50 whitespace-nowrap rounded-md bg-slate-900 px-3 py-1.5 text-xs text-slate-100 opacity-0 shadow-lg transition-opacity group-hover:opacity-100 ${positionClasses[position]}`}
      >
        {content}
      </div>
    </div>
  );
}