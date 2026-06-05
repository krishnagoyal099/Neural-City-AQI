// ============================================================
// FILE: src/app/layout.tsx
// PURPOSE: Root layout with fonts, metadata, providers, and navigation
// DEPENDS ON: src/context/DashboardContext.tsx
// ============================================================

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import '../styles/globals.css';
import { DashboardProvider } from '@/context/DashboardContext';
import NavLiveIndicator from '@/components/ui/NavLiveIndicator';
import NavPills from '@/components/ui/NavPills';
import { ThemeProvider } from '@/components/ThemeProvider';
import ThemeToggle from '@/components/ui/ThemeToggle';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Neural City — Air Health Module',
  description: 'Real-time Air Quality Intelligence for India\'s urban centers. CPCB AQI data integrated into the Neural City ranking ecosystem.',
};

/**
 * Root layout defining the HTML structure, global fonts,
 * navigation bar, and context providers.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable}`} suppressHydrationWarning>
      <body className="min-h-screen bg-[#FBFCFD] dark:bg-[#050505] font-sans text-slate-800 dark:text-zinc-100 antialiased relative transition-colors duration-300">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {/* Subtle background decoration */}
          <div className="fixed inset-0 z-[-1] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 pointer-events-none dark:opacity-[0.05]"></div>
          <div className="fixed inset-0 z-[-1] bg-gradient-to-br from-white/40 via-transparent to-emerald-50/20 dark:from-zinc-900/50 dark:via-transparent dark:to-emerald-950/20 pointer-events-none"></div>

          <DashboardProvider>
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/60 dark:bg-black/60 backdrop-blur-2xl border-b border-white/40 dark:border-white/10">
            <nav className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
              {/* Left: Logo */}
              <div className="flex items-center gap-2">
                <Link href="/" className="text-lg tracking-tight text-slate-900 dark:text-white hover:opacity-80 transition-opacity">
                  Neural<span className="text-emerald-500 font-bold">City</span>
                </Link>
              </div>
              
              {/* Center: Pill Navigation */}
              <NavPills />

              {/* Right: Live Indicator & Theme */}
              <div className="flex items-center gap-3">
                <NavLiveIndicator />
                <div className="w-px h-5 bg-slate-200 dark:bg-white/10 mx-1"></div>
                <ThemeToggle />
              </div>
            </nav>
          </header>

          {/* Main Content */}
          <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            {children}
          </main>
        </DashboardProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}