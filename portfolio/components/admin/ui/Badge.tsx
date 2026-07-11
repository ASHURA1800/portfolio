import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export type BadgeTone = 'success' | 'error' | 'warning' | 'info' | 'neutral';
type BadgeSize = 'sm' | 'md';

export interface BadgeProps {
  children: ReactNode;
  tone?: BadgeTone;
  size?: BadgeSize;
  icon?: ReactNode;
  className?: string;
}

const SIZES: Record<BadgeSize, string> = {
  sm: 'h-5 px-2 text-[0.6875rem]',
  md: 'h-6 px-2.5 text-[var(--text-micro)]',
};

/** Thin wrapper over the .admin-badge utility from admin-theme.css (tone via data-attr). */
export function Badge({ children, tone = 'neutral', size = 'md', icon, className }: BadgeProps) {
  return (
    <span data-tone={tone} className={cn('admin-badge', SIZES[size], className)}>
      {icon && <span className="[&>svg]:w-3 [&>svg]:h-3 shrink-0">{icon}</span>}
      {children}
    </span>
  );
}
