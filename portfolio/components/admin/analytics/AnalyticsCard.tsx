import type { ReactNode } from 'react';
import { DashboardWidget } from '@/components/admin/dashboard/layout';

export interface AnalyticsCardProps {
  children: ReactNode;
  className?: string;
}

/** Thin wrapper so chart cards match the glass/border treatment every
 *  other dashboard widget already uses. */
export function AnalyticsCard({ children, className }: AnalyticsCardProps) {
  return (
    <DashboardWidget glass className={className}>
      {children}
    </DashboardWidget>
  );
}
