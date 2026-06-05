// ============================================================
// FILE: src/components/ui/Badge.tsx
// PURPOSE: Inline badge for AQI category display
// DEPENDS ON: src/lib/category-utils.ts
// ============================================================

import type { AQICategory } from '@/lib/types';
import { getCategoryColor } from '@/lib/category-utils';

interface BadgeProps {
  category: AQICategory;
  size?: 'sm' | 'md';
}

/**
 * Color-coded badge displaying an AQI category label.
 * Background uses the category color with opacity for readability.
 */
export default function Badge({ category, size = 'md' }: BadgeProps) {
  const color = getCategoryColor(category);

  const sizeClasses = size === 'sm'
    ? 'px-2 py-0.5 text-xs'
    : 'px-3 py-1 text-sm';

  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold ${sizeClasses}`}
      style={{
        backgroundColor: `${color}20`,
        color: color,
        border: `1px solid ${color}40`,
      }}
    >
      {category}
    </span>
  );
}