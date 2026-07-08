import { SectionContainer } from '@/components/ui/SectionContainer';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import type { BuildLogEntry, BuildStatus } from '@/types';

const STATUS_COLOR: Record<BuildStatus, string> = {
  shipped: 'bg-success',
  'in-progress': 'bg-accent-500',
  planned: 'bg-faint',
};

const STATUS_LABEL: Record<BuildStatus, string> = {
  shipped: 'Shipped',
  'in-progress': 'In progress',
  planned: 'Planned',
};

export function BuildLogSection({ entries }: { entries: BuildLogEntry[] }) {
  if (entries.length === 0) return null;

  return (
    <SectionContainer id="buildlog" width="wide">
      <SectionHeading eyebrow="Build log" title="What I've been building" />

      <Reveal className="mt-14">
        <ol className="max-w-3xl">
          {entries.map((e, i) => (
            <li
              key={e.id}
              className="group grid grid-cols-1 gap-2 border-t border-line py-5 last:border-b md:grid-cols-[10rem_1fr_auto] md:gap-6 md:items-baseline"
            >
              <time className="text-xs tabular-nums text-faint">{e.date}</time>
              <div>
                <h3 className="text-sm font-medium text-ink">{e.title}</h3>
                {e.summary && (
                  <p className="mt-1 text-xs leading-relaxed text-muted">{e.summary}</p>
                )}
              </div>
              <div className="flex items-center gap-1.5 md:justify-end">
                <span
                  className={`status-dot ${STATUS_COLOR[e.status]}`}
                  aria-hidden="true"
                />
                <span className="text-[0.6875rem] uppercase tracking-[0.14em] text-faint">
                  {STATUS_LABEL[e.status]}
                </span>
              </div>
            </li>
          ))}
        </ol>
      </Reveal>
    </SectionContainer>
  );
}
