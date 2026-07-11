import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  glow?: boolean;
}

/**
 * Elevated glass surface for content that should stand apart from the flat
 * admin-card default — modals, login card, featured panels. Built on the
 * public site's .card-glass token values via admin-glass-panel (blur +
 * saturate), not a new blur recipe.
 */
export function GlassCard({ children, glow = false, className, ...rest }: GlassCardProps) {
  return (
    <div
      className={cn(
        'admin-glass-panel rounded-[var(--radius-lg)] border p-[var(--admin-space-card)]',
        glow && 'shadow-[var(--shadow-glow-accent)]',
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
