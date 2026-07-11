'use client';

import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

export interface ProgressProps {
  /** 0–100. Omit for an indeterminate loading bar. */
  value?: number;
  label?: string;
  size?: 'sm' | 'md';
  tone?: 'accent' | 'success' | 'error' | 'warning';
  showValue?: boolean;
  className?: string;
}

const HEIGHTS = { sm: 'h-1.5', md: 'h-2.5' };
const TONES: Record<NonNullable<ProgressProps['tone']>, string> = {
  accent: 'bg-[var(--color-accent-500)]',
  success: 'bg-[var(--color-success)]',
  error: 'bg-[var(--color-error)]',
  warning: 'bg-[var(--color-warning)]',
};

export function Progress({ value, label, size = 'md', tone = 'accent', showValue = false, className }: ProgressProps) {
  const indeterminate = value === undefined;
  const clamped = indeterminate ? 0 : Math.min(100, Math.max(0, value));

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {(label || showValue) && (
        <div className="flex items-center justify-between text-xs text-[var(--color-muted)]">
          {label && <span>{label}</span>}
          {showValue && !indeterminate && <span className="tabular-nums">{Math.round(clamped)}%</span>}
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={indeterminate ? undefined : clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
        className={cn('w-full overflow-hidden rounded-[var(--radius-full)] bg-[var(--color-border)]', HEIGHTS[size])}
      >
        {indeterminate ? (
          <motion.div
            className={cn('h-full w-1/3 rounded-[var(--radius-full)]', TONES[tone])}
            animate={{ x: ['-100%', '250%'] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
          />
        ) : (
          <motion.div
            className={cn('h-full rounded-[var(--radius-full)]', TONES[tone])}
            initial={{ width: 0 }}
            animate={{ width: `${clamped}%` }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          />
        )}
      </div>
    </div>
  );
}
