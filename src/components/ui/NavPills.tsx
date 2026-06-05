'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/' },
  { label: 'Compare', href: '/compare' },
  { label: 'Action Plan', href: '/government' },
  { label: 'Heatmap', href: '/heatmap' },
];

export default function NavPills() {
  const pathname = usePathname();

  return (
    <div className="hidden items-center gap-2 md:flex">
      {NAV_ITEMS.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`rounded-full px-4 py-2 text-[11px] font-semibold transition-all ${
              isActive
                ? 'bg-[#111] dark:bg-white/10 text-white shadow-md'
                : 'text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/50 dark:hover:bg-white/5'
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}
