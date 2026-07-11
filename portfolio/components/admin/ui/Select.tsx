'use client';

import { forwardRef, useId, type SelectHTMLAttributes } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: string;
  hint?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
  size?: 'sm' | 'md' | 'lg';
  containerClassName?: string;
}

const SIZES: Record<NonNullable<SelectProps['size']>, string> = {
  sm: 'h-8 text-xs pl-2.5 pr-8',
  md: 'h-10 text-sm pl-3.5 pr-9',
  lg: 'h-12 text-base pl-4 pr-10',
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  {
    label,
    hint,
    error,
    options,
    placeholder,
    size = 'md',
    disabled,
    required,
    id,
    className,
    containerClassName,
    'aria-describedby': ariaDescribedBy,
    ...rest
  },
  ref
) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  const hintId = hint ? `${fieldId}-hint` : undefined;
  const errorId = error ? `${fieldId}-error` : undefined;
  const describedBy = [ariaDescribedBy, hintId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div className={cn('flex flex-col gap-1.5', containerClassName)}>
      {label && (
        <label htmlFor={fieldId} className="text-sm font-medium text-[var(--color-ink)]">
          {label}
          {required && <span className="text-[var(--color-error)] ml-0.5">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          id={fieldId}
          disabled={disabled}
          required={required}
          aria-invalid={!!error || undefined}
          aria-describedby={describedBy}
          // color-scheme: dark makes native option-list rendering (incl. on
          // Windows/Chrome) use dark chrome automatically — no per-<option>
          // background hack needed, unlike the bg-gray-900 fragile pattern.
          style={{ colorScheme: 'dark' }}
          className={cn(
            'w-full appearance-none bg-[var(--color-surface)] border rounded-[var(--radius-md)] text-[var(--color-ink)]',
            'transition-colors duration-[var(--admin-duration-fast)]',
            'focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-500)]/40 focus:border-[var(--color-accent-500)]',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            error ? 'border-[var(--color-error)]' : 'border-[var(--color-border)] hover:border-[var(--color-border-hover)]',
            SIZES[size],
            className
          )}
          {...rest}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} disabled={opt.disabled}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-faint)]" />
      </div>
      {error ? (
        <p id={errorId} role="alert" className="text-xs text-[var(--color-error)]">
          {error}
        </p>
      ) : hint ? (
        <p id={hintId} className="text-xs text-[var(--color-faint)]">
          {hint}
        </p>
      ) : null}
    </div>
  );
});
