'use client';

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Spinner } from './Spinner';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    'bg-[var(--color-accent-500)] text-white hover:bg-[var(--color-accent-400)] shadow-[var(--shadow-glow-accent)] disabled:shadow-none',
  secondary:
    'bg-[var(--color-surface)] text-[var(--color-ink)] border border-[var(--color-border)] hover:border-[var(--color-border-hover)] hover:bg-[var(--color-surface-hover)]',
  outline:
    'bg-transparent text-[var(--color-ink)] border border-[var(--color-border-hover)] hover:bg-[var(--color-surface-hover)]',
  ghost:
    'bg-transparent text-[var(--color-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-surface-hover)]',
  danger:
    'bg-[var(--color-error)] text-white hover:brightness-110',
};

const SIZES: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-xs gap-1.5 rounded-[var(--radius-md)]',
  md: 'h-10 px-4 text-sm gap-2 rounded-[var(--radius-md)]',
  lg: 'h-12 px-6 text-base gap-2.5 rounded-[var(--radius-lg)]',
};

const SPINNER_SIZE: Record<ButtonSize, 'xs' | 'sm' | 'md'> = {
  sm: 'xs',
  md: 'sm',
  lg: 'md',
};

/**
 * Admin action button. Loading state disables interaction and swaps the
 * leading icon (if any) for a spinner while keeping button width stable
 * via `aria-busy` + `disabled`, matching native form-submit semantics.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    icon,
    iconPosition = 'left',
    fullWidth = false,
    className,
    children,
    type = 'button',
    ...rest
  },
  ref
) {
  const isDisabled = disabled || loading;

  return (
    <button
      ref={ref}
      type={type}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      aria-disabled={isDisabled || undefined}
      className={cn(
        'inline-flex items-center justify-center font-medium select-none',
        'transition-all duration-[var(--admin-duration-fast)] ease-[var(--admin-ease-out)]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-500)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]',
        'disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed',
        'active:scale-[0.98] motion-reduce:active:scale-100',
        VARIANTS[variant],
        SIZES[size],
        fullWidth && 'w-full',
        className
      )}
      {...rest}
    >
      {loading ? (
        <Spinner size={SPINNER_SIZE[size]} className="shrink-0" />
      ) : (
        icon && iconPosition === 'left' && <span className="shrink-0 [&>svg]:w-[1em] [&>svg]:h-[1em]">{icon}</span>
      )}
      {children && <span className={loading ? 'opacity-70' : undefined}>{children}</span>}
      {!loading && icon && iconPosition === 'right' && (
        <span className="shrink-0 [&>svg]:w-[1em] [&>svg]:h-[1em]">{icon}</span>
      )}
    </button>
  );
});
