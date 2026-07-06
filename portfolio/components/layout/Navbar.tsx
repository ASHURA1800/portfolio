'use client';

import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import type { Social } from '@/types';
import { SocialIcon } from '@/components/ui/SocialIcon';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'Certifications', href: '#certifications' },
  { label: 'Contact', href: '#contact' },
];

export function Navbar({
  brand,
  socials,
  visibleSections,
}: {
  brand: string;
  socials: Social[];
  visibleSections?: string[];
}) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState('');

  // Filter nav links to only those whose section has real content.
  const links = visibleSections
    ? NAV_LINKS.filter((l) => visibleSections.includes(l.href))
    : NAV_LINKS;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => e.isIntersecting && setActive('#' + e.target.id)),
      { rootMargin: '-40% 0px -40% 0px' },
    );
    links.forEach((l) => {
      const el = document.querySelector(l.href);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [links]);

  return (
    <>
      <nav
        className={cn(
          'fixed inset-x-0 top-0 z-40 transition-colors duration-300',
          scrolled
            ? 'bg-bg border-b border-line'
            : 'bg-transparent border-b border-transparent',
        )}
      >
        <div className="max-w-7xl mx-auto px-[var(--space-gutter)] h-16 flex items-center justify-between">
          <Link href="/" className="text-lg text-ink tracking-tight">
            {brand}
            <span className="text-accent-400">.</span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-7">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={cn(
                  'relative text-sm py-1 transition-colors duration-200',
                  active === link.href ? 'text-ink' : 'text-muted hover:text-ink',
                )}
              >
                {link.label}
                {active === link.href && (
                  <span className="absolute -bottom-0.5 inset-x-0 h-px bg-accent-500" />
                )}
              </a>
            ))}
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 -mr-2 rounded-lg text-muted hover:text-ink transition-colors"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="fixed top-16 inset-x-4 z-30 bg-surface border border-line rounded-xl p-4 shadow-[var(--shadow-pop)] md:hidden animate-[fadeIn_0.2s_ease]">
          <div className="flex flex-col">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="px-3 py-3 rounded-lg text-sm font-medium text-muted hover:text-ink hover:bg-bg transition-colors"
              >
                {link.label}
              </a>
            ))}

            {socials.length > 0 && (
              <div className="flex items-center gap-1 mt-3 pt-3 border-t border-line">
                {socials.map((s) => (
                  <a
                    key={s.platform}
                    href={s.href}
                    target={s.platform === 'email' ? undefined : '_blank'}
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="p-2.5 rounded-lg text-muted hover:text-ink hover:bg-bg transition-colors"
                  >
                    <SocialIcon name={s.icon} size={18} />
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
