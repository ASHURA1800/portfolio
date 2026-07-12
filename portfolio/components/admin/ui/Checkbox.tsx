'use client';

import { forwardRef, useId, type InputHTMLAttributes } from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label?: string;
  description?: string;
  size?: 'sm' | 'md';
}

const BOX_SIZES = { sm: 'w-4 h-4', md: 'w-5 h-5' };
const ICON_SIZES = { sm: 'w-3 h-3', md: 'w-3.5 h-3.5' };

/**
 * Visually a custom box, functionally a real <input type="checkbox"> —
 * the native input stays interactive (just visually hidden via peer
 * classes) so keyboard, screen reader, and form semantics are all native,
 * not reimplemented.
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, description, size = 'md', disabled, id, className, ...rest },
  ref
) {
  const autoId = useId();
  const fieldId = id ?? autoId;

  return (
    <label
      htmlFor={fieldId}
      className={cn(
        // p-1 -m-1 expands the real click/tap target beyond the visible box
        // toward WCAG's 24x24 minimum, offset by negative margin so it
        // doesn't shift surrounding layout (safe here since this is always
        // a leaf element, never adjacent to a sibling that margin would
        // collide with).
        'inline-flex items-start gap-2.5 select-none p-1 -m-1',
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      )}
    >
      <span className="relative inline-flex shrink-0 mt-0.5">
        <input
          ref={ref}
          type="checkbox"
          id={fieldId}
          disabled={disabled}
          className={cn('peer sr-only', className)}
          {...rest}
        />
        <span
          aria-hidden="true"
          className={cn(
            'flex items-center justify-center rounded-[calc(var(--radius-md)*0.55)] border-2',
            'border-[var(--color-border-hover)] bg-[var(--color-surface)]',
            'transition-colors duration-[var(--admin-duration-fast)]',
            'peer-checked:bg-[var(--color-accent-500)] peer-checked:border-[var(--color-accent-500)]',
            'peer-checked:[&>svg]:opacity-100',
            'peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--color-accent-500)]/50 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-[var(--color-bg)]',
            BOX_SIZES[size]
          )}
        >
          <Check
            className={cn('text-white opacity-0 transition-opacity duration-[var(--admin-duration-instant)]', ICON_SIZES[size])}
            strokeWidth={3}
          />
        </span>
      </span>
      {(label || description) && (
        <span className="flex flex-col">
          {label && <span className="text-sm text-[var(--color-ink)] leading-tight">{label}</span>}
          {description && <span className="text-xs text-[var(--color-faint)] mt-0.5">{description}</span>}
        </span>
      )}
    </label>
  );
});
