'use client';

import { ArrowUpRight, ArrowDown } from 'lucide-react';
import Image from 'next/image';
import type { Profile, Social } from '@/types';
import { Button } from '@/components/ui/Button';
import { SocialIcon } from '@/components/ui/SocialIcon';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { useAnalytics } from '@/hooks/useAnalytics';

export function HeroSection({ profile, socials }: { profile: Profile; socials: Social[] }) {
  const { track } = useAnalytics();
  const displayName = profile.name || profile.username;

  return (
    <section
      id="hero"
      className="relative flex min-h-[96vh] flex-col justify-between px-[var(--space-gutter)] pt-28 pb-12"
    >
      {/* Top row: name + availability status */}
      <div className="mx-auto w-full max-w-7xl">
        <div className="flex items-start justify-between gap-8">
          {/* Left: index label */}
          <div className="hidden lg:block pt-1">
            <span className="section-index">Portfolio</span>
          </div>

          {/* Centre: hero content */}
          <div className="flex-1 animate-[fadeUp_0.6s_ease_both]">
            {/* Title line above name */}
            {profile.title && (
              <p className="mb-5 text-xs font-medium uppercase tracking-[0.22em] text-faint">
                {profile.title}
              </p>
            )}

            {displayName && (
              <h1 className="font-semibold tracking-[-0.03em] text-ink leading-[0.95] text-[length:var(--text-display)]">
                {displayName}
              </h1>
            )}

            {profile.bio && (
              <p className="mt-8 max-w-[52ch] text-[length:var(--text-lead)] leading-relaxed text-muted">
                {profile.bio}
              </p>
            )}

            <div className="mt-10 flex flex-wrap items-center gap-3">
              <MagneticButton>
                <Button
                  href="#projects"
                  icon={<ArrowUpRight size={14} />}
                  iconPosition="right"
                >
                  View work
                </Button>
              </MagneticButton>
              <MagneticButton>
                <Button
                  href="#contact"
                  variant="secondary"
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
                  onClick={() => track('resume_download', { source: 'hero' })}
                >
                  Résumé ↗
                </Button>
              )}
            </div>

            {socials.length > 0 && (
              <div className="mt-12 flex items-center gap-4">
                {socials.map((s) => (
                  <a
                    key={s.platform}
                    href={s.href}
                    target={s.platform === 'email' ? undefined : '_blank'}
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    onClick={s.platform === 'github' ? () => track('github_click', { platform: s.label }) : undefined}
                    className="text-faint hover:text-ink transition-colors duration-200"
                  >
                    <SocialIcon name={s.icon} size={17} />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Right: avatar — minimal, no border box */}
          {profile.avatar && (
            <div className="hidden lg:block shrink-0 animate-[fadeIn_0.9s_ease_both]">
              <div className="relative h-[180px] w-[180px] overflow-hidden rounded-2xl">
                <Image
                  src={profile.avatar}
                  alt={displayName || 'Profile photo'}
                  fill
                  className="object-cover grayscale-[15%]"
                  sizes="180px"
                  priority
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom: scroll cue — purely decorative */}
      <div className="mx-auto w-full max-w-7xl">
        <div className="flex items-center gap-3 text-faint opacity-50">
          <ArrowDown size={12} strokeWidth={1.5} />
          <span className="text-xs tracking-widest uppercase">Scroll</span>
        </div>
      </div>
    </section>
  );
}
