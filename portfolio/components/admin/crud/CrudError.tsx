'use client';

import { AlertTriangle } from 'lucide-react';
import { EmptyState } from '@/components/admin/ui/EmptyState';
import { Button } from '@/components/admin/ui/Button';

export interface CrudErrorProps {
  /** Optional detail — shown as-is, not swallowed */
  message?: string;
  onRetry?: () => void;
}

/** Error state for a CRUD list/page. Distinct from the inline Alert used
 *  for form-submit errors (which stays in the manager itself) — this is
 *  for "the initial data load failed" style failures. Retry is a real
 *  callback the manager supplies (e.g. refetch or router.refresh), never
 *  a no-op button. */
export function CrudError({ message, onRetry }: CrudErrorProps) {
  return (
    <EmptyState
      icon={<AlertTriangle />}
      title="Something went wrong"
      description={message ?? 'This section failed to load. Please try again.'}
      action={
        onRetry ? (
          <Button variant="secondary" onClick={onRetry}>
            Try again
          </Button>
        ) : undefined
      }
    />
  );
}
