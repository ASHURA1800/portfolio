import { DashboardWidget } from '@/components/admin/dashboard/layout';
import { Progress } from '@/components/admin/ui/Progress';
import type { HealthScoreData } from '@/lib/widgets/queries';

export interface HealthScoreProps {
  data: HealthScoreData;
}

/** Health Score — composite of content depth across core sections, each
 *  capped at 3 items so no single section can dominate the score. Purely
 *  derived from real row counts (getHealthScore query). */
export function HealthScore({ data }: HealthScoreProps) {
  const { score, breakdown } = data;
  const tone = score >= 80 ? 'success' : score >= 40 ? 'warning' : 'error';

  return (
    <DashboardWidget glass className="flex flex-col gap-4">
      <div className="flex items-baseline justify-between">
        <h3 className="text-sm font-semibold text-[var(--color-ink)]">Health score</h3>
        <span className="text-2xl font-semibold tabular-nums text-[var(--color-ink)]">{score}</span>
      </div>

      <Progress value={score} tone={tone} />

      <ul className="flex flex-col gap-2 pt-1">
        {breakdown.map((b) => (
          <li key={b.label} className="flex items-center justify-between text-xs">
            <span className="text-[var(--color-faint)]">{b.label}</span>
            <span className="text-[var(--color-muted)] tabular-nums">
              {b.value}/{b.max}
            </span>
          </li>
        ))}
      </ul>
    </DashboardWidget>
  );
}
