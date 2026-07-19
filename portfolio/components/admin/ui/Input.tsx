'use client';

import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

type InputSize = 'sm' | 'md' | 'lg';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  hint?: string;
  error?: string;
  size?: InputSize;
  icon?: ReactNode;
  /** Trailing slot — e.g. a unit label or the PasswordInput reveal toggle. */
  trailing?: ReactNode;
  containerClassName?: string;
}

const SIZES: Record<InputSize, string> = {
  sm: 'h-8 text-xs px-2.5',
  md: 'h-10 text-sm px-3.5',
  lg: 'h-12 text-base px-4',
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    label,
    hint,
    error,
    size = 'md',
    icon,
    trailing,
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
  const inputId = id ?? autoId;
  const hintId = hint ? `${inputId}-hint` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;
  const describedBy = [ariaDescribedBy, hintId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div className={cn('flex flex-col gap-1.5', containerClassName)}>
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-[var(--color-ink)]">
          {label}
          {required && <span className="text-[var(--color-error)] ml-0.5">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-faint)] [&>svg]:w-4 [&>svg]:h-4">
            {icon}
          </span>
        )}
        <input
          ref={ref}
          id={inputId}
          disabled={disabled}
          required={required}
          aria-invalid={!!error || undefined}
          aria-describedby={describedBy}
          className={cn(
            'w-full bg-[var(--color-surface)] border rounded-[var(--radius-md)] text-[var(--color-ink)]',
            'placeholder:text-[var(--color-faint)]',
            'transition-colors duration-[var(--admin-duration-fast)]',
            'focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-500)]/40 focus:border-[var(--color-accent-500)]',
            'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-[var(--color-surface)]/50',
            error ? 'border-[var(--color-error)]' : 'border-[var(--color-border)] hover:border-[var(--color-border-hover)]',
            SIZES[size],
            icon && 'pl-10',
            trailing && 'pr-9',
            className
          )}
          {...rest}
        />
        {trailing && (
          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center">{trailing}</span>
        )}
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
