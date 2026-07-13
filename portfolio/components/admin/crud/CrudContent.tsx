import type { ReactNode } from 'react';
import { CrudError } from './CrudError';

export interface CrudContentProps {
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  isEmpty?: boolean;
  emptyState?: ReactNode;
  loadingState?: ReactNode;
  children: ReactNode;
}

/** Central state switch for a CRUD page body: loading → error → empty →
 *  content, in that priority order. The manager still owns *why* each
 *  state is true (its own fetch/error/items.length logic) — this just
 *  centralizes the rendering branch so every manager doesn't hand-roll
 *  its own if/else chain. */
export function CrudContent({
  loading,
  error,
  onRetry,
  isEmpty,
  emptyState,
  loadingState,
  children,
}: CrudContentProps) {
  if (loading) return <>{loadingState}</>;
  if (error) return <CrudError message={error} onRetry={onRetry} />;
  if (isEmpty) return <>{emptyState}</>;
  return <>{children}</>;
}
