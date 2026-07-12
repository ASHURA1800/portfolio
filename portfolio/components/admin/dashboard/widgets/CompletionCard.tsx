import Link from 'next/link';
import { DashboardWidget } from '@/components/admin/dashboard/layout';

export interface CompletionItem {
  key: string;
  label: string;
  href: string;
  done: boolean;
}

export interface CompletionCardProps {
  items: CompletionItem[];
}

/** CompletionCard — compact checklist reusing the same completion data the
 *  hero's radial ring already computes; just a different, denser view of
 *  the same real booleans. */
export function CompletionCard({ items }: CompletionCardProps) {
  const done = items.filter((i) => i.done).length;

  return (
    <DashboardWidget glass className="flex flex-col gap-3">
      <div className="flex items-baseline justify-between">
        <h3 className="text-sm font-semibold text-[var(--color-ink)]">Completion</h3>
        <span className="text-xs text-[var(--color-faint)] tabular-nums">
          {done}/{items.length}
        </span>
      </div>
      <ul className="flex flex-col gap-1.5">
        {items.map((item) => (
          <li key={item.key}>
            <Link href={item.href} className="flex items-center gap-2 group">
              <span
                className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                  item.done
                    ? 'bg-[var(--color-success)]/15 text-[var(--color-success)]'
                    : 'bg-[var(--color-border)] text-[var(--color-faint)]'
                }`}
              >
                {item.done ? '✓' : ''}
              </span>
              <span
                className={`text-xs transition-colors ${
                  item.done
                    ? 'text-[var(--color-faint)] line-through'
                    : 'text-[var(--color-muted)] group-hover:text-[var(--color-ink)]'
                }`}
              >
                {item.label}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </DashboardWidget>
  );
}
