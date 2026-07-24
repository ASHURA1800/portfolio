'use client';

import { ArrowUpRight, ArrowDown } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import type { Profile, Social } from '@/types';
import { Button } from '@/components/ui/Button';
import { SocialLinks } from '@/components/ui/SocialLinks';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { RotatingText } from '@/components/ui/RotatingText';
import { AnimatedStat } from '@/components/ui/AnimatedStat';
import { HeroVisualGate } from '@/components/sections/HeroVisualGate';
import { useAnalytics } from '@/hooks/useAnalytics';

export interface HeroStat {
  value: number;
  label: string;
  suffix?: string;
}

interface HeroSectionProps {
  profile: Profile;
  socials: Social[];
  /** Rotating role labels shown after the greeting. Falls back to profile.title alone. */
  roles?: string[];
  /** Optional stat blocks (e.g. years experience, projects shipped). */
  stats?: HeroStat[];
}

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.09, delayChildren: 0.05 },
  },
};

const item = {
  hidden: { opacity: 0, y: 18, filter: 'blur(6px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export function HeroSection({ profile, socials, roles, stats }: HeroSectionProps) {
  const { track } = useAnalytics();
  const reduceMotion = useReducedMotion();
  const displayName = profile.name || profile.username;
  const roleWords = roles && roles.length > 0 ? roles : profile.title ? [profile.title] : [];

  return (
    <section
      id="hero"
      className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden px-[var(--space-gutter)] pb-16 pt-28"
    >
      {/* ================= Background layers ================= */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        {/* Animated mesh gradient / aurora */}
        <motion.div
          className="blob absolute left-1/2 top-[-10%] h-[70vh] w-[90vw] -translate-x-1/2 rounded-full opacity-70"
          style={{
            background:
              'radial-gradient(ellipse 60% 50% at 30% 30%, var(--hero-glow-1), transparent 60%), radial-gradient(ellipse 50% 45% at 75% 55%, var(--hero-glow-2), transparent 60%)',
          }}
          animate={
            reduceMotion
              ? {}
              : {
                  backgroundPosition: ['0% 0%', '10% 6%', '0% 0%'],
                }
          }
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* Floating blobs */}
        <div className="blob absolute left-[8%] top-[18%] h-72 w-72 rounded-full bg-accent-500/10" style={{ filter: 'blur(var(--blur-xl))' }} />
        <div className="blob absolute right-[6%] top-[42%] h-80 w-80 rounded-full bg-accent2-500/10" style={{ filter: 'blur(var(--blur-2xl))', animationDelay: '-4s' }} />
        {/* Noise texture */}
        <svg className="absolute inset-0 h-full w-full opacity-[0.035] mix-blend-overlay">
          <filter id="hero-noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#hero-noise)" />
        </svg>
      </div>

      <div className="frost mouse-glow transition-gpu mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-16 rounded-[var(--radius-2xl)] p-[var(--space-card)] lg:grid-cols-[1.1fr_0.9fr] lg:gap-8 lg:p-[var(--space-section-sm)]">
        {/* ================= Left: content ================= */}
        <motion.div variants={container} initial="hidden" animate="show">
          {/* Animated greeting */}
          <motion.div variants={item} className="mb-5 flex items-center gap-2">
            <span className="status-dot text-success" style={{ color: 'var(--color-success)' }} />
            <span className="eyebrow">Hey, I&rsquo;m {displayName || 'there'}</span>
          </motion.div>

          {/* Large heading with animated gradient text */}
          {displayName && (
            <motion.h1
              variants={item}
              className="text-[length:var(--text-display)] font-semibold leading-[var(--leading-tight)] tracking-[var(--tracking-tightest)] text-ink"
            >
              I build{' '}
              <span className="gradient-text-animated">digital products</span>
              <br className="hidden sm:block" /> that feel effortless.
            </motion.h1>
          )}

          {/* Rotating job titles */}
          {roleWords.length > 0 && (
            <motion.div variants={item} className="mt-6 flex items-center gap-2.5 text-lg text-muted sm:text-xl">
              <span className="text-faint">Currently working as a</span>
              <RotatingText words={roleWords} className="font-medium text-ink" />
            </motion.div>
          )}

          {/* Description */}
          {profile.bio && (
            <motion.p
              variants={item}
              className="mt-6 max-w-[52ch] text-[length:var(--text-lead)] leading-[var(--leading-relaxed)] text-muted"
            >
              {profile.bio}
            </motion.p>
          )}

          {/* CTA buttons */}
          <motion.div variants={item} className="mt-10 flex flex-wrap items-center gap-3">
            <MagneticButton>
              <Button href="#projects" size="lg" icon={<ArrowUpRight size={16} />} iconPosition="right">
                View work
              </Button>
            </MagneticButton>
            <MagneticButton>
              <Button
                href="#contact"
                variant="secondary"
                size="lg"
                onClick={() => track('page_view', { section: 'contact_cta' })}
              >
                Get in touch
              </Button>
            </MagneticButton>
            {profile.resume && (
              <Button
                href={profile.resume}
                external
                variant="ghost"
                size="lg"
                onClick={() => track('resume_download', { source: 'hero' })}
              >
                Résumé ↗
              </Button>
            )}
          </motion.div>

          {/* Social icons */}
          {socials.length > 0 && (
            <motion.div variants={item} className="mt-10">
              <SocialLinks
                socials={socials}
                onItemClick={(s) => {
                  if (s.platform === 'github') track('github_click', { platform: s.label });
                }}
              />
            </motion.div>
          )}

          {/* Animated statistics */}
          {stats && stats.length > 0 && (
            <motion.div
              variants={item}
              className="mt-12 grid max-w-md grid-cols-3 gap-6 border-t border-border pt-8"
            >
              {stats.map((s, i) => (
                <AnimatedStat key={s.label} value={s.value} label={s.label} suffix={s.suffix} delay={i * 0.12} />
              ))}
            </motion.div>
          )}
        </motion.div>

        {/* ================= Right: interactive visual ================= */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className="hidden lg:block"
        >
          <HeroVisualGate />
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ duration: 0.6, delay: 1 }}
        className="mx-auto mt-16 flex w-full max-w-7xl items-center gap-3 text-faint lg:mt-0 lg:absolute lg:bottom-10 lg:left-1/2 lg:mx-0 lg:w-auto lg:-translate-x-1/2"
      >
        <motion.div
          animate={reduceMotion ? {} : { y: [0, 5, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ArrowDown size={12} strokeWidth={1.5} />
        </motion.div>
        <span className="text-xs uppercase tracking-widest">Scroll</span>
      </motion.div>
    </section>
  );
}
