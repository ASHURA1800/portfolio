'use client';

import { forwardRef, useId, type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label?: string;
  description?: string;
  size?: 'sm' | 'md';
}

const BOX_SIZES = { sm: 'w-4 h-4', md: 'w-5 h-5' };
const DOT_SIZES = { sm: 'w-1.5 h-1.5', md: 'w-2 h-2' };

export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio(
  { label, description, size = 'md', disabled, id, className, ...rest },
  ref
) {
  const autoId = useId();
  const fieldId = id ?? autoId;

  return (
    <label
      htmlFor={fieldId}
      className={cn(
        'inline-flex items-start gap-2.5 select-none p-1 -m-1',
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      )}
    >
      <span className="relative inline-flex shrink-0 mt-0.5">
        <input ref={ref} type="radio" id={fieldId} disabled={disabled} className={cn('peer sr-only', className)} {...rest} />
        <span
          aria-hidden="true"
          className={cn(
            'flex items-center justify-center rounded-full border-2',
            'border-[var(--color-border-hover)] bg-[var(--color-surface)]',
            'transition-colors duration-[var(--admin-duration-fast)]',
            'peer-checked:border-[var(--color-accent-500)]',
            'peer-checked:[&>span]:opacity-100 peer-checked:[&>span]:scale-100',
            'peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--color-accent-500)]/50 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-[var(--color-bg)]',
            BOX_SIZES[size]
          )}
        >
          <span
            className={cn(
              'rounded-full bg-[var(--color-accent-500)] opacity-0 scale-0 transition-all duration-[var(--admin-duration-instant)]',
              DOT_SIZES[size]
            )}
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
