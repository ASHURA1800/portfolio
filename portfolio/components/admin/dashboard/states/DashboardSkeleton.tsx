import { Skeleton } from '@/components/admin/ui/Skeleton';
import { DashboardGrid } from '@/components/admin/dashboard/layout';
import { CardSkeleton } from './CardSkeleton';
import { ChartSkeleton } from './ChartSkeleton';
import { WidgetSkeleton } from './WidgetSkeleton';

/** Full-page shimmer matching the real dashboard's section order — hero,
 *  8 stat cards, 4 charts, 6 workspace widgets — so the loading state
 *  doesn't jump around once real content streams in. Intended for a
 *  route-level loading.tsx or a Suspense fallback around the page. */
export function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-8" role="status" aria-label="Loading dashboard" aria-hidden="true">
      {/* Hero */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <Skeleton width="14rem" height="1.5rem" />
          <Skeleton width="9rem" height="0.875rem" />
        </div>
        <Skeleton width="7rem" height="4rem" className="rounded-[var(--radius-lg)]" />
      </div>

      {/* Stat cards */}
      <DashboardGrid cols={4} mobileHalf>
        {Array.from({ length: 8 }).map((_, i) => (
          <CardSkeleton key={i} withBar={i % 2 === 0} />
        ))}
      </DashboardGrid>

      {/* Charts */}
      <DashboardGrid cols={2} gap="md">
        {Array.from({ length: 4 }).map((_, i) => (
          <ChartSkeleton key={i} />
        ))}
      </DashboardGrid>

      {/* Workspace widgets */}
      <DashboardGrid cols={3} gap="md">
        {Array.from({ length: 6 }).map((_, i) => (
          <WidgetSkeleton key={i} />
        ))}
      </DashboardGrid>
    </div>
  );
}
