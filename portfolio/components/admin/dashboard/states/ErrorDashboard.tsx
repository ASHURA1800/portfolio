'use client';

import { AlertTriangle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { EmptyState } from '@/components/admin/ui/EmptyState';
import { Button } from '@/components/admin/ui/Button';

export interface ErrorDashboardProps {
  /** Optional detail for debugging — not shown to the user by default */
  error?: Error;
  /** Called when the user clicks Retry. Defaults to a full router refresh. */
  onRetry?: () => void;
}

/** Generic dashboard error boundary fallback. Pairs naturally with a
 *  Next.js error.tsx, which passes `error` and `reset` — reset can be
 *  passed through as onRetry. */
export function ErrorDashboard({ error, onRetry }: ErrorDashboardProps) {
  const router = useRouter();
  const handleRetry = onRetry ?? (() => router.refresh());

  return (
    <EmptyState
      icon={<AlertTriangle />}
      title="Something went wrong loading the dashboard"
      description={
        error?.message
          ? `The dashboard couldn't load: ${error.message}`
          : "The dashboard couldn't load. This is usually temporary."
      }
      action={
        <Button variant="secondary" onClick={handleRetry}>
          Try again
        </Button>
      }
    />
  );
}
