'use client';

import { LayoutGrid, List } from 'lucide-react';
import type { ProjectStatus } from '@/types';
import { CrudToolbar, CrudSearch, CrudFilters } from '@/components/admin/crud';
import { Select } from '@/components/admin/ui/Select';
import { SortDropdown, type SortOption } from '@/components/admin/ui/SortDropdown';
import { IconButton } from '@/components/admin/ui/IconButton';
import { cn } from '@/lib/utils';

const STATUS_OPTIONS = [
  { value: '', label: 'All statuses' },
  { value: 'live', label: 'Live' },
  { value: 'in-progress', label: 'In progress' },
  { value: 'archived', label: 'Archived' },
  { value: 'concept', label: 'Concept' },
];

const SORT_OPTIONS: SortOption[] = [
  { key: 'order', label: 'Manual order' },
  { key: 'title', label: 'Title A–Z' },
  { key: 'year', label: 'Year, newest' },
];

export interface ProjectsToolbarProps {
  search: string;
  onSearchChange: (v: string) => void;
  status: ProjectStatus | '';
  onStatusChange: (v: ProjectStatus | '') => void;
  sort: string;
  onSortChange: (v: string) => void;
  view: 'grid' | 'list';
  onViewChange: (v: 'grid' | 'list') => void;
}

/** Search + status filter + sort + view toggle, all client-side over the
 *  already-loaded items array — no new fetching. Composes the shared
 *  CRUD toolbar primitives. */
export function ProjectsToolbar({
  search,
  onSearchChange,
  status,
  onStatusChange,
  sort,
  onSortChange,
  view,
  onViewChange,
}: ProjectsToolbarProps) {
  return (
    <CrudToolbar
      search={
        <CrudSearch
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          onClear={() => onSearchChange('')}
          placeholder="Search projects…"
        />
      }
      filters={
        <CrudFilters>
          <Select
            value={status}
            onChange={(e) => onStatusChange(e.target.value as ProjectStatus | '')}
            options={STATUS_OPTIONS}
            size="sm"
            aria-label="Filter by status"
          />
        </CrudFilters>
      }
      actions={
        <div className="flex items-center gap-2">
          <SortDropdown options={SORT_OPTIONS} active={sort} onChange={onSortChange} />
          <div className="flex items-center rounded-[var(--radius-md)] border border-[var(--color-border)] p-0.5">
            <IconButton
              label="Grid view"
              icon={<LayoutGrid size={14} />}
              size="sm"
              variant={view === 'grid' ? 'secondary' : 'ghost'}
              onClick={() => onViewChange('grid')}
              className={cn(view === 'grid' && 'bg-[var(--color-surface-hover)]')}
            />
            <IconButton
              label="List view"
              icon={<List size={14} />}
              size="sm"
              variant={view === 'list' ? 'secondary' : 'ghost'}
              onClick={() => onViewChange('list')}
              className={cn(view === 'list' && 'bg-[var(--color-surface-hover)]')}
            />
          </div>
        </div>
      }
    />
  );
}
