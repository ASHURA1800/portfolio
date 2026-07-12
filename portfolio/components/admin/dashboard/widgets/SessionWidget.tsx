import { DashboardWidget } from '@/components/admin/dashboard/layout';
import { Badge } from '@/components/admin/ui/Badge';

export interface SessionWidgetProps {
  email: string | null;
  /** SESSION_MAX_AGE in seconds, from lib/auth/constants — real value, not invented */
  maxAgeSeconds: number;
}

function formatDuration(seconds: number): string {
  const days = Math.round(seconds / 86400);
  return `${days} day${days === 1 ? '' : 's'}`;
}

/** SessionWidget — shows the signed-in email and the app's real session
 *  duration policy. No per-session issued-at/expiry countdown, because the
 *  JWT payload only carries { email } — that timestamp isn't available to
 *  read back out. */
export function SessionWidget({ email, maxAgeSeconds }: SessionWidgetProps) {
  const authenticated = !!email;

  return (
    <DashboardWidget glass className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[var(--color-ink)]">Session</h3>
        <Badge tone={authenticated ? 'success' : 'neutral'}>
          {authenticated ? 'Active' : 'None'}
        </Badge>
      </div>

      <dl className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs">
          <dt className="text-[var(--color-faint)]">Signed in as</dt>
          <dd className="text-[var(--color-muted)]">{email ?? '—'}</dd>
        </div>
        <div className="flex items-center justify-between text-xs">
          <dt className="text-[var(--color-faint)]">Session length</dt>
          <dd className="text-[var(--color-muted)]">{formatDuration(maxAgeSeconds)}</dd>
        </div>
      </dl>
    </DashboardWidget>
  );
}
