import { DashboardWidget } from '@/components/admin/dashboard/layout';
import { Badge } from '@/components/admin/ui/Badge';

export interface StorageWidgetProps {
  storageConfigured: boolean;
  uploads: { key: string; label: string; done: boolean }[];
}

/** StorageWidget — Vercel Blob is the only storage integration in this repo,
 *  and it exposes no usage/quota API here, so this widget reports what's
 *  actually knowable: whether the provider is configured, and which of the
 *  two uploadable assets (avatar, resume) exist. No invented byte counts. */
export function StorageWidget({ storageConfigured, uploads }: StorageWidgetProps) {
  return (
    <DashboardWidget glass className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[var(--color-ink)]">Storage</h3>
        <Badge tone={storageConfigured ? 'success' : 'warning'}>
          {storageConfigured ? 'Connected' : 'Not configured'}
        </Badge>
      </div>

      <ul className="flex flex-col gap-2">
        {uploads.map((u) => (
          <li key={u.key} className="flex items-center justify-between text-xs">
            <span className="text-[var(--color-muted)]">{u.label}</span>
            <span className={u.done ? 'text-[var(--color-success)]' : 'text-[var(--color-faint)]'}>
              {u.done ? 'Stored' : 'Empty'}
            </span>
          </li>
        ))}
      </ul>

      <p className="text-xs text-[var(--color-faint)] italic pt-1 border-t border-[var(--color-border)]">
        Usage and quota reporting isn&apos;t wired up yet.
      </p>
    </DashboardWidget>
  );
}
