import { Skeleton } from '@/components/admin/ui/Skeleton';
import { DashboardWidget } from '@/components/admin/dashboard/layout';

export interface CardSkeletonProps {
  /** Show a fake progress bar row, for stat-card-shaped skeletons */
  withBar?: boolean;
  className?: string;
}

/** Shimmer placeholder shaped like a stat/widget card — label row, big
 *  value, optional bar — so layout doesn't jump when real data swaps in. */
export function CardSkeleton({ withBar = false, className }: CardSkeletonProps) {
  return (
    <DashboardWidget glass className={className}>
      <div className="flex items-center justify-between">
        <Skeleton width="40%" height="0.75rem" />
        <Skeleton width="2.25rem" height="2.25rem" className="rounded-[var(--radius-md,0.5rem)]" />
      </div>
      <div className="mt-3">
        <Skeleton width="55%" height="1.75rem" />
      </div>
      {withBar && (
        <div className="mt-3">
          <Skeleton width="100%" height="4px" />
        </div>
      )}
    </DashboardWidget>
  );
}
