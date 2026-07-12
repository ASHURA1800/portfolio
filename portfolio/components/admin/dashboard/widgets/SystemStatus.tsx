import { DashboardWidget } from '@/components/admin/dashboard/layout';
import { Badge } from '@/components/admin/ui/Badge';

export interface SystemStatusProps {
  /** Session email — the only session detail the JWT payload actually carries */
  email: string | null;
  /** Whether BLOB_READ_WRITE_TOKEN (or equivalent) is configured — real env check */
  storageConfigured: boolean;
}

/** System Status — shows only what the app can genuinely verify right now.
 *  There's no last-login timestamp stored anywhere and no backup system
 *  wired up, so those rows say so plainly instead of inventing values. */
export function SystemStatus({ email, storageConfigured }: SystemStatusProps) {
  const authenticated = !!email;

  return (
    <DashboardWidget glass className="flex flex-col gap-4">
      <h3 className="text-sm font-semibold text-[var(--color-ink)]">System status</h3>

      <dl className="flex flex-col gap-3">
        <Row
          label="Authentication"
          value={authenticated ? 'Signed in' : 'Not signed in'}
          tone={authenticated ? 'success' : 'error'}
        />
        <Row label="Session" value={email ?? '—'} tone="neutral" />
        <Row
          label="Storage"
          value={storageConfigured ? 'Connected' : 'Not configured'}
          tone={storageConfigured ? 'success' : 'warning'}
        />
        <Row label="Last login" value="Not tracked yet" tone="neutral" muted />
        <Row label="Backups" value="Not set up" tone="neutral" muted />
      </dl>
    </DashboardWidget>
  );
}

function Row({
  label,
  value,
  tone,
  muted = false,
}: {
  label: string;
  value: string;
  tone: 'success' | 'error' | 'warning' | 'neutral';
  muted?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-xs text-[var(--color-faint)]">{label}</dt>
      <dd className={muted ? 'text-xs text-[var(--color-faint)] italic' : ''}>
        {muted ? value : <Badge tone={tone}>{value}</Badge>}
      </dd>
    </div>
  );
}
