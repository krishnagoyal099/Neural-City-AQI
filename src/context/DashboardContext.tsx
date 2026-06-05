// ============================================================
// FILE: src/context/DashboardContext.tsx
// PURPOSE: Global dashboard state — selected city, live data status
// DEPENDS ON: src/lib/types.ts
// ============================================================

'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';
import type { CityAQIData } from '@/lib/types';

/** Shape of the global dashboard context */
interface DashboardContextValue {
  selectedCity: CityAQIData | null;
  setSelectedCity: (city: CityAQIData | null) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  // Live data status surfaced from useCityData → page → here
  isLive: boolean;
  setIsLive: (live: boolean) => void;
  fetchedAt: string;
  setFetchedAt: (ts: string) => void;
}

const DashboardContext = createContext<DashboardContextValue | undefined>(undefined);

/** Provider component that wraps the app and provides dashboard state */
export function DashboardProvider({ children }: { children: ReactNode }) {
  const [selectedCity, setSelectedCity] = useState<CityAQIData | null>(null);
  const [sidebarOpen, setSidebarOpen]   = useState<boolean>(false);
  const [isLive, setIsLive]             = useState<boolean>(false);
  const [fetchedAt, setFetchedAt]       = useState<string>('');

  return (
    <DashboardContext.Provider
      value={{
        selectedCity, setSelectedCity,
        sidebarOpen, setSidebarOpen,
        isLive, setIsLive,
        fetchedAt, setFetchedAt,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

/**
 * Hook to access the dashboard context.
 * Must be used within a DashboardProvider.
 */
export function useDashboard(): DashboardContextValue {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
}