import type { ReactNode } from 'react';
import { Inbox } from 'lucide-react';
import { EmptyState } from '@/components/admin/ui/EmptyState';

export interface CrudEmptyStateProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  /** Typically a "+ New X" button, so the empty state doubles as a call to action */
  action?: ReactNode;
}

/** Empty state for a CRUD list with zero items (or zero matches for the
 *  current search/filter). Reuses the existing EmptyState primitive. */
export function CrudEmptyState({ title, description, icon, action }: CrudEmptyStateProps) {
  return <EmptyState icon={icon ?? <Inbox />} title={title} description={description} action={action} />;
}
