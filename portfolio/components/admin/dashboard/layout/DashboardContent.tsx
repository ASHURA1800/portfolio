import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface DashboardContentProps {
  children: ReactNode;
  className?: string;
}

/**
 * DashboardContent
 * The main body area below the Hero. Flex-grows to fill available height,
 * stacks sections with consistent vertical rhythm.
 */
export default function DashboardContent({ children, className }: DashboardContentProps) {
  return (
    <div
      className={cn('dashboard-content', className)}
      style={{
        flex: 1,
        paddingBottom: 'var(--admin-space-section)',
      }}
    >
      {children}
    </div>
  );
}
