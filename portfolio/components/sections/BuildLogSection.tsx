import { SectionContainer } from '@/components/ui/SectionContainer';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import type { BuildLogEntry, BuildStatus } from '@/types';

// Renders the running build log. Returns null when empty so nothing hollow
// ships — the section only appears once there are real, dated entries.

const STATUS_LABEL: Record<BuildStatus, string> = {
  shipped: 'Shipped',
  'in-progress': 'In progress',
  planned: 'Planned',
};

export function BuildLogSection({ entries }: { entries: BuildLogEntry[] }) {
  if (entries.length === 0) return null;

  return (
    <SectionContainer id="buildlog" width="wide">
      <SectionHeading eyebrow="Build log" title="What I've been" highlight="building" />

      <Reveal className="mt-14">
        <ol className="max-w-3xl border-t border-line">
          {entries.map((e) => (
            <li
              key={e.id}
              className="grid gap-1 border-b border-line py-6 md:grid-cols-12 md:gap-6"
            >
              <div className="md:col-span-3">
                <span className="text-sm text-faint">{e.date}</span>
              </div>
              <div className="md:col-span-9">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="font-medium text-ink">{e.title}</h3>
                  <span className="whitespace-nowrap text-xs uppercase tracking-[0.14em] text-faint">
                    {STATUS_LABEL[e.status]}
                  </span>
                </div>
                {e.summary && (
                  <p className="mt-1 text-sm leading-relaxed text-muted">{e.summary}</p>
                )}
              </div>
            </li>
          ))}
        </ol>
      </Reveal>
    </SectionContainer>
  );
}
