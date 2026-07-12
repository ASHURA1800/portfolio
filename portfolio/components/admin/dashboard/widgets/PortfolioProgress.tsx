import Link from 'next/link';
import { DashboardWidget } from '@/components/admin/dashboard/layout';
import { Progress } from '@/components/admin/ui/Progress';
import { Badge } from '@/components/admin/ui/Badge';
import type { PortfolioProgressData } from '@/lib/widgets/queries';

export interface PortfolioProgressProps {
  data: PortfolioProgressData;
}

/** Portfolio Progress — profile completion %, missing sections, and upload
 *  status for the two real uploadable assets (avatar, resume). All figures
 *  come from real DB reads; nothing here is simulated. */
export function PortfolioProgress({ data }: PortfolioProgressProps) {
  const { score, profileFieldsDone, profileFieldsTotal, missingSections, uploads } = data;
  const tone = score >= 80 ? 'success' : score >= 40 ? 'warning' : 'error';

  return (
    <DashboardWidget glass className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[var(--color-ink)]">Portfolio progress</h3>
        <Badge tone={tone}>{score}% complete</Badge>
      </div>

      <Progress value={score} tone={tone} />

      <div className="flex flex-col gap-1.5">
        <span className="text-xs text-[var(--color-faint)]">
          Profile fields — {profileFieldsDone}/{profileFieldsTotal} filled in
        </span>
      </div>

      {missingSections.length > 0 ? (
        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium text-[var(--color-faint)]">Missing sections</span>
          <ul className="flex flex-wrap gap-1.5">
            {missingSections.map((s) => (
              <li key={s.key}>
                <Link
                  href={s.href}
                  className="inline-flex items-center rounded-[var(--radius-full)] border border-[var(--color-border)] px-2 py-0.5 text-xs text-[var(--color-muted)] hover:text-[var(--color-ink)] hover:border-[var(--color-accent-500)] transition-colors"
                >
                  {s.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-xs text-[var(--color-success)]">All sections have content.</p>
      )}

      <div className="flex flex-col gap-1.5 pt-1 border-t border-[var(--color-border)]">
        <span className="text-xs font-medium text-[var(--color-faint)] mt-2">Uploads</span>
        <ul className="flex flex-col gap-1">
          {uploads.map((u) => (
            <li key={u.key} className="flex items-center justify-between text-xs">
              <span className="text-[var(--color-muted)]">{u.label}</span>
              <span className={u.done ? 'text-[var(--color-success)]' : 'text-[var(--color-faint)]'}>
                {u.done ? 'Uploaded' : 'Not uploaded'}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </DashboardWidget>
  );
}
