// ============================================================
// FILE: src/components/charts/IndiaHeatMap.tsx
// PURPOSE: SVG-based India map heatmap showing AQI by city location
// DEPENDS ON: src/lib/types.ts, src/lib/category-utils.ts
// ============================================================

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import type { CityAQIData } from '@/lib/types';
import { getAQIColor } from '@/lib/category-utils';

interface IndiaHeatMapProps {
  cities: CityAQIData[];
  onCityClick?: (city: CityAQIData) => void;
  mapScale?: number;
  center?: [number, number];
  hideTitle?: boolean;
}

const geoUrl = '/india-states.geojson';

/**
 * SVG heatmap of India with city markers colored by AQI.
 * Hovering shows city name and AQI; clicking navigates to city detail.
 */
export default function IndiaHeatMap({ 
  cities, 
  onCityClick,
  mapScale = 1000,
  center = [82.5, 23],
  hideTitle = false
}: IndiaHeatMapProps) {
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="h-full flex flex-col rounded-[32px] border border-white/60 dark:border-white/5 bg-white/80 dark:bg-white/5 p-6 backdrop-blur-2xl shadow-[0_4px_24px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)]"
    >
      {!hideTitle && <h3 className="mb-4 text-lg font-semibold text-slate-800 dark:text-zinc-100">India AQI Heatmap</h3>}

      <div className="relative w-full flex-grow flex flex-col justify-center items-center overflow-hidden min-h-0">
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{
            scale: mapScale,
            center: center as [number, number]
          }}
          className="w-full h-full drop-shadow-sm"
          style={{ maxHeight: '100%', objectFit: 'contain' }}
        >
          <defs>
            <linearGradient id="mapGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--map-fill-start, #F1F5F9)" />
              <stop offset="100%" stopColor="var(--map-fill-end, #CBD5E1)" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <Geographies geography={geoUrl}>
            {({ geographies }: { geographies: any[] }) =>
              geographies.map((geo: any) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="url(#mapGradient)"
                  stroke="var(--map-stroke, #FFFFFF)"
                  strokeWidth={0.75}
                  style={{
                    default: { outline: 'none' },
                    hover: { outline: 'none', fill: 'var(--map-hover, #E2E8F0)', transition: 'all 0.2s' },
                    pressed: { outline: 'none' },
                  }}
                />
              ))
            }
          </Geographies>

          {cities.map((city) => {
            const color = getAQIColor(city.aqiValue);
            const isHovered = hoveredCity === city.cityId;
            const radius = isHovered ? 8 : 5;

            return (
              <Marker
                key={city.cityId}
                coordinates={[city.longitude, city.latitude]}
                onMouseEnter={() => setHoveredCity(city.cityId)}
                onMouseLeave={() => setHoveredCity(null)}
                onClick={() => onCityClick?.(city)}
                className="cursor-pointer"
              >
                {/* Animated Glow effect */}
                <motion.circle 
                  r={radius} 
                  fill={color} 
                  initial={{ opacity: 0.4, scale: 1 }}
                  animate={{ opacity: [0.4, 0.1, 0.4], scale: [1, 1.8, 1] }}
                  transition={{ 
                    duration: city.aqiValue > 300 ? 1.5 : 3, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                />
                {/* Main dot */}
                <circle
                  r={radius}
                  fill={color}
                  stroke="#F8FAFC" strokeWidth="1.5"
                />
                {/* Hover tooltip */}
                {isHovered && (
                  <g transform="translate(0, -15)">
                    <rect
                      x={-50}
                      y={-20}
                      width={100}
                      height={30}
                      rx={6}
                      fill="var(--tooltip-bg, rgba(255, 255, 255, 0.95))"
                      stroke="var(--tooltip-border, #E2E8F0)"
                      strokeWidth={1}
                      filter="drop-shadow(0 4px 6px rgba(0,0,0,0.1))"
                      style={{ pointerEvents: "none", backdropFilter: "blur(4px)" }}
                    />
                    <text
                      textAnchor="middle"
                      y={0}
                      fill="var(--tooltip-text, #0F172A)"
                      fontSize={11}
                      fontWeight="bold"
                      fontFamily="var(--font-body)"
                      style={{ pointerEvents: "none" }}
                    >
                      {city.cityName}: {city.aqiValue}
                    </text>
                  </g>
                )}
              </Marker>
            );
          })}
        </ComposableMap>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap justify-center gap-4 text-xs font-medium text-slate-600 dark:text-zinc-400">
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: getAQIColor(30) }} /> Good
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: getAQIColor(75) }} /> Satisfactory
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: getAQIColor(150) }} /> Moderate
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: getAQIColor(250) }} /> Poor
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: getAQIColor(350) }} /> Very Poor
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: getAQIColor(450) }} /> Severe
          </span>
        </div>
      </div>
    </motion.div>
  );
}