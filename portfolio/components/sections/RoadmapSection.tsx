import { SectionContainer } from '@/components/ui/SectionContainer';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import type { RoadmapItem, RoadmapStatus } from '@/types';

// Renders what's next. Returns null when empty so the site never promises
// work that doesn't exist.

const STATUS_STYLE: Record<RoadmapStatus, string> = {
  done: 'text-faint line-through',
  'in-progress': 'text-ink',
  planned: 'text-muted',
};

const STATUS_MARK: Record<RoadmapStatus, string> = {
  done: '✓',
  'in-progress': '→',
  planned: '○',
};

export function RoadmapSection({ roadmap }: { roadmap: RoadmapItem[] }) {
  if (roadmap.length === 0) return null;

  return (
    <SectionContainer id="roadmap" width="wide">
      <SectionHeading eyebrow="Roadmap" title="What's" highlight="next" />

      <Reveal className="mt-14">
        <ul className="max-w-2xl space-y-3">
          {roadmap.map((item) => (
            <li key={item.task} className="flex items-baseline gap-3">
              <span
                aria-hidden="true"
                className="w-4 shrink-0 text-sm text-faint"
              >
                {STATUS_MARK[item.status]}
              </span>
              <span className={`text-sm ${STATUS_STYLE[item.status]}`}>{item.task}</span>
            </li>
          ))}
        </ul>
      </Reveal>
    </SectionContainer>
  );
}
