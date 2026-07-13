import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface CrudGridProps {
  children: ReactNode;
  /** Columns at the md breakpoint and up. Default 3, matching existing managers. */
  cols?: 2 | 3 | 4;
  className?: string;
}

const COLS: Record<NonNullable<CrudGridProps['cols']>, string> = {
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-3',
  4: 'md:grid-cols-4',
};

/** Card-grid layout for CRUD items — one column on mobile, `cols` columns
 *  from md up. Matches the existing grid pattern used by Skills and
 *  Certifications managers. */
export function CrudGrid({ children, cols = 3, className }: CrudGridProps) {
  return <div className={cn('grid grid-cols-1 gap-4', COLS[cols], className)}>{children}</div>;
}
