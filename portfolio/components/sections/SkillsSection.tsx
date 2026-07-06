import { SectionContainer } from '@/components/ui/SectionContainer';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { SkillMeter } from '@/components/ui/SkillMeter';
import { skillCategories, skillsByCategory } from '@/lib/content';
import type { Skill } from '@/types';

export function SkillsSection({ skills, skillsNote }: { skills: Skill[]; skillsNote: string }) {
  if (skills.length === 0) return null;

  return (
    <SectionContainer id="skills" width="wide">
      <SectionHeading
        eyebrow="Toolkit"
        title="Skills &"
        highlight="tools"
        description={skillsNote || undefined}
      />

      <Reveal className="mt-14 border-t border-line">
        {skillCategories.map((cat) => {
          // Strongest first; proficiency values are admin-managed.
          const items = [...skillsByCategory(skills, cat)].sort(
            (a, b) => b.proficiency - a.proficiency,
          );
          if (items.length === 0) return null;

          return (
            <div
              key={cat}
              className="grid gap-x-12 gap-y-4 border-b border-line py-10 md:grid-cols-12"
            >
              <div className="md:col-span-3">
                <h3 className="text-xs font-medium uppercase tracking-[0.18em] text-accent-400">
                  {cat}
                </h3>
              </div>
              <div className="grid gap-x-12 gap-y-2 sm:grid-cols-2 md:col-span-9">
                {items.map((s) => (
                  <SkillMeter
                    key={s.name}
                    name={s.name}
                    proficiency={s.proficiency}
                    years={s.years}
                    context={s.context}
                    icon={s.icon ?? undefined}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </Reveal>
    </SectionContainer>
  );
}
