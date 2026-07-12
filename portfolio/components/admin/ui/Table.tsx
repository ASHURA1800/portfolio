'use client';

import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { ArrowUp, ArrowDown, ChevronsUpDown } from 'lucide-react';
import { Checkbox } from './Checkbox';
import { SkeletonTable } from './Loading';
import { EmptyState } from './EmptyState';

export interface TableColumn<T> {
  key: string;
  header: string;
  /** Renders the cell; defaults to String(row[key]) if omitted. */
  render?: (row: T) => ReactNode;
  sortable?: boolean;
  align?: 'left' | 'right' | 'center';
  className?: string;
}

interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  /** Stable unique key per row, used for React keys and selection tracking. */
  getRowId: (row: T) => string;
  loading?: boolean;
  emptyState?: ReactNode;
  selectable?: boolean;
  selectedIds?: Set<string>;
  onSelectionChange?: (ids: Set<string>) => void;
  onRowClick?: (row: T) => void;
  className?: string;
}

type SortDirection = 'asc' | 'desc' | null;

/**
 * Generic data table: sticky header (via .admin-table CSS), client-side
 * column sorting, optional row selection with a header select-all
 * checkbox, loading skeleton, and empty state. Column definitions control
 * rendering so this one component serves every manager's list view instead
 * of each page building its own <table>.
 */
export function Table<T>({
  columns,
  data,
  getRowId,
  loading,
  emptyState,
  selectable,
  selectedIds,
  onSelectionChange,
  onRowClick,
  className,
}: TableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDirection>(null);

  const sorted = useMemo(() => {
    if (!sortKey || !sortDir) return data;
    const col = columns.find((c) => c.key === sortKey);
    if (!col) return data;

    return [...data].sort((a, b) => {
      const av = (a as Record<string, unknown>)[sortKey];
      const bv = (b as Record<string, unknown>)[sortKey];
      if (av == null && bv == null) return 0;
      if (av == null) return 1;
      if (bv == null) return -1;
      const cmp = typeof av === 'number' && typeof bv === 'number' ? av - bv : String(av).localeCompare(String(bv));
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [data, sortKey, sortDir, columns]);

  const toggleSort = (key: string) => {
    if (sortKey !== key) {
      setSortKey(key);
      setSortDir('asc');
    } else if (sortDir === 'asc') {
      setSortDir('desc');
    } else {
      setSortKey(null);
      setSortDir(null);
    }
  };

  const allSelected = selectable && data.length > 0 && data.every((row) => selectedIds?.has(getRowId(row)));
  const someSelected = selectable && !allSelected && data.some((row) => selectedIds?.has(getRowId(row)));

  const toggleAll = () => {
    if (!onSelectionChange) return;
    if (allSelected) {
      onSelectionChange(new Set());
    } else {
      onSelectionChange(new Set(data.map(getRowId)));
    }
  };

  const toggleRow = (id: string) => {
    if (!onSelectionChange || !selectedIds) return;
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    onSelectionChange(next);
  };

  if (loading) return <SkeletonTable rows={6} columns={columns.length + (selectable ? 1 : 0)} />;

  if (data.length === 0) {
    return (
      <div className="admin-table-wrap">
        {emptyState ?? <EmptyState title="No data" description="Nothing to show yet." />}
      </div>
    );
  }

  return (
    <div className={`admin-table-wrap ${className ?? ''}`}>
      <table className="admin-table">
        <thead>
          <tr>
            {selectable && (
              <th scope="col" style={{ width: '2.5rem' }}>
                <Checkbox
                  checked={allSelected}
                  ref={(el) => {
                    if (el) el.indeterminate = !!someSelected;
                  }}
                  onChange={toggleAll}
                  aria-label="Select all rows"
                />
              </th>
            )}
            {columns.map((col) => (
              <th
                key={col.key}
                scope="col"
                className={col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : undefined}
              >
                {col.sortable ? (
                  <button
                    type="button"
                    onClick={() => toggleSort(col.key)}
                    className="inline-flex items-center gap-1 hover:text-ink transition-colors"
                  >
                    {col.header}
                    {sortKey === col.key ? (
                      sortDir === 'asc' ? (
                        <ArrowUp size={12} aria-hidden="true" />
                      ) : (
                        <ArrowDown size={12} aria-hidden="true" />
                      )
                    ) : (
                      <ChevronsUpDown size={12} className="opacity-40" aria-hidden="true" />
                    )}
                    <span className="sr-only">
                      {sortKey === col.key ? `sorted ${sortDir}ending` : 'not sorted'}
                    </span>
                  </button>
                ) : (
                  col.header
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((row) => {
            const id = getRowId(row);
            const selected = selectedIds?.has(id);
            return (
              <tr
                key={id}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                className={onRowClick ? 'cursor-pointer' : undefined}
                data-selected={selected || undefined}
              >
                {selectable && (
                  <td onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={selected}
                      onChange={() => toggleRow(id)}
                      aria-label="Select row"
                    />
                  </td>
                )}
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : ''} ${col.className ?? ''}`}
                  >
                    {col.render ? col.render(row) : String((row as Record<string, unknown>)[col.key] ?? '')}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
