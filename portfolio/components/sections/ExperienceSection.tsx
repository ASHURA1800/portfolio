import { SectionContainer } from '@/components/ui/SectionContainer';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { formatDateRange } from '@/lib/utils';
import type { Experience } from '@/types';

function ExperienceItem({
  experience: e,
  isLast,
}: {
  experience: Experience;
  isLast: boolean;
}) {
  return (
    <div className="relative grid grid-cols-1 gap-4 md:grid-cols-[14rem_1fr] pb-12 last:pb-0">
      {/* Left: date + meta */}
      <div className="md:pt-0.5">
        <p className="text-xs tabular-nums text-faint tracking-wide">{formatDateRange(e)}</p>
        {(e.type || e.location) && (
          <p className="mt-1 text-xs text-faint/70">
            {e.type && <span className="capitalize">{e.type}</span>}
            {e.type && e.location && <span className="mx-1.5">·</span>}
            {e.location && <span>{e.location}</span>}
          </p>
        )}
      </div>

      {/* Right: content */}
      <div className="relative pl-5 border-l border-line">
        {/* Timeline node */}
        <span
          className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-accent-500 bg-bg"
          aria-hidden="true"
        />

        <h3 className="text-base font-semibold text-ink leading-tight">{e.company}</h3>
        <p className="mt-0.5 text-sm text-muted">{e.role}</p>

        {e.description && (
          <p className="mt-3 max-w-[62ch] text-sm leading-relaxed text-muted">{e.description}</p>
        )}

        {e.impact && e.impact.length > 0 && (
          <ul className="mt-3 space-y-1.5">
            {e.impact.map((it, i) => (
              <li key={i} className="flex gap-2.5 max-w-[62ch]">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent-500/60" aria-hidden="true" />
                <span className="text-sm leading-relaxed text-muted">{it}</span>
              </li>
            ))}
          </ul>
        )}

        {e.tech_stack && e.tech_stack.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {e.tech_stack.map((t) => (
              <span key={t} className="tech-pill">{t}</span>
            ))}
          </div>
        )}

        {/* Connector line down — except last */}
        {!isLast && (
          <span
            className="absolute bottom-0 -left-px top-5 w-px bg-line"
            aria-hidden="true"
          />
        )}
      </div>
    </div>
  );
}

export function ExperienceSection({
  experience,
  currentWork,
}: {
  experience: Experience[];
  currentWork: string;
}) {
  if (experience.length === 0 && !currentWork.trim()) return null;

  return (
    <SectionContainer id="experience" width="default">
      <SectionHeading eyebrow="Experience" title="Where I've worked" />

      <Reveal className="mt-14">
        {experience.length > 0 ? (
          <div className="space-y-0">
            {experience.map((e, i) => (
              <ExperienceItem key={e.id} experience={e} isLast={i === experience.length - 1} />
            ))}
          </div>
        ) : (
          <p className="max-w-[60ch] text-[length:var(--text-lead)] leading-relaxed text-muted">
            {currentWork}
          </p>
        )}
      </Reveal>
    </SectionContainer>
  );
}
