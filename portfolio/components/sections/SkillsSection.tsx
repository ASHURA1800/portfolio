import { SectionContainer } from '@/components/ui/SectionContainer';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { skillCategories, skillsByCategory } from '@/lib/content';
import type { Skill } from '@/types';

function SkillRow({ skill }: { skill: Skill }) {
  const pct = Math.max(0, Math.min(100, skill.proficiency));
  return (
    <div className="group flex items-center justify-between gap-6 py-3 border-b border-line/60 last:border-0">
      <div className="flex items-center gap-2.5 min-w-0">
        {skill.icon && (
          skill.icon.startsWith('/') || skill.icon.startsWith('http') ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={skill.icon} alt="" className="h-3.5 w-3.5 object-contain shrink-0" />
          ) : (
            <span className="text-xs leading-none shrink-0" aria-hidden="true">{skill.icon}</span>
          )
        )}
        <span className="text-sm text-ink truncate">{skill.name}</span>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        {skill.years && (
          <span className="hidden sm:block text-xs text-faint">{skill.years}</span>
        )}
        {/* Minimal bar */}
        <div className="w-16 h-px bg-line relative" aria-hidden="true">
          <div
            className="absolute inset-y-0 left-0 bg-accent-500/70"
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className="w-7 text-right text-xs tabular-nums text-faint">{pct}%</span>
      </div>
    </div>
  );
}

export function SkillsSection({ skills, skillsNote }: { skills: Skill[]; skillsNote: string }) {
  if (skills.length === 0) return null;

  return (
    <SectionContainer id="skills" width="wide">
      <SectionHeading
        eyebrow="Toolkit"
        title="Skills & tools"
        description={skillsNote || undefined}
      />

      <Reveal className="mt-14">
        <div className="grid gap-x-16 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
          {skillCategories.map((cat) => {
            const items = [...skillsByCategory(skills, cat)].sort(
              (a, b) => b.proficiency - a.proficiency,
            );
            if (items.length === 0) return null;

            return (
              <div key={cat}>
                <p className="mb-4 text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-accent-500/80">
                  {cat}
                </p>
                <div>
                  {items.map((s) => (
                    <SkillRow key={s.name} skill={s} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </Reveal>
    </SectionContainer>
  );
}
