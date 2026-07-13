import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface CrudFiltersProps {
  children: ReactNode;
  className?: string;
}

/** Horizontal filter rail — holds Select/Chip/Dropdown controls the
 *  manager passes in. Scrolls on narrow viewports rather than wrapping
 *  awkwardly, since filter counts vary per manager. */
export function CrudFilters({ children, className }: CrudFiltersProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1 -mb-1',
        className
      )}
    >
      {children}
    </div>
  );
}
