import { SectionContainer } from '@/components/ui/SectionContainer';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { MotionReveal } from '@/components/ui/MotionReveal';
import type { Learning } from '@/types';

export function LearningsSection({ learnings }: { learnings: Learning[] }) {
  if (learnings.length === 0) return null;

  return (
    <SectionContainer id="learnings" width="wide">
      <SectionHeading eyebrow="Learnings" title="Things I've figured out" />

      <ul className="mt-14 grid max-w-4xl gap-0 border-t border-border sm:grid-cols-2">
        {learnings.map((l, i) => (
          <MotionReveal key={l.title} delay={Math.min(i * 0.05, 0.4)} from="blur">
            <li className="border-b border-r border-border p-6 transition-colors duration-200 hover:bg-surface/40 sm:[&:nth-child(even)]:border-r-0">
              <div className="editorial-bar">
                <h3 className="text-sm font-semibold text-ink">{l.title}</h3>
                {l.description && (
                  <p className="mt-2 text-sm leading-relaxed text-muted">{l.description}</p>
                )}
              </div>
            </li>
          </MotionReveal>
        ))}
      </ul>
    </SectionContainer>
  );
}
