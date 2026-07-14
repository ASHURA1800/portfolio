import { SkeletonList } from '@/components/admin/ui/Skeleton';

export interface CrudLoadingProps {
  count?: number;
  className?: string;
}

/** Loading state for a CRUD list — reuses the existing SkeletonList
 *  (already shaped for admin-list-item rows) rather than a new shimmer
 *  pattern. */
export function CrudLoading({ count = 4, className }: CrudLoadingProps) {
  return (
    <div role="status" aria-live="polite" aria-label="Loading content">
      <SkeletonList count={count} className={className} />
      <span className="sr-only">Loading…</span>
    </div>
  );
}
