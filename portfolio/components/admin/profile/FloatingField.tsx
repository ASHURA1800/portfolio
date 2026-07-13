'use client';

import { forwardRef, useId, useState, type InputHTMLAttributes } from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

export interface FloatingFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
  error?: string;
  /** Show a live character count against maxLength */
  showCount?: boolean;
}

/** Text input with a floating label — starts centered as placeholder text,
 *  rises above the field on focus or when a value is present. Built
 *  specifically for the Profile Manager form; the shared Input component
 *  intentionally keeps its static above-field label so other forms are
 *  unaffected by this. */
export const FloatingField = forwardRef<HTMLInputElement, FloatingFieldProps>(function FloatingField(
  { label, hint, error, showCount, maxLength, id, value, required, disabled, className, onFocus, onBlur, ...rest },
  ref
) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  const [focused, setFocused] = useState(false);
  const hasValue = typeof value === 'string' && value.length > 0;
  const floated = focused || hasValue;
  const count = typeof value === 'string' ? value.length : 0;

  return (
    <div className="flex flex-col gap-1.5">
      <div className="relative">
        <input
          ref={ref}
          id={fieldId}
          value={value}
          maxLength={maxLength}
          required={required}
          disabled={disabled}
          aria-invalid={!!error || undefined}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          className={cn(
            'peer w-full h-12 bg-[var(--color-surface)] border rounded-[var(--radius-md)] px-3.5 pt-4 text-sm text-[var(--color-ink)]',
            'transition-colors duration-[var(--admin-duration-fast)]',
            'focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-500)]/40 focus:border-[var(--color-accent-500)]',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            error ? 'border-[var(--color-error)]' : 'border-[var(--color-border)] hover:border-[var(--color-border-hover)]',
            className
          )}
          {...rest}
        />
        <motion.label
          htmlFor={fieldId}
          className="absolute left-3.5 pointer-events-none text-[var(--color-faint)] origin-left"
          animate={floated ? { top: '0.4rem', fontSize: '0.6875rem', y: 0 } : { top: '50%', fontSize: '0.875rem', y: '-50%' }}
          transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          {label}
          {required && <span className="text-[var(--color-error)] ml-0.5">*</span>}
        </motion.label>
      </div>
      <div className="flex items-center justify-between px-0.5">
        {error ? (
          <p role="alert" className="text-xs text-[var(--color-error)]">
            {error}
          </p>
        ) : hint ? (
          <p className="text-xs text-[var(--color-faint)]">{hint}</p>
        ) : (
          <span />
        )}
        {showCount && maxLength && (
          <span
            className={cn(
              'text-[10px] tabular-nums',
              count > maxLength * 0.9 ? 'text-[var(--color-warning)]' : 'text-[var(--color-faint)]'
            )}
          >
            {count}/{maxLength}
          </span>
        )}
      </div>
    </div>
  );
});
