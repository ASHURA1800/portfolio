import { SectionContainer } from '@/components/ui/SectionContainer';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal, staggerDelay } from '@/components/ui/Reveal';
import type { Learning } from '@/types';

export function LearningsSection({ learnings }: { learnings: Learning[] }) {
  if (learnings.length === 0) return null;

  return (
    <SectionContainer id="learnings" width="wide">
      <SectionHeading eyebrow="Learnings" title="Things I've figured out" />

      <ul className="mt-14 grid max-w-4xl gap-0 border-t border-line sm:grid-cols-2">
        {learnings.map((l, i) => (
          <Reveal key={l.title} delay={staggerDelay(i, 40)}>
            <li className="border-b border-r border-line p-6 sm:[&:nth-child(even)]:border-r-0">
              <div className="editorial-bar">
                <h3 className="text-sm font-semibold text-ink">{l.title}</h3>
                {l.description && (
                  <p className="mt-2 text-sm leading-relaxed text-muted">{l.description}</p>
                )}
              </div>
            </li>
          </Reveal>
        ))}
      </ul>
    </SectionContainer>
  );
}
