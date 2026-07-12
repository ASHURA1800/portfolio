import { DashboardWidget } from '@/components/admin/dashboard/layout';
import { Badge } from '@/components/admin/ui/Badge';
import Link from 'next/link';
import type { SectionStatus } from '@/lib/widgets/queries';

export interface InsightsPanelProps {
  /** Reuses PortfolioProgress's missing-sections list — no new query */
  missingSections: SectionStatus[];
  /** Reuses PortfolioProgress's upload status — no new query */
  uploads: { key: string; label: string; done: boolean }[];
}

interface Insight {
  key: string;
  message: string;
  href?: string;
  tone: 'info' | 'warning';
}

/** Insights — client-side UI recommendations derived entirely from data the
 *  page already fetched for other widgets. No API calls, no scoring model,
 *  no AI — just simple if/else rules over real counts, kept in the UI
 *  layer as the spec asks. */
export function InsightsPanel({ missingSections, uploads }: InsightsPanelProps) {
  const insights: Insight[] = [];

  for (const section of missingSections.slice(0, 3)) {
    insights.push({
      key: `missing-${section.key}`,
      message: `Add your first ${section.label.toLowerCase()} entry to fill out this section.`,
      href: section.href,
      tone: 'info',
    });
  }

  const missingUploads = uploads.filter((u) => !u.done);
  for (const upload of missingUploads) {
    insights.push({
      key: `upload-${upload.key}`,
      message: `${upload.label} hasn't been uploaded yet — visitors will see a blank slot.`,
      href: '/admin/profile',
      tone: 'warning',
    });
  }

  if (insights.length === 0) {
    insights.push({
      key: 'all-good',
      message: 'Your portfolio content looks complete. Nice work.',
      tone: 'info',
    });
  }

  return (
    <DashboardWidget glass className="flex flex-col gap-4">
      <h3 className="text-sm font-semibold text-[var(--color-ink)]">Insights</h3>
      <ul className="flex flex-col gap-2.5">
        {insights.slice(0, 4).map((insight) => (
          <li key={insight.key} className="flex items-start gap-2.5">
            <Badge tone={insight.tone === 'warning' ? 'warning' : 'info'} className="mt-0.5 shrink-0">
              {insight.tone === 'warning' ? '!' : 'i'}
            </Badge>
            {insight.href ? (
              <Link href={insight.href} className="text-xs text-[var(--color-muted)] hover:text-[var(--color-ink)] transition-colors">
                {insight.message}
              </Link>
            ) : (
              <span className="text-xs text-[var(--color-muted)]">{insight.message}</span>
            )}
          </li>
        ))}
      </ul>
    </DashboardWidget>
  );
}
