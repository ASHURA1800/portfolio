import { SectionContainer } from '@/components/ui/SectionContainer';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { MotionReveal } from '@/components/ui/MotionReveal';
import { BuildLogList } from '@/components/sections/BuildLogList';
import type { BuildLogEntry } from '@/types';

export function BuildLogSection({ entries }: { entries: BuildLogEntry[] }) {
  if (entries.length === 0) return null;

  return (
    <SectionContainer id="buildlog" width="wide">
      <SectionHeading eyebrow="Build log" title="What I've been building" />

      <MotionReveal className="mt-14">
        <BuildLogList entries={entries} />
      </MotionReveal>
    </SectionContainer>
  );
}
