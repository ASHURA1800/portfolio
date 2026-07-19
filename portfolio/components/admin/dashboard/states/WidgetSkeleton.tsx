import { Skeleton } from '@/components/admin/ui/Skeleton';
import { DashboardWidget } from '@/components/admin/dashboard/layout';

export interface WidgetSkeletonProps {
  /** Number of label/value rows to fake below the header */
  rows?: number;
  className?: string;
}

/** Generic shimmer shape for the dashboard widgets (PortfolioProgress,
 *  SystemStatus, SessionWidget, etc.) — header row + N label/value rows.
 *  Deliberately generic since those widgets share the same dl-like shape. */
export function WidgetSkeleton({ rows = 4, className }: WidgetSkeletonProps) {
  return (
    <DashboardWidget glass className={className}>
      <div className="flex items-center justify-between">
        <Skeleton width="40%" height="0.875rem" />
        <Skeleton width="4.5rem" height="1.5rem" className="rounded-[var(--radius-full)]" />
      </div>
      <div className="mt-4 flex flex-col gap-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center justify-between">
            <Skeleton width="35%" height="0.75rem" />
            <Skeleton width="20%" height="0.75rem" />
          </div>
        ))}
      </div>
    </DashboardWidget>
  );
}
