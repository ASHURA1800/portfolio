'use client';

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Spinner } from './Spinner';

type IconButtonVariant = 'ghost' | 'secondary' | 'danger' | 'primary';
type IconButtonSize = 'sm' | 'md' | 'lg';

export interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  loading?: boolean;
  icon: ReactNode;
  /** Required — icon-only buttons must have an accessible name. */
  label: string;
}

const VARIANTS: Record<IconButtonVariant, string> = {
  ghost: 'bg-transparent text-[var(--color-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-surface-hover)]',
  secondary:
    'bg-[var(--color-surface)] text-[var(--color-ink)] border border-[var(--color-border)] hover:border-[var(--color-border-hover)]',
  primary: 'bg-[var(--color-accent-500)] text-white hover:bg-[var(--color-accent-400)]',
  danger: 'bg-transparent text-[var(--color-muted)] hover:text-[var(--color-error)] hover:bg-[var(--color-error-bg)]',
};

const SIZES: Record<IconButtonSize, string> = {
  sm: 'w-8 h-8 rounded-[var(--radius-md)] text-sm',
  md: 'w-10 h-10 rounded-[var(--radius-md)] text-base',
  lg: 'w-12 h-12 rounded-[var(--radius-lg)] text-lg',
};

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { variant = 'ghost', size = 'md', loading = false, disabled, icon, label, className, type = 'button', ...rest },
  ref
) {
  const isDisabled = disabled || loading;
  return (
    <button
      ref={ref}
      type={type}
      disabled={isDisabled}
      aria-label={label}
      aria-busy={loading || undefined}
      title={label}
      className={cn(
        'inline-flex items-center justify-center shrink-0',
        'transition-all duration-[var(--admin-duration-fast)] ease-[var(--admin-ease-out)]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-500)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]',
        'disabled:opacity-40 disabled:pointer-events-none',
        'active:scale-95 motion-reduce:active:scale-100',
        '[&>svg]:w-[1.15em] [&>svg]:h-[1.15em]',
        VARIANTS[variant],
        SIZES[size],
        className
      )}
      {...rest}
    >
      {loading ? <Spinner size={size === 'lg' ? 'md' : 'sm'} /> : icon}
    </button>
  );
});
