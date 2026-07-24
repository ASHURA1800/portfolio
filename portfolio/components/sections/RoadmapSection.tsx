import { SectionContainer } from '@/components/ui/SectionContainer';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { MotionReveal } from '@/components/ui/MotionReveal';
import { RoadmapList } from '@/components/sections/RoadmapList';
import type { RoadmapItem } from '@/types';

export function RoadmapSection({ roadmap }: { roadmap: RoadmapItem[] }) {
  if (roadmap.length === 0) return null;

  return (
    <SectionContainer id="roadmap" width="wide">
      <SectionHeading eyebrow="Roadmap" title="What's next" />

      <MotionReveal className="glass mt-14 rounded-[var(--radius-xl)] p-6 sm:p-8">
        <RoadmapList roadmap={roadmap} />
      </MotionReveal>
    </SectionContainer>
  );
}
