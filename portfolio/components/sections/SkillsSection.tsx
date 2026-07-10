'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SectionContainer } from '@/components/ui/SectionContainer';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { MotionReveal } from '@/components/ui/MotionReveal';
import { PillTabs } from '@/components/ui/PillTabs';
import { SkillCard } from '@/components/sections/SkillCard';
import { skillCategories, skillsByCategory } from '@/lib/content/skills';
import type { Skill, SkillCategory } from '@/types';

const EASE = [0.22, 1, 0.36, 1] as const;

export function SkillsSection({ skills, skillsNote }: { skills: Skill[]; skillsNote: string }) {
  const availableCategories = useMemo(
    () => skillCategories.filter((cat) => skillsByCategory(skills, cat).length > 0),
    [skills],
  );
  const [active, setActive] = useState<SkillCategory | null>(availableCategories[0] ?? null);

  if (skills.length === 0 || !active) return null;

  const items = [...skillsByCategory(skills, active)].sort(
    (a, b) => b.proficiency - a.proficiency,
  );

  return (
    <SectionContainer id="skills" width="wide" className="relative">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute right-[-8%] top-[15%] h-72 w-72 rounded-full bg-accent2-500/8 blur-[100px]" />
      </div>

      <MotionReveal>
        <SectionHeading eyebrow="Toolkit" title="Skills & tools" description={skillsNote || undefined} />
      </MotionReveal>

      {/* Category tabs */}
      <MotionReveal delay={0.08} className="mt-10">
        <PillTabs
          options={availableCategories}
          active={active}
          onChange={setActive}
          layoutId="skills-tab-bg"
          label="Skill categories"
          idPrefix="skills"
        />
      </MotionReveal>

      {/* Skill cards grid */}
      <div
        role="tabpanel"
        id={`skills-panel-${active}`}
        aria-labelledby={`skills-tab-${active}`}
        className="mt-8"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: EASE }}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {items.map((s, i) => (
              <SkillCard key={s.id} skill={s} index={i} />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </SectionContainer>
  );
}
