import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

// AdminTable is the CRUD-facing name for the Table primitive built in
// Phase 2 — it already covers sticky header, sort, row-select, bulk-action
// slot, loading skeleton, and empty state, so this file doesn't duplicate
// that logic. It re-exports under the name this phase's spec asks for, and
// adds TableRow/TableCell for admin pages that render a custom list (card
// rows, not a literal <table>) but still want consistent spacing/borders.
export { Table as AdminTable, type TableColumn } from './Table';

/** A single custom list row — for admin pages using card-style rows instead of a <table>. */
export function TableRow({
  children,
  onClick,
  selected,
  className,
}: {
  children: ReactNode;
  onClick?: () => void;
  selected?: boolean;
  className?: string;
}) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'flex items-center gap-4 border-b border-border px-4 py-3 transition-colors last:border-b-0 hover:bg-surface/50',
        onClick && 'cursor-pointer',
        selected && 'bg-accent-500/5',
        className,
      )}
    >
      {children}
    </div>
  );
}

/** A single cell within a TableRow — consistent truncation/alignment. */
export function TableCell({
  children,
  align = 'left',
  className,
}: {
  children: ReactNode;
  align?: 'left' | 'right' | 'center';
  className?: string;
}) {
  return (
    <div
      className={cn(
        'min-w-0 flex-1 truncate text-sm text-ink',
        align === 'right' && 'text-right',
        align === 'center' && 'text-center',
        className,
      )}
    >
      {children}
    </div>
  );
}
