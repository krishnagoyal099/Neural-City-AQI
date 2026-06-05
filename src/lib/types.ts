// ============================================================
// FILE: src/lib/types.ts
// PURPOSE: Foundation type definitions for the entire application
// DEPENDS ON: None
// ============================================================

/** AQI category labels as defined by CPCB */
type AQICategory =
  | 'Good'
  | 'Satisfactory'
  | 'Moderate'
  | 'Poor'
  | 'Very Poor'
  | 'Severe';

/** Pollutant measurement keys matching CPCB reporting structure */
interface PollutantData {
  pm25: number;
  pm10: number;
  no2: number;
  so2: number;
  co: number;
  o3: number;
  nh3: number;
}

/** Single monthly AQI data point for trend visualization */
interface MonthlyAQIPoint {
  month: string;
  aqiValue: number;
  category: AQICategory;
}

/** Complete city-level AQI dataset */
interface CityAQIData {
  cityId: string;
  cityName: string;
  state: string;
  latitude: number;
  longitude: number;
  aqiValue: number;
  aqiCategory: AQICategory;
  airHealthScore: number;
  pollutants: PollutantData;
  monthlyTrend: MonthlyAQIPoint[];
  peerCities: string[];
  lastUpdated: string;
}

/** Result of comparing two cities' air quality */
interface ComparisonResult {
  cityA: CityAQIData;
  cityB: CityAQIData;
  aqiDifference: number;
  cleanerCity: string;
  primaryDifference: keyof PollutantData;
  percentDifference: number;
}

/** Single intervention recommendation for government officers */
interface InterventionItem {
  pollutant: keyof PollutantData;
  reductionTarget: number;
  impact: 'High' | 'Medium' | 'Low';
  feasibility: 'High' | 'Medium' | 'Low';
  description: string;
}

/** Government insight data for a specific city */
interface GovernmentInsight {
  cityId: string;
  currentRank: number;
  projectedRank: number;
  healthCostEstimate: string;
  interventionPriority: InterventionItem[];
}

/** AQI range definition for category mapping */
interface AQIRange {
  min: number;
  max: number;
  label: AQICategory;
  color: string;
}

/** Health advisory text for each AQI category */
interface HealthAdvisory {
  category: AQICategory;
  shortText: string;
  longText: string;
  icon: string;
}

/** Category distribution counts for donut chart */
interface CategoryDistribution {
  Good: number;
  Satisfactory: number;
  Moderate: number;
  Poor: number;
  'Very Poor': number;
  Severe: number;
}

/** Peer group definition for city clustering */
interface PeerGroup {
  groupId: string;
  groupName: string;
  cityIds: string[];
}

/** Props for metric card component */
interface MetricCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'stable';
  color?: string;
}

/** Props for the custom AQI gauge */
interface GaugeProps {
  value: number;
  maxValue?: number;
  size?: number;
  animated?: boolean;
  label?: string;
  showCategory?: boolean;
  trendValue?: string;
  trendLabel?: string;
  trendDirection?: 'up' | 'down';
  title?: string;
  subtitle?: string;
  location?: string;
  showLegend?: boolean;
  className?: string;
}

/** Search bar props */
interface SearchBarProps {
  cities: CityAQIData[];
  onSelectAction: (city: CityAQIData) => void;
  placeholder?: string;
}

/** Chart data point for seasonal area chart */
interface SeasonalDataPoint {
  month: string;
  nationalAvg: number;
  goodCount: number;
  moderateCount: number;
  poorCount: number;
}

export type {
  AQICategory,
  PollutantData,
  MonthlyAQIPoint,
  CityAQIData,
  ComparisonResult,
  InterventionItem,
  GovernmentInsight,
  AQIRange,
  HealthAdvisory,
  CategoryDistribution,
  PeerGroup,
  MetricCardProps,
  GaugeProps,
  SearchBarProps,
  SeasonalDataPoint,
};