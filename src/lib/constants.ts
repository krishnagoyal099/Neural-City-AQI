// ============================================================
// FILE: src/lib/constants.ts
// PURPOSE: Application-wide constants — colors, thresholds, ranges
// DEPENDS ON: src/lib/types.ts
// ============================================================

import type { AQIRange, HealthAdvisory } from './types';

/** AQI category colors — mandatory as specified */
export const AQI_COLORS = {
  good: '#10B981',
  satisfactory: '#84CC16',
  moderate: '#F59E0B',
  poor: '#F97316',
  veryPoor: '#EF4444',
  severe: '#B91C1C',
} as const;

/** Light theme UI palette */
export const UI_COLORS = {
  bgPrimary: '#F8FAFC',
  bgSecondary: '#F1F5F9',
  bgCard: '#FFFFFF',
  border: '#E2E8F0',
  textPrimary: '#0F172A',
  textSecondary: '#64748B',
  accent: '#0EA5E9',
} as const;

/** AQI range definitions per CPCB standard */
export const AQI_RANGES: readonly AQIRange[] = [
  { min: 0, max: 50, label: 'Good', color: AQI_COLORS.good },
  { min: 51, max: 100, label: 'Satisfactory', color: AQI_COLORS.satisfactory },
  { min: 101, max: 200, label: 'Moderate', color: AQI_COLORS.moderate },
  { min: 201, max: 300, label: 'Poor', color: AQI_COLORS.poor },
  { min: 301, max: 400, label: 'Very Poor', color: AQI_COLORS.veryPoor },
  { min: 401, max: 500, label: 'Severe', color: AQI_COLORS.severe },
] as const;

/** Health advisory texts for each AQI category */
export const HEALTH_ADVISORIES: readonly HealthAdvisory[] = [
  {
    category: 'Good',
    shortText: 'Air quality is satisfactory',
    longText: 'Air quality is satisfactory and poses little or no health risk. Enjoy outdoor activities freely.',
    icon: 'Leaf',
  },
  {
    category: 'Satisfactory',
    shortText: 'Acceptable air quality',
    longText: 'Air quality is acceptable. However, there may be some health concern for a small number of people who are unusually sensitive to air pollution.',
    icon: 'Wind',
  },
  {
    category: 'Moderate',
    shortText: 'Sensitive groups may experience effects',
    longText: 'Members of sensitive groups may experience health effects. The general public is less likely to be affected. Reduce prolonged outdoor exertion if you have respiratory conditions.',
    icon: 'Sun',
  },
  {
    category: 'Poor',
    shortText: 'Health effects for everyone',
    longText: 'Everyone may begin to experience health effects; members of sensitive groups may experience more serious health effects. Sensitive groups should reduce outdoor exertion.',
    icon: 'AlertTriangle',
  },
  {
    category: 'Very Poor',
    shortText: 'Health alert — serious effects',
    longText: 'Health alert: everyone may experience more serious health effects. Avoid outdoor activity. Keep windows closed and use air purifiers if available.',
    icon: 'AlertCircle',
  },
  {
    category: 'Severe',
    shortText: 'Health emergency',
    longText: 'Health warning of emergency conditions. The entire population is likely to be affected. Stay indoors, avoid all outdoor physical activity, and seek medical help if experiencing symptoms.',
    icon: 'Siren',
  },
] as const;

/** Pollutant display labels */
export const POLLUTANT_LABELS: Record<string, string> = {
  pm25: 'PM2.5',
  pm10: 'PM10',
  no2: 'NO₂',
  so2: 'SO₂',
  co: 'CO',
  o3: 'O₃',
  nh3: 'NH₃',
};

/** Maximum AQI value on the scale */
export const MAX_AQI = 500;

/** Maximum air health score */
export const MAX_HEALTH_SCORE = 100;

/** Number of months in trend data */
export const TREND_MONTHS = 12;

/** Month labels in order */
export const MONTH_LABELS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
] as const;

/** Animation durations in milliseconds */
export const ANIMATION = {
  gaugeDuration: 1500,
  chartStagger: 100,
  pageTransition: 300,
  skeletonMinDisplay: 800,
} as const;

/** Framer Motion spring config for gauge animation */
export const GAUGE_SPRING = {
  stiffness: 100,
  damping: 15,
} as const;

/** Breakpoints matching Tailwind defaults */
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
} as const;

/** Number of cities to show in top/bottom lists */
export const TOP_CITIES_COUNT = 5;

/** Estimated health cost per AQI point above 100 (in INR crores) */
export const HEALTH_COST_PER_AQI_POINT = 0.12;

/** Seasonal risk levels for calendar */
export const SEASONAL_RISK = {
  winter: 'high' as const,
  summer: 'moderate' as const,
  monsoon: 'low' as const,
  postMonsoon: 'high' as const,
} as const;