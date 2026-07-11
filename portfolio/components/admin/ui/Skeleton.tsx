import { cn } from '@/lib/utils';

export interface SkeletonProps {
  /** CSS width, e.g. '100%', '8rem'. */
  width?: string;
  /** CSS height, e.g. '1rem', '3.5rem'. */
  height?: string;
  circle?: boolean;
  className?: string;
}

/** Single shimmer block. Built on the public .skeleton shimmer keyframe. */
export function Skeleton({ width = '100%', height = '1rem', circle = false, className }: SkeletonProps) {
  return (
    <span
      aria-hidden="true"
      className={cn('skeleton block', circle ? 'rounded-full' : 'rounded-[var(--radius-sm)]', className)}
      style={{ width, height }}
    />
  );
}

/** Preset: a row shaped like an admin-list-item, for CRUD list loading states. */
export function SkeletonRow({ className }: { className?: string }) {
  return (
    <div className={cn('admin-skeleton-row admin-list-item', className)} aria-hidden="true">
      <Skeleton width="2.5rem" height="2.5rem" circle />
      <div className="flex-1 flex flex-col gap-2">
        <Skeleton width="40%" height="0.875rem" />
        <Skeleton width="65%" height="0.75rem" />
      </div>
    </div>
  );
}

/** Preset: a stack of N skeleton rows — the common case for a manager's loading list. */
export function SkeletonList({ count = 4, className }: { count?: number; className?: string }) {
  return (
    <div className={cn('flex flex-col gap-2', className)} role="status" aria-label="Loading list">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonRow key={i} />
      ))}
    </div>
  );
}
