'use client';

import { forwardRef, useId, useState, type TextareaHTMLAttributes } from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

export interface FloatingTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  hint?: string;
  showCount?: boolean;
}

export const FloatingTextarea = forwardRef<HTMLTextAreaElement, FloatingTextareaProps>(function FloatingTextarea(
  { label, hint, showCount, maxLength, id, value, required, disabled, rows = 3, className, onFocus, onBlur, placeholder: _placeholder, ...rest },
  ref
) {
  // See FloatingField: a passed-in placeholder would render at the same
  // centered position as the floating label and visually collide with it.
  const autoId = useId();
  void _placeholder;
  const fieldId = id ?? autoId;
  const [focused, setFocused] = useState(false);
  const hasValue = typeof value === 'string' && value.length > 0;
  const floated = focused || hasValue;
  const count = typeof value === 'string' ? value.length : 0;

  return (
    <div className="flex flex-col gap-1.5">
      <div className="relative">
        <textarea
          ref={ref}
          id={fieldId}
          value={value}
          maxLength={maxLength}
          required={required}
          disabled={disabled}
          rows={rows}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          className={cn(
            'peer w-full bg-[var(--color-surface)] border rounded-[var(--radius-md)] px-3.5 pt-7 pb-2.5 text-sm text-[var(--color-ink)] resize-y',
            'transition-colors duration-[var(--admin-duration-fast)]',
            'focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-500)]/40 focus:border-[var(--color-accent-500)]',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'border-[var(--color-border)] hover:border-[var(--color-border-hover)]',
            className
          )}
          {...rest}
        />
        <motion.label
          htmlFor={fieldId}
          className="absolute left-3.5 pointer-events-none text-[var(--color-faint)] origin-left"
          animate={floated ? { top: '0.5rem', fontSize: '0.6875rem' } : { top: '0.875rem', fontSize: '0.875rem' }}
          transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          {label}
          {required && <span className="text-[var(--color-error)] ml-0.5">*</span>}
        </motion.label>
      </div>
      <div className="flex items-center justify-between px-0.5">
        {hint ? <p className="text-xs text-[var(--color-faint)]">{hint}</p> : <span />}
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
