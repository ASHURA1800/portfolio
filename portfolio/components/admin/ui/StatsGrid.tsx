import type { ReactNode } from 'react';
import { DashboardGrid } from '@/components/admin/dashboard/layout';

export interface StatsGridProps {
  children: ReactNode;
  cols?: 1 | 2 | 3 | 4 | 6;
}

/** Responsive wrapper for a row of StatCardV2s. Thin shim over the existing
 *  DashboardGrid so stat sections stay visually consistent with the rest
 *  of the admin dashboard grid system. */
export function StatsGrid({ children, cols = 4 }: StatsGridProps) {
  return (
    <DashboardGrid cols={cols} mobileHalf>
      {children}
    </DashboardGrid>
  );
}
