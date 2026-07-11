'use client';

import { forwardRef, useId, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
  error?: string;
  containerClassName?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  {
    label,
    hint,
    error,
    disabled,
    required,
    id,
    rows = 4,
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
      <textarea
        ref={ref}
        id={fieldId}
        rows={rows}
        disabled={disabled}
        required={required}
        aria-invalid={!!error || undefined}
        aria-describedby={describedBy}
        className={cn(
          'w-full bg-[var(--color-surface)] border rounded-[var(--radius-md)] text-[var(--color-ink)] text-sm',
          'px-3.5 py-2.5 resize-y min-h-[5rem]',
          'placeholder:text-[var(--color-faint)]',
          'transition-colors duration-[var(--admin-duration-fast)]',
          'focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-500)]/40 focus:border-[var(--color-accent-500)]',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          error ? 'border-[var(--color-error)]' : 'border-[var(--color-border)] hover:border-[var(--color-border-hover)]',
          className
        )}
        {...rest}
      />
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
