'use client';

import { X } from 'lucide-react';
import { Search } from './Search';

export interface ActiveFilter {
  key: string;
  label: string;
}

export function SearchFilter({
  searchValue,
  onSearchChange,
  searchPlaceholder,
  filters = [],
  onRemoveFilter,
  onClearAll,
}: {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  filters?: ActiveFilter[];
  onRemoveFilter?: (key: string) => void;
  onClearAll?: () => void;
}) {
  return (
    <div className="flex flex-1 flex-wrap items-center gap-2">
      <Search value={searchValue} onChange={onSearchChange} placeholder={searchPlaceholder} className="w-full max-w-xs" />

      {filters.map((f) => (
        <span
          key={f.key}
          className="flex items-center gap-1.5 rounded-full border border-accent-500/30 bg-accent-500/10 py-1 pl-3 pr-1.5 text-xs text-accent-300"
        >
          {f.label}
          {onRemoveFilter && (
            <button
              type="button"
              onClick={() => onRemoveFilter(f.key)}
              aria-label={`Remove filter: ${f.label}`}
              className="relative flex h-4 w-4 items-center justify-center rounded-full before:absolute before:-inset-2.5 before:content-[''] hover:bg-accent-500/20"
            >
              <X size={11} />
            </button>
          )}
        </span>
      ))}

      {filters.length > 0 && onClearAll && (
        <button type="button" onClick={onClearAll} className="text-xs text-faint underline-offset-2 hover:text-ink hover:underline">
          Clear all
        </button>
      )}
    </div>
  );
}
