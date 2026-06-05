// ============================================================
// FILE: src/components/ui/SearchBar.tsx
// PURPOSE: Autocomplete search bar for city selection
// DEPENDS ON: src/lib/types.ts
// ============================================================

'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { SearchBarProps } from '@/lib/types';

/**
 * Search input with autocomplete dropdown for city names.
 * Filters cities by name or state as the user types.
 * Clicking a suggestion calls onSelectAction with the full city data.
 */
export default function SearchBar({ cities, onSelectAction, placeholder = 'Search your city...' }: SearchBarProps) {
  const [query, setQuery] = useState<string>('');
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [highlightIndex, setHighlightIndex] = useState<number>(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  /** Filter cities matching the query */
  const suggestions = query.trim().length > 0
    ? cities.filter(
        (c) =>
          c.cityName.toLowerCase().includes(query.toLowerCase()) ||
          c.state.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  /** Reset state when a city is selected */
  const handleSelect = useCallback(
    (city: typeof cities[number]) => {
      setQuery('');
      setIsOpen(false);
      setHighlightIndex(-1);
      onSelectAction(city);
    },
    [onSelectAction]
  );

  /** Handle keyboard navigation in the dropdown */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightIndex((prev) => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && highlightIndex >= 0) {
      e.preventDefault();
      handleSelect(suggestions[highlightIndex]!);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setHighlightIndex(-1);
    }
  };

  /** Close dropdown when clicking outside */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(e.target as Node) &&
        listRef.current &&
        !listRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            setHighlightIndex(-1);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          aria-label="Search for a city"
          aria-expanded={isOpen}
          aria-autocomplete="list"
          className="w-full rounded-lg border border-slate-600 bg-slate-800 py-3 pl-10 pr-4 text-slate-100 placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
        />
      </div>

      <AnimatePresence>
        {isOpen && suggestions.length > 0 && (
          <motion.ul
            ref={listRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            role="listbox"
            className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-slate-600 bg-slate-800 shadow-xl"
          >
            {suggestions.map((city, index) => (
              <li
                key={city.cityId}
                role="option"
                aria-selected={index === highlightIndex}
                onClick={() => handleSelect(city)}
                className={`flex cursor-pointer items-center justify-between px-4 py-3 text-sm transition-colors ${
                  index === highlightIndex
                    ? 'bg-cyan-500/20 text-cyan-300'
                    : 'text-slate-200 hover:bg-slate-700'
                }`}
              >
                <span>
                  {city.cityName}, <span className="text-slate-400">{city.state}</span>
                </span>
                <span
                  className="text-xs font-medium"
                  style={{ color: getCategoryColorSimple(city.aqiCategory) }}
                >
                  AQI {city.aqiValue}
                </span>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Simplified category color lookup to avoid hook usage in this component */
function getCategoryColorSimple(category: string): string {
  const colors: Record<string, string> = {
    Good: '#059669',
    Satisfactory: '#65A30D',
    Moderate: '#CA8A04',
    Poor: '#EA580C',
    'Very Poor': '#DC2626',
    Severe: '#7C2D12',
  };
  return colors[category] ?? '#94A3B8';
}