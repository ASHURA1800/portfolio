'use client';

import { ArrowUp } from 'lucide-react';
import type { Profile, Social, SocialPlatform } from '@/types';
import { SocialIcon } from '@/components/ui/SocialIcon';

// Footer intentionally surfaces only GitHub, LinkedIn, and email.
const FOOTER_PLATFORMS: SocialPlatform[] = ['github', 'linkedin', 'email'];

export function Footer({ profile, socials: allSocials }: { profile: Profile; socials: Social[] }) {
  const brand = profile.name || profile.username || 'Portfolio';
  const note = profile.note;
  const year = new Date().getFullYear();
  const socials = allSocials.filter((s) => FOOTER_PLATFORMS.includes(s.platform));

  return (
    <footer className="border-t border-line py-12 px-[var(--space-gutter)]">
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-6 text-center md:flex-row md:items-center md:justify-between md:text-left">
        {/* Identity */}
        <div>
          <a href="#" className="font-serif text-base text-ink tracking-tight">
            {brand}
            <span className="text-accent-600">.</span>
          </a>
          <p className="mt-1 text-sm text-faint">
            © {year}
            {profile.name ? ` ${profile.name}` : ''}
          </p>
          {note && (
            <p className="mt-2 max-w-xs text-xs leading-relaxed text-faint md:max-w-sm">
              {note}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {socials.length > 0 && (
            <div className="flex items-center gap-1">
              {socials.map((s) => (
                <a
                  key={s.platform}
                  href={s.href}
                  target={s.platform === 'email' ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="p-2 rounded-lg text-muted hover:text-ink transition-colors duration-200"
                >
                  <SocialIcon name={s.icon} size={17} />
                </a>
              ))}
              <span className="mx-1 h-4 w-px bg-line" aria-hidden="true" />
            </div>
          )}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="inline-flex items-center gap-1.5 text-xs text-faint hover:text-ink transition-colors duration-200"
          >
            Back to top
            <ArrowUp size={12} aria-hidden={true} />
          </button>
        </div>
      </div>
    </footer>
  );
}
