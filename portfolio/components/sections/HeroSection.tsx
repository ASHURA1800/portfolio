'use client';

import { ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import type { Profile, Social } from '@/types';
import { Button } from '@/components/ui/Button';
import { SocialIcon } from '@/components/ui/SocialIcon';
import { useAnalytics } from '@/hooks/useAnalytics';

export function HeroSection({ profile, socials }: { profile: Profile; socials: Social[] }) {
  const { track } = useAnalytics();
  const displayName = profile.name || profile.username;

  return (
    <section
      id="hero"
      className="relative flex min-h-[88vh] items-center px-[var(--space-gutter)] py-24"
    >
      {/* Left-hugging block inside a wide frame — open whitespace on the right
          keeps the hero quietly asymmetric rather than dead-centered. */}
      <div className="mx-auto w-full max-w-6xl">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:gap-16">
          <div className="max-w-[62ch] animate-[fadeIn_0.7s_ease] lg:flex-1">
          {displayName && (
            <h1 className="font-normal tracking-tight text-ink leading-[1.02] text-[length:var(--text-display)]">
              {displayName}
            </h1>
          )}

          {profile.title && (
            <p className="mt-6 text-xl text-muted">{profile.title}</p>
          )}

          {profile.bio && (
            <p className="mt-7 max-w-[55ch] text-lg leading-relaxed text-muted">
              {profile.bio}
            </p>
          )}

          <div className="mt-12 flex flex-wrap items-center gap-3">
            <Button
              href="#projects"
              icon={<ArrowUpRight size={16} />}
              iconPosition="right"
            >
              View Projects
            </Button>
            <Button
              href="#contact"
              variant="secondary"
              onClick={() => track('page_view', { section: 'contact_cta' })}
            >
              Contact Me
            </Button>
            {profile.resume && (
              <Button
                href={profile.resume}
                external
                variant="ghost"
                onClick={() => track('resume_download', { source: 'hero' })}
              >
                Resume
              </Button>
            )}
          </div>

          {socials.length > 0 && (
            <div className="mt-14 flex items-center gap-5">
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
                  <SocialIcon name={s.icon} size={18} />
                </a>
              ))}
            </div>
          )}
          </div>

          {profile.avatar && (
            <div className="flex-shrink-0 animate-[fadeIn_0.9s_ease]">
              <div className="relative h-52 w-52 overflow-hidden rounded-2xl border border-line lg:h-64 lg:w-64">
                <Image
                  src={profile.avatar}
                  alt={displayName || 'Profile'}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 208px, 256px"
                  priority
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
