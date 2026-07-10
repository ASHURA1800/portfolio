'use client';

import { useRef } from 'react';
import { motion, useScroll, useSpring, useReducedMotion } from 'motion/react';
import { SectionContainer } from '@/components/ui/SectionContainer';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { MotionReveal } from '@/components/ui/MotionReveal';
import { TimelineEntry } from '@/components/sections/TimelineEntry';
import type { Experience } from '@/types';

export function ExperienceSection({
  experience,
  currentWork,
}: {
  experience: Experience[];
  currentWork: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start 75%', 'end 60%'],
  });
  const lineHeight = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    restDelta: 0.001,
  });

  if (experience.length === 0 && !currentWork.trim()) return null;

  return (
    <SectionContainer id="experience" width="default">
      <MotionReveal>
        <SectionHeading eyebrow="Experience" title="Where I've worked" />
      </MotionReveal>

      {experience.length > 0 ? (
        <div ref={trackRef} className="relative mt-16">
          {/* Static track */}
          <div
            className="absolute left-5 top-0 bottom-0 hidden w-px bg-border md:block"
            aria-hidden="true"
          />
          {/* Animated fill line — grows as the section scrolls through view */}
          <motion.div
            className="absolute left-5 top-0 hidden w-px origin-top bg-gradient-to-b from-accent-500 via-accent-400 to-accent2-400 md:block"
            style={{
              scaleY: reduceMotion ? 1 : lineHeight,
              height: '100%',
            }}
            aria-hidden="true"
          />

          <div className="space-y-14 md:space-y-16">
            {experience.map((e, i) => (
              <TimelineEntry key={e.id} experience={e} index={i} />
            ))}
          </div>
        </div>
      ) : (
        <MotionReveal delay={0.1} className="mt-14">
          <p className="max-w-[60ch] text-[length:var(--text-lead)] leading-relaxed text-muted">
            {currentWork}
          </p>
        </MotionReveal>
      )}
    </SectionContainer>
  );
}
