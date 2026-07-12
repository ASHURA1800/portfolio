import { type ReactNode, type CSSProperties } from 'react';
import { cn } from '@/lib/utils';

interface DashboardContainerProps {
  children: ReactNode;
  className?: string;
  /** Remove default top padding — used when container follows hero */
  flush?: boolean;
  style?: CSSProperties;
}

/**
 * DashboardContainer
 * A width-constrained, horizontally-centered container that inherits the
 * admin page max-width token. Used inside DashboardLayout to wrap any block
 * that should be constrained and centered (not edge-to-edge).
 *
 * The `flush` prop removes the top gap, for sections that sit directly
 * below the hero without extra whitespace.
 */
export default function DashboardContainer({
  children,
  className,
  flush = false,
  style,
}: DashboardContainerProps) {
  return (
    <div
      className={cn('dashboard-container', className)}
      style={{
        width: '100%',
        paddingTop: flush ? 0 : 'var(--admin-space-section)',
        ...style,
      }}
    >
      {children}
    </div>
  );
}
