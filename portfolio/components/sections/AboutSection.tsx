'use client';

import { motion } from 'motion/react';
import { MapPin } from 'lucide-react';
import { SectionContainer } from '@/components/ui/SectionContainer';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { MotionReveal } from '@/components/ui/MotionReveal';
import { AnimatedStat } from '@/components/ui/AnimatedStat';
import { AboutPortrait } from '@/components/sections/AboutPortrait';
import { AboutTimeline } from '@/components/sections/AboutTimeline';
import { skillCategories, skillsByCategory } from '@/lib/content/skills';
import type { Profile, Skill, Experience } from '@/types';

const EASE = [0.22, 1, 0.36, 1] as const;

function StoryBlock({ label, body, index }: { label: string; body: string; index: number }) {
  return (
    <MotionReveal delay={index * 0.08} className="group">
      <p className="mb-2 text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-faint">
        {label}
      </p>
      <p className="max-w-[60ch] text-[length:var(--text-lead)] leading-relaxed text-muted">
        {body}
      </p>
    </MotionReveal>
  );
}

interface AboutStat {
  value: number;
  label: string;
  suffix?: string;
}

export function AboutSection({
  profile,
  skills,
  experience = [],
  stats,
}: {
  profile: Profile;
  skills: Skill[];
  experience?: Experience[];
  stats?: AboutStat[];
}) {
  const { about, location, avatar, name, username } = profile;

  const blocks = [
    { label: 'The journey', body: about.journey },
    { label: 'Right now', body: about.currentFocus },
    { label: 'How I work', body: about.philosophy },
    { label: 'Learning', body: about.learning },
  ].filter((b) => b.body.trim() !== '');

  const hasSkills = skillCategories.some((cat) => skillsByCategory(skills, cat).length > 0);
  const hasLocation = !!location?.trim();
  const hasTimeline = experience.length > 0;
  const hasStats = !!stats && stats.length > 0;

  if (!blocks.length && !hasSkills && !hasLocation && !hasTimeline) return null;

  return (
    <SectionContainer id="about" width="wide" className="relative">
      {/* Background glow, ambient to the whole section */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[-10%] top-[10%] h-72 w-72 rounded-full bg-accent-500/8 blur-[100px]" />
        <div className="absolute right-[-5%] bottom-[5%] h-80 w-80 rounded-full bg-accent2-500/8 blur-[110px]" />
      </div>

      <MotionReveal>
        <SectionHeading eyebrow="About" title="A bit of background" />
      </MotionReveal>

      <div className="mt-14 grid gap-14 lg:grid-cols-12 lg:gap-12">
        {/* Portrait column */}
        {avatar && (
          <div className="lg:col-span-4">
            <MotionReveal from="scale" parallax={24}>
              <AboutPortrait src={avatar} alt={name || username || 'Profile photo'} />
            </MotionReveal>
          </div>
        )}

        {/* Story + timeline column */}
        <div className={avatar ? 'lg:col-span-8' : 'lg:col-span-12'}>
          <div className="grid gap-14 md:grid-cols-12 md:gap-10">
            {blocks.length > 0 && (
              <div className="space-y-10 md:col-span-7">
                {blocks.map((b, i) => (
                  <StoryBlock key={b.label} label={b.label} body={b.body} index={i} />
                ))}
              </div>
            )}

            {(hasSkills || hasLocation || hasTimeline) && (
              <MotionReveal
                delay={0.1}
                from="right"
                className={
                  blocks.length > 0
                    ? 'md:col-span-5 md:border-l md:border-border md:pl-8'
                    : 'md:col-span-12'
                }
              >
                <div className="card-glass space-y-8 rounded-[var(--radius-xl)] p-6 md:sticky md:top-24">
                  {hasSkills && (
                    <div>
                      <p className="mb-4 text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-faint">
                        Technologies
                      </p>
                      <div className="space-y-5">
                        {skillCategories.map((cat) => {
                          const items = skillsByCategory(skills, cat);
                          if (!items.length) return null;
                          return (
                            <div key={cat}>
                              <div className="mb-2 text-[0.625rem] uppercase tracking-[0.16em] text-faint/60">
                                {cat}
                              </div>
                              <div className="flex flex-wrap gap-1.5">
                                {items.map((s) => (
                                  <motion.span
                                    key={s.name}
                                    whileHover={{ y: -2, borderColor: 'var(--color-accent-400)' }}
                                    transition={{ duration: 0.18, ease: EASE }}
                                    className="tech-pill cursor-default hover:text-ink"
                                  >
                                    {s.name}
                                  </motion.span>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {hasTimeline && (
                    <div>
                      <p className="mb-4 text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-faint">
                        Career at a glance
                      </p>
                      <AboutTimeline experience={experience} />
                    </div>
                  )}

                  {hasLocation && (
                    <div className="flex items-center gap-2 border-t border-border pt-5 text-sm text-ink">
                      <MapPin size={14} className="text-faint" strokeWidth={1.5} />
                      {location}
                    </div>
                  )}
                </div>
              </MotionReveal>
            )}
          </div>

          {/* Animated counters */}
          {hasStats && (
            <MotionReveal delay={0.15} className="mt-14 grid grid-cols-3 gap-6 border-t border-border pt-8">
              {stats!.map((s, i) => (
                <AnimatedStat key={s.label} value={s.value} label={s.label} suffix={s.suffix} delay={i * 0.1} />
              ))}
            </MotionReveal>
          )}
        </div>
      </div>
    </SectionContainer>
  );
}
