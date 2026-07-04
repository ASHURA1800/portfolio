import { SectionContainer } from '@/components/ui/SectionContainer';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import type { Learning } from '@/types';

// Renders concrete learnings. Returns null when empty — no filler.
export function LearningsSection({ learnings }: { learnings: Learning[] }) {
  if (learnings.length === 0) return null;

  return (
    <SectionContainer id="learnings" width="wide">
      <SectionHeading eyebrow="Learnings" title="Things I've" highlight="figured out" />

      <Reveal className="mt-14">
        <ul className="grid max-w-4xl gap-x-12 gap-y-8 sm:grid-cols-2">
          {learnings.map((l) => (
            <li key={l.title}>
              <h3 className="font-medium text-ink">{l.title}</h3>
              {l.description && (
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{l.description}</p>
              )}
            </li>
          ))}
        </ul>
      </Reveal>
    </SectionContainer>
  );
}
