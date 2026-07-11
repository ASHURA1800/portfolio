'use client';

import { forwardRef } from 'react';
import { Search, X } from 'lucide-react';
import { Input, type InputProps } from './Input';

export interface SearchInputProps extends Omit<InputProps, 'icon' | 'type'> {
  onClear?: () => void;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(function SearchInput(
  { value, onClear, ...rest },
  ref
) {
  const hasValue = typeof value === 'string' && value.length > 0;

  return (
    <Input
      ref={ref}
      type="search"
      value={value}
      icon={<Search />}
      trailing={
        hasValue && onClear ? (
          <button
            type="button"
            onClick={onClear}
            aria-label="Clear search"
            className="text-[var(--color-faint)] hover:text-[var(--color-ink)] transition-colors duration-[var(--admin-duration-fast)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-500)] rounded-sm"
          >
            <X className="w-4 h-4" />
          </button>
        ) : undefined
      }
      {...rest}
    />
  );
});
