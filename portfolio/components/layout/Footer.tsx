'use client';

import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import type { Profile, Social, SocialPlatform } from '@/types';
import { SocialLinks } from '@/components/ui/SocialLinks';
import { GithubContributionGraph } from '@/components/layout/GithubContributionGraph';
import { NowPlaying } from '@/components/layout/NowPlaying';
import { CoffeeCounter } from '@/components/layout/CoffeeCounter';

const FOOTER_PLATFORMS: SocialPlatform[] = ['github', 'linkedin', 'twitter', 'email'];

const BUILT_WITH = ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Motion'];

function extractGithubUsername(profile: Profile): string {
  if (profile.username) return profile.username;
  try {
    const path = new URL(profile.github).pathname;
    return path.replace(/^\/+|\/+$/g, '').split('/')[0] ?? '';
  } catch {
    return '';
  }
}

export function Footer({ profile, socials: allSocials }: { profile: Profile; socials: Social[] }) {
  const brand = profile.name || profile.username || 'Portfolio';
  const note = profile.note;
  // Deferred to useEffect: a render-time new Date().getFullYear() in a
  // client component still runs during SSR (a lazy useState initializer
  // does too — same trap, caught while writing this), so it can
  // theoretically mismatch across a year rollover (server renders Dec 31,
  // client hydrates Jan 1). Fixed literal SSR fallback, corrected on
  // mount — same pattern as CurrentDateTime.tsx's null placeholder.
  const [year, setYear] = useState(2026);
  useEffect(() => setYear(new Date().getFullYear()), []);
  const socials = allSocials.filter((s) => FOOTER_PLATFORMS.includes(s.platform));
  const githubUsername = extractGithubUsername(profile);
  const reduceMotion = useReducedMotion();

  return (
    <footer className="glass-strong relative mt-24 overflow-hidden border-t border-border">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-64 w-[36rem] -translate-x-1/2 rounded-full bg-accent-500/8 blur-[110px]" />
      </div>

      {/* Animated divider */}
      <div className="relative h-px w-full overflow-hidden bg-border">
        <motion.div
          className="h-full w-1/3 bg-gradient-to-r from-transparent via-accent-400 to-transparent"
          animate={reduceMotion ? {} : { x: ['-100%', '400%'] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-[var(--space-gutter)] py-12">
        {/* Top row: contribution graph + now playing */}
        {(githubUsername || true) && (
          <div className="mb-10 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
            {githubUsername && <GithubContributionGraph username={githubUsername} />}
            <NowPlaying />
          </div>
        )}

        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          {/* Identity */}
          <div>
            <a href="#hero" className="text-sm font-medium text-ink transition-colors duration-200 hover:text-accent-300">
              {brand}
              <span className="text-accent-500">.</span>
            </a>
            <p className="mt-1 text-xs text-faint">
              © {year}
              {profile.name ? ` ${profile.name}` : ''}. All rights reserved.
            </p>
            {note && <p className="mt-2 max-w-xs text-xs leading-relaxed text-faint/70">{note}</p>}

            <div className="mt-4">
              <CoffeeCounter />
            </div>
          </div>

          {/* Built with */}
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-faint">Built with</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {BUILT_WITH.map((t) => (
                <span key={t} className="tech-pill">
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Socials + back to top */}
          <div className="flex items-center gap-3 md:flex-col md:items-end md:gap-4">
            {socials.length > 0 && <SocialLinks socials={socials} size="sm" variant="ghost" />}
            <motion.button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Back to top"
              className="flex h-9 items-center gap-1.5 rounded-full border border-border px-3 text-xs text-faint transition-colors duration-200 hover:border-accent-500/40 hover:text-ink"
            >
              Top
              <ArrowUp size={11} aria-hidden="true" />
            </motion.button>
          </div>
        </div>
      </div>
    </footer>
  );
}
