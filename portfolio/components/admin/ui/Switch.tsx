'use client';

import { forwardRef, useId, type InputHTMLAttributes } from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label?: string;
  description?: string;
  size?: 'sm' | 'md';
}

const TRACK_SIZES = { sm: 'w-8 h-4.5', md: 'w-10 h-5.5' };
const THUMB_SIZES = { sm: 14, md: 18 };

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(function Switch(
  { label, description, size = 'md', disabled, checked, id, className, ...rest },
  ref
) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  const thumbSize = THUMB_SIZES[size];

  return (
    <label
      htmlFor={fieldId}
      className={cn(
        'inline-flex items-center gap-2.5 select-none',
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      )}
    >
      <span
        className={cn(
          'relative inline-flex items-center rounded-full p-0.5 transition-colors duration-[var(--admin-duration-fast)]',
          'has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[var(--color-accent-500)]/50 has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-[var(--color-bg)]',
          checked ? 'bg-[var(--color-accent-500)]' : 'bg-[var(--color-border-hover)]',
          TRACK_SIZES[size]
        )}
      >
        <input
          ref={ref}
          type="checkbox"
          role="switch"
          id={fieldId}
          disabled={disabled}
          checked={checked}
          className="absolute inset-0 opacity-0 cursor-[inherit] focus-visible:outline-none"
          {...rest}
        />
        <motion.span
          aria-hidden="true"
          className="block rounded-full bg-white shadow-sm"
          style={{ width: thumbSize, height: thumbSize }}
          animate={{ x: checked ? `calc(100% - 2px)` : 2 }}
          transition={{ type: 'spring', stiffness: 500, damping: 32 }}
        />
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
