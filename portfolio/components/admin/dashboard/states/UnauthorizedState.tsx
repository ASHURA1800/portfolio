import Link from 'next/link';
import { Lock } from 'lucide-react';
import { EmptyState } from '@/components/admin/ui/EmptyState';
import { Button } from '@/components/admin/ui/Button';

export interface UnauthorizedStateProps {
  /** 401 = not signed in at all, 403 = signed in but not the admin email.
   *  Matches the two real failure modes in lib/auth/session.ts's
   *  requireAdmin(). */
  reason?: '401' | '403';
}

export function UnauthorizedState({ reason = '401' }: UnauthorizedStateProps) {
  const isForbidden = reason === '403';

  return (
    <EmptyState
      icon={<Lock />}
      title={isForbidden ? 'Access restricted' : 'Sign in required'}
      description={
        isForbidden
          ? "You're signed in, but this account isn't the portfolio admin."
          : 'Your session has ended. Sign back in to view the dashboard.'
      }
      action={
        <Link href="/admin/login">
          <Button variant="primary">Go to sign in</Button>
        </Link>
      }
    />
  );
}
