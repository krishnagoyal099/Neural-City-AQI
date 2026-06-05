// ============================================================
// FILE: src/components/ui/Skeleton.tsx
// PURPOSE: Loading skeleton placeholder matching final layout
// DEPENDS ON: None
// ============================================================

/**
 * Animated skeleton placeholder for loading states.
 * Uses pulse animation — no spinners.
 */
export default function Skeleton({
  className = '',
  width,
  height,
}: {
  className?: string;
  width?: string;
  height?: string;
}) {
  return (
    <div
      className={`animate-pulse rounded-3xl bg-slate-200/60 dark:bg-white/5 ${className}`}
      style={{ width, height }}
      aria-hidden="true"
    />
  );
}