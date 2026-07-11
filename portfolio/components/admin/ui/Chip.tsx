'use client';

import type { ReactNode } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ChipProps {
  children: ReactNode;
  onRemove?: () => void;
  removeLabel?: string;
  disabled?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

const SIZES = { sm: 'h-6 pl-2.5 pr-1.5 text-xs gap-1', md: 'h-7 pl-3 pr-2 text-sm gap-1.5' };

export function Chip({ children, onRemove, removeLabel, disabled, size = 'md', className }: ChipProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border border-[var(--color-border-hover)] bg-[var(--color-surface)] text-[var(--color-ink)]',
        disabled && 'opacity-50',
        SIZES[size],
        className
      )}
    >
      <span className="truncate max-w-[12rem]">{children}</span>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          disabled={disabled}
          aria-label={removeLabel ?? `Remove ${typeof children === 'string' ? children : 'item'}`}
          className={cn(
            'inline-flex items-center justify-center rounded-full shrink-0',
            'w-4 h-4 text-[var(--color-faint)] hover:text-[var(--color-error)] hover:bg-[var(--color-error-bg)]',
            'transition-colors duration-[var(--admin-duration-fast)]',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-500)]',
            'disabled:pointer-events-none'
          )}
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </span>
  );
}
