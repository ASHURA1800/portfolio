import { Skeleton } from '@/components/admin/ui/Skeleton';

export interface TimelineSkeletonProps {
  count?: number;
  className?: string;
}

/** Shimmer placeholder for vertical timeline/checklist content — a dot
 *  rail plus a label per row. Matches the shape of things like the
 *  Getting Started checklist or a build-log feed while data loads. */
export function TimelineSkeleton({ count = 5, className }: TimelineSkeletonProps) {
  return (
    <div className={className} role="status" aria-label="Loading timeline" aria-hidden="true">
      <ul className="flex flex-col gap-3">
        {Array.from({ length: count }).map((_, i) => (
          <li key={i} className="flex items-center gap-3">
            <Skeleton width="1.25rem" height="1.25rem" circle />
            <div className="flex-1 flex flex-col gap-1.5">
              <Skeleton width={i % 2 === 0 ? '60%' : '45%'} height="0.75rem" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
