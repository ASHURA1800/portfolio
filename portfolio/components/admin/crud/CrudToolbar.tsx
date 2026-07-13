import type { ReactNode } from 'react';

export interface CrudToolbarProps {
  /** Typically a CrudSearch */
  search?: ReactNode;
  /** Typically a CrudFilters */
  filters?: ReactNode;
  /** Secondary actions — sort dropdown, bulk-actions trigger, view toggle */
  actions?: ReactNode;
}

/** Row above the content area: search on the left, filters + secondary
 *  actions on the right. Stacks vertically on mobile. Purely layout — no
 *  state; the manager owns search/filter values. */
export function CrudToolbar({ search, filters, actions }: CrudToolbarProps) {
  if (!search && !filters && !actions) return null;

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-5">
      {search && <div className="w-full sm:max-w-xs">{search}</div>}
      {(filters || actions) && (
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap sm:shrink-0">
          {filters}
          {actions}
        </div>
      )}
    </div>
  );
}
