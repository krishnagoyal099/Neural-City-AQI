'use client';

import { useDashboard } from '@/context/DashboardContext';
import LiveIndicator from '@/components/ui/LiveIndicator';

/**
 * Wrapper that reads isLive + fetchedAt from DashboardContext
 * and renders the LiveIndicator in the navbar.
 * This is a client component so it can access context.
 */
export default function NavLiveIndicator() {
  const { isLive, fetchedAt } = useDashboard();
  return <LiveIndicator isLive={isLive} fetchedAt={fetchedAt} />;
}
