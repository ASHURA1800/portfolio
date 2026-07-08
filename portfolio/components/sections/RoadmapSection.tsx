import { SectionContainer } from '@/components/ui/SectionContainer';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import type { RoadmapItem, RoadmapStatus } from '@/types';

const STATUS_STYLE: Record<RoadmapStatus, string> = {
  done: 'text-faint line-through',
  'in-progress': 'text-ink',
  planned: 'text-muted',
};

const STATUS_DOT: Record<RoadmapStatus, string> = {
  done: 'bg-success/50',
  'in-progress': 'bg-accent-500',
  planned: 'bg-line',
};

const STATUS_LABEL: Record<RoadmapStatus, string> = {
  done: 'Done',
  'in-progress': 'In progress',
  planned: 'Planned',
};

export function RoadmapSection({ roadmap }: { roadmap: RoadmapItem[] }) {
  if (roadmap.length === 0) return null;

  return (
    <SectionContainer id="roadmap" width="wide">
      <SectionHeading eyebrow="Roadmap" title="What's next" />

      <Reveal className="mt-14">
        <ul className="max-w-2xl space-y-0 border-t border-line">
          {roadmap.map((item) => (
            <li
              key={item.task}
              className="flex items-center gap-4 border-b border-line py-4"
            >
              <span
                className={`status-dot shrink-0 ${STATUS_DOT[item.status]}`}
                aria-hidden="true"
              />
              <span className={`flex-1 text-sm ${STATUS_STYLE[item.status]}`}>
                {item.task}
              </span>
              <span className="text-[0.625rem] uppercase tracking-[0.14em] text-faint/70 shrink-0">
                {STATUS_LABEL[item.status]}
              </span>
            </li>
          ))}
        </ul>
      </Reveal>
    </SectionContainer>
  );
}
