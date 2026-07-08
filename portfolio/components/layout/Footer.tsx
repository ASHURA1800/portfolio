'use client';

import { ArrowUp } from 'lucide-react';
import type { Profile, Social, SocialPlatform } from '@/types';
import { SocialIcon } from '@/components/ui/SocialIcon';

const FOOTER_PLATFORMS: SocialPlatform[] = ['github', 'linkedin', 'email'];

export function Footer({ profile, socials: allSocials }: { profile: Profile; socials: Social[] }) {
  const brand = profile.name || profile.username || 'Portfolio';
  const note = profile.note;
  const year = new Date().getFullYear();
  const socials = allSocials.filter((s) => FOOTER_PLATFORMS.includes(s.platform));

  return (
    <footer className="border-t border-line px-[var(--space-gutter)] py-10">
      <div className="max-w-7xl mx-auto flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        {/* Identity */}
        <div>
          <a href="#" className="text-sm font-medium text-ink hover:text-accent-400 transition-colors duration-200">
            {brand}
            <span className="text-accent-500">.</span>
          </a>
          <p className="mt-1 text-xs text-faint">
            © {year}{profile.name ? ` ${profile.name}` : ''}
          </p>
          {note && (
            <p className="mt-1.5 max-w-xs text-xs leading-relaxed text-faint/70">{note}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {socials.length > 0 && (
            <div className="flex items-center gap-0.5">
              {socials.map((s) => (
                <a
                  key={s.platform}
                  href={s.href}
                  target={s.platform === 'email' ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-faint hover:text-ink transition-colors duration-200"
                >
                  <SocialIcon name={s.icon} size={15} />
                </a>
              ))}
            </div>
          )}
          <span className="h-3.5 w-px bg-line" aria-hidden="true" />
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex h-9 items-center gap-1.5 px-2 text-xs text-faint hover:text-ink transition-colors duration-200"
          >
            Top
            <ArrowUp size={11} aria-hidden />
          </button>
        </div>
      </div>
    </footer>
  );
}
