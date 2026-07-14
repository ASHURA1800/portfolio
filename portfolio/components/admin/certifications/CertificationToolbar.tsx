'use client';

import { CrudToolbar } from '@/components/admin/crud/CrudToolbar';
import { CrudSearch } from '@/components/admin/crud/CrudSearch';
import { CrudFilters } from '@/components/admin/crud/CrudFilters';
import { FilterChip } from '@/components/admin/crud/FilterChip';
import { Select } from '@/components/admin/ui/Select';

export type SortOption = 'order' | 'date_desc' | 'date_asc' | 'title';
export type FilterOption = 'all' | 'featured' | 'active' | 'expired';

const FILTERS: FilterOption[] = ['all', 'featured', 'active', 'expired'];
const SORTS: { value: SortOption; label: string }[] = [
  { value: 'order', label: 'Manual order' },
  { value: 'date_desc', label: 'Newest first' },
  { value: 'date_asc', label: 'Oldest first' },
  { value: 'title', label: 'Title A–Z' },
];

interface CertificationToolbarProps {
  search: string;
  onSearch: (v: string) => void;
  sort: SortOption;
  onSort: (v: SortOption) => void;
  filter: FilterOption;
  onFilter: (v: FilterOption) => void;
  total: number;
  visible: number;
}

/** Search + filter chips + sort dropdown for the certifications grid,
 *  plus a "N of M" count so filtering feels legible. */
export function CertificationToolbar({ search, onSearch, sort, onSort, filter, onFilter, total, visible }: CertificationToolbarProps) {
  return (
    <div className="mb-5">
      <CrudToolbar
        search={<CrudSearch value={search} onChange={(e) => onSearch(e.target.value)} onClear={() => onSearch('')} placeholder="Search certifications…" />}
        filters={
          <CrudFilters>
            {FILTERS.map((f) => (
              <FilterChip key={f} active={filter === f} onClick={() => onFilter(f)}>
                {f === 'all' ? 'All' : f}
              </FilterChip>
            ))}
          </CrudFilters>
        }
        actions={
          <Select
            size="sm"
            value={sort}
            onChange={(e) => onSort(e.target.value as SortOption)}
            options={SORTS.map((s) => ({ value: s.value, label: s.label }))}
            aria-label="Sort certifications"
          />
        }
      />
      {(search.trim() || filter !== 'all') && (
        <p className="text-xs text-[var(--color-faint)] mt-2">{visible} of {total} shown</p>
      )}
    </div>
  );
}
