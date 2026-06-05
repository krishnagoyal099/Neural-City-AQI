import { useEffect, useRef, useState } from 'react';
import type { GaugeProps } from '@/lib/types';
import { MAX_AQI, GAUGE_SPRING } from '@/lib/constants';
import { getAQICategory, getCategoryColor } from '@/lib/category-utils';

/**
 * Canvas-based semi-circular gauge for displaying AQI values.
 * Features a striped pattern background, smooth needle shadow, and spring animation.
 */
export default function Gauge({
  value,
  maxValue = MAX_AQI,
  size = 200,
  animated = true,
  label,
  showCategory = true,
  trendValue,
  trendLabel,
  trendDirection = 'down',
  title,
  subtitle,
  location,
  showLegend,
  className,
}: GaugeProps) {
  const [displayValue, setDisplayValue] = useState<number>(animated ? 0 : value);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Animation effect
  useEffect(() => {
    if (!animated) {
      setDisplayValue(value);
      return;
    }

    const stiffness = GAUGE_SPRING.stiffness / 100;
    const damping = GAUGE_SPRING.damping / 100;
    let velocity = 0;
    let current = 0;
    let animationId: number;

    const animate = () => {
      const force = (value - current) * stiffness;
      velocity = (velocity + force) * (1 - damping);
      current += velocity;

      setDisplayValue(Math.round(current));

      if (Math.abs(velocity) > 0.1 || Math.abs(value - current) > 0.5) {
        animationId = requestAnimationFrame(animate);
      } else {
        setDisplayValue(value);
      }
    };

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [value, animated]);

  // Drawing effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 2;
    const width = size;
    const height = size * 0.75;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const cx = width / 2;
    const cy = height * 0.65;
    const outerR = size * 0.38;
    const innerR = size * 0.26;
    const startAngle = Math.PI;
    const endAngle = Math.PI * 2;

    // Clear
    ctx.clearRect(0, 0, width, height);

    // Create diagonal stripe pattern (crisp with DPR)
    const pCanvas = document.createElement('canvas');
    pCanvas.width = 8 * dpr;
    pCanvas.height = 8 * dpr;
    const pCtx = pCanvas.getContext('2d');
    if (pCtx) {
      pCtx.scale(dpr, dpr);
      pCtx.strokeStyle = 'rgba(255,255,255,0.32)';
      pCtx.lineWidth = 1.5;
      pCtx.beginPath();
      // Middle line
      pCtx.moveTo(-2, 10);
      pCtx.lineTo(10, -2);
      // Top-left line to cover corners
      pCtx.moveTo(-2, 2);
      pCtx.lineTo(2, -2);
      // Bottom-right line to cover corners
      pCtx.moveTo(6, 10);
      pCtx.lineTo(10, 6);
      pCtx.stroke();
    }
    const stripePattern = ctx.createPattern(pCanvas, 'repeat');

    // Inner background arc
    ctx.beginPath();
    ctx.arc(cx, cy, innerR - 2, startAngle, endAngle, false);
    ctx.arc(cx, cy, innerR * 0.4, endAngle, startAngle, true);
    ctx.closePath();
    ctx.fillStyle = '#f5f0e6';
    ctx.fill();

    // Draw arc segment with gradient + stripes
    const drawArcSegment = (colorStart: string, colorEnd: string, a1: number, a2: number) => {
      const grad = ctx.createLinearGradient(
        cx + Math.cos(a1) * outerR, cy + Math.sin(a1) * outerR,
        cx + Math.cos(a2) * outerR, cy + Math.sin(a2) * outerR
      );
      grad.addColorStop(0, colorStart);
      grad.addColorStop(1, colorEnd);

      ctx.beginPath();
      ctx.arc(cx, cy, outerR, a1, a2, false);
      ctx.arc(cx, cy, innerR, a2, a1, true);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();

      if (stripePattern) {
        ctx.beginPath();
        ctx.arc(cx, cy, outerR, a1, a2, false);
        ctx.arc(cx, cy, innerR, a2, a1, true);
        ctx.closePath();
        ctx.fillStyle = stripePattern;
        ctx.fill();
      }
    };

    // AQI scale angles (Math.PI is left, Math.PI * 2 is right)
    const valToAngle = (v: number) => Math.PI + (Math.min(v, maxValue) / maxValue) * Math.PI;

    // We blend colors seamlessly across the specific AQI buckets
    // Good: 0-50, Satisfactory: 50-100, Moderate: 100-200, Poor: 200-300, Very Poor: 300-400, Severe: 400-500
    drawArcSegment('#10B981', '#84CC16', valToAngle(0), valToAngle(50));
    drawArcSegment('#84CC16', '#F59E0B', valToAngle(50), valToAngle(100));
    drawArcSegment('#F59E0B', '#F97316', valToAngle(100), valToAngle(200));
    drawArcSegment('#F97316', '#EF4444', valToAngle(200), valToAngle(300));
    drawArcSegment('#EF4444', '#B91C1C', valToAngle(300), valToAngle(400));
    drawArcSegment('#B91C1C', '#7F1D1D', valToAngle(400), valToAngle(500));

    // Tick labels
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#64748B';
    ctx.font = `600 ${Math.max(10, size * 0.05)}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;

    const ticks = [0, 50, 100, 200, 300, 400, 500];
    ticks.forEach((v) => {
      const angle = valToAngle(v);
      const tx = cx + Math.cos(angle) * (outerR + size * 0.07);
      const ty = cy + Math.sin(angle) * (outerR + size * 0.07);
      ctx.fillText(v.toString(), tx, ty);
    });

    // Needle
    const clampedVal = Math.min(Math.max(0, displayValue), maxValue);
    const needleAngle = valToAngle(clampedVal);
    const needleLen = outerR - size * 0.06;
    const nx = cx + Math.cos(needleAngle) * needleLen;
    const ny = cy + Math.sin(needleAngle) * needleLen;

    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.15)';
    ctx.shadowBlur = size * 0.04;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 4;

    ctx.beginPath();
    ctx.moveTo(cx, cy);
    const perpAngle = needleAngle + Math.PI / 2;
    const w = size * 0.025;
    ctx.lineTo(cx + Math.cos(perpAngle) * w, cy + Math.sin(perpAngle) * w);
    ctx.lineTo(nx, ny);
    ctx.lineTo(cx - Math.cos(perpAngle) * w, cy - Math.sin(perpAngle) * w);
    ctx.closePath();
    
    // Color needle based on AQI category to make it pop, or keep it dark
    const categoryColor = getCategoryColor(getAQICategory(displayValue));
    ctx.fillStyle = categoryColor; 
    ctx.fill();
    ctx.restore();

    // Center pivot
    ctx.beginPath();
    ctx.arc(cx, cy, size * 0.06, 0, Math.PI * 2);
    ctx.fillStyle = categoryColor;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(cx, cy, size * 0.025, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.fill();

    // Center text
    ctx.fillStyle = '#0F172A';
    ctx.font = `bold ${Math.max(16, size * 0.16)}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(displayValue.toString(), cx, cy + size * 0.16);

  }, [displayValue, size, maxValue]);

  const category = getAQICategory(value);
  const categoryColor = getCategoryColor(category);

  return (
    <div className={`flex flex-col ${className || ''}`}>
      {(title || subtitle || location) && (
        <div className="mb-2 text-left w-full">
          {title && <h3 className="text-[22px] font-bold text-[#1a1a1a] dark:text-white tracking-tight">{title}</h3>}
          {subtitle && <p className="text-[13px] text-[#999] dark:text-slate-400 mb-2 font-medium">{subtitle}</p>}
          {location && (
            <div className="flex items-center gap-1.5 text-[14px] font-bold text-[#1a1a1a] dark:text-slate-200 mb-4">
              <div className="relative h-4 w-4 shrink-0 rounded-full bg-[#1a1a1a] dark:bg-slate-300 rounded-br-none -rotate-45 flex items-center justify-center">
                <div className="h-1.5 w-1.5 rounded-full bg-white dark:bg-black absolute" />
              </div>
              <span>{location}</span>
            </div>
          )}
        </div>
      )}

      <div className="flex flex-col items-center">
        <div className="relative" style={{ width: size, height: size * 0.75 }}>
          <canvas
            ref={canvasRef}
            style={{ width: '100%', height: '100%' }}
          />
        {trendValue && (
          <div className="absolute top-2 right-0 text-center">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center mx-auto mb-1 ${trendDirection === 'up' ? 'bg-red-500' : 'bg-emerald-500'}`}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="white" style={{ transform: trendDirection === 'down' ? 'rotate(180deg)' : 'none' }}>
                <path d="M12 4l-8 8h5v8h6v-8h5z" />
              </svg>
            </div>
            <div className={`text-lg font-bold leading-tight ${trendDirection === 'up' ? 'text-red-500' : 'text-emerald-500'}`}>
              {trendDirection === 'up' ? '+' : '-'}{trendValue}
            </div>
            {trendLabel && (
              <div className={`text-xs font-medium ${trendDirection === 'up' ? 'text-red-500' : 'text-emerald-500'}`}>
                {trendLabel}
              </div>
            )}
          </div>
        )}
        </div>
      </div>

      {label && (
        <div className="mt-2 text-center text-sm font-semibold text-slate-800 dark:text-zinc-200">
          {label}
        </div>
      )}
      {showCategory && category && !showLegend && (
        <div
          className="mt-1 self-center rounded-full border px-2.5 py-0.5 text-xs font-semibold"
          style={{ borderColor: categoryColor, color: categoryColor }}
        >
          {category}
        </div>
      )}

      {showLegend && (
        <div className="mt-6 flex flex-wrap justify-center gap-x-4 gap-y-2 pt-2 text-[12px] font-medium text-slate-600 dark:text-zinc-400">
          <span className="flex items-center gap-1.5"><div className="h-2.5 w-2.5 rounded-full" style={{ background: '#10B981' }} /> Good</span>
          <span className="flex items-center gap-1.5"><div className="h-2.5 w-2.5 rounded-full" style={{ background: '#84CC16' }} /> Satisfactory</span>
          <span className="flex items-center gap-1.5"><div className="h-2.5 w-2.5 rounded-full" style={{ background: '#F59E0B' }} /> Moderate</span>
          <span className="flex items-center gap-1.5"><div className="h-2.5 w-2.5 rounded-full" style={{ background: '#F97316' }} /> Poor</span>
          <span className="flex items-center gap-1.5"><div className="h-2.5 w-2.5 rounded-full" style={{ background: '#EF4444' }} /> Very Poor</span>
          <span className="flex items-center gap-1.5"><div className="h-2.5 w-2.5 rounded-full" style={{ background: '#B91C1C' }} /> Severe</span>
        </div>
      )}
    </div>
  );
}