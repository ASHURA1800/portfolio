import { Skeleton } from '@/components/admin/ui/Skeleton';
import { DashboardWidget } from '@/components/admin/dashboard/layout';

export interface ChartSkeletonProps {
  height?: number;
  className?: string;
}

/** Shimmer placeholder matching ChartContainer's header + canvas shape, so
 *  the analytics grid doesn't reflow when real charts mount. */
export function ChartSkeleton({ height = 260, className }: ChartSkeletonProps) {
  return (
    <DashboardWidget glass className={className}>
      <div className="flex flex-col gap-1.5">
        <Skeleton width="35%" height="0.875rem" />
        <Skeleton width="55%" height="0.6875rem" />
      </div>
      <div className="mt-3" style={{ height }}>
        <Skeleton width="100%" height="100%" className="rounded-[var(--radius-md,0.5rem)]" />
      </div>
    </DashboardWidget>
  );
}
