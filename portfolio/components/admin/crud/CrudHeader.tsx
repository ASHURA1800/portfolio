import type { ReactNode } from 'react';

export interface CrudHeaderProps {
  title: string;
  description?: string;
  /** Primary action(s) — typically the "+ New X" button, right-aligned */
  actions?: ReactNode;
}

/** Standard manager page header — title + description on the left,
 *  action buttons on the right. Purely presentational; no state. */
export function CrudHeader({ title, description, actions }: CrudHeaderProps) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between mb-6">
      <div className="min-w-0">
        <h1 className="text-2xl font-bold text-[var(--color-ink)]">{title}</h1>
        {description && (
          <p className="text-[var(--color-faint)] text-sm mt-1 max-w-2xl">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </div>
  );
}
