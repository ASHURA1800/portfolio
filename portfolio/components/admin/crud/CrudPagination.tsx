'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { IconButton } from '@/components/admin/ui/IconButton';

export interface CrudPaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

/** Page controls for a CRUD list. Purely presentational — the manager
 *  owns page state and re-fetching (several of the existing API routes,
 *  e.g. /api/projects, already accept page/limit query params server-side;
 *  this component doesn't call them itself). Renders nothing for a
 *  single page, since there's nothing to paginate. */
export function CrudPagination({ page, totalPages, onPageChange, className }: CrudPaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className={`flex items-center justify-center gap-3 pt-4 ${className ?? ''}`}>
      <IconButton
        label="Previous page"
        icon={<ChevronLeft size={16} />}
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        variant="secondary"
        size="sm"
      />
      <span className="text-xs text-[var(--color-faint)] tabular-nums">
        Page {page} of {totalPages}
      </span>
      <IconButton
        label="Next page"
        icon={<ChevronRight size={16} />}
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        variant="secondary"
        size="sm"
      />
    </div>
  );
}
