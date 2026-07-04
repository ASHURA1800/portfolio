import { SectionContainer } from '@/components/ui/SectionContainer';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { TimelineItem } from '@/components/ui/TimelineItem';
import { formatDateRange } from '@/lib/utils';
import type { Experience } from '@/types';

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
      <SectionHeading eyebrow="Experience" title="Where I've" highlight="worked" />

      <Reveal className="mt-14">
        {experience.length > 0 ? (
          <div>
            {experience.map((e, i) => (
              <TimelineItem
                key={e.id}
                company={e.company}
                role={e.role}
                dateRange={formatDateRange(e)}
                location={e.location}
                type={e.type}
                description={e.description}
                impact={e.impact}
                techStack={e.tech_stack}
                isLast={i === experience.length - 1}
              />
            ))}
          </div>
        ) : (
          <p className="max-w-[60ch] text-lg leading-relaxed text-muted">
            {currentWork}
          </p>
        )}
      </Reveal>
    </SectionContainer>
  );
}
