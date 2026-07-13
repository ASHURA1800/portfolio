'use client';

import { SearchInput, type SearchInputProps } from '@/components/admin/ui/SearchInput';

export type CrudSearchProps = SearchInputProps;

/** Search field for a CRUD toolbar. Thin re-export of the existing
 *  SearchInput so managers don't reach into components/admin/ui directly —
 *  keeps the CRUD framework's import surface self-contained. No new
 *  search logic; the manager still owns the filtering itself. */
export function CrudSearch(props: CrudSearchProps) {
  return <SearchInput {...props} />;
}
