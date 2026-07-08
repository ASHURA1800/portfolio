'use client';

import { useEffect, useRef, useState } from 'react';
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
  const [indicator, setIndicator] = useState<{ left: number; width: number } | null>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});

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
      (entries) => entries.forEach((e) => e.isIntersecting && setActive('#' + e.target.id)),
      { rootMargin: '-40% 0px -40% 0px' },
    );
    links.forEach((l) => {
      const el = document.querySelector(l.href);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [links]);

  useEffect(() => {
    const measure = () => {
      const el = active ? linkRefs.current[active] : null;
      const nav = navRef.current;
      if (el && nav) {
        const navRect = nav.getBoundingClientRect();
        const rect = el.getBoundingClientRect();
        setIndicator({ left: rect.left - navRect.left, width: rect.width });
      } else {
        setIndicator(null);
      }
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [active, links]);

  return (
    <>
      <nav
        className={cn(
          'fixed inset-x-0 top-0 z-40 transition-all duration-300',
          scrolled
            ? 'bg-bg/95 backdrop-blur-md border-b border-line'
            : 'bg-transparent border-b border-transparent',
        )}
      >
        <div className="max-w-7xl mx-auto px-[var(--space-gutter)] h-14 flex items-center justify-between">
          {/* Brand */}
          <Link
            href="/"
            className="text-sm font-medium text-ink tracking-tight hover:text-accent-400 transition-colors duration-200"
          >
            {brand}
            <span className="text-accent-500">.</span>
          </Link>

          {/* Desktop links */}
          <div ref={navRef} className="hidden md:flex items-center gap-6 relative">
            {links.map((link) => (
              <a
                key={link.href}
                ref={(el) => { linkRefs.current[link.href] = el; }}
                href={link.href}
                className={cn(
                  'relative text-xs font-medium tracking-wide py-1 transition-colors duration-200',
                  active === link.href ? 'text-ink' : 'text-faint hover:text-muted',
                )}
              >
                {link.label}
              </a>
            ))}
            {indicator && (
              <span
                aria-hidden="true"
                className="absolute -bottom-0.5 h-px bg-accent-500 transition-[left,width] duration-250 ease-out"
                style={{ left: indicator.left, width: indicator.width }}
              />
            )}
          </div>

          {/* Desktop socials */}
          {socials.length > 0 && (
            <div className="hidden md:flex items-center gap-0.5">
              {socials.slice(0, 3).map((s) => (
                <a
                  key={s.platform}
                  href={s.href}
                  target={s.platform === 'email' ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="flex h-8 w-8 items-center justify-center rounded-md text-faint hover:text-ink hover:bg-surface transition-colors duration-200"
                >
                  <SocialIcon name={s.icon} size={15} />
                </a>
              ))}
            </div>
          )}

          {/* Mobile toggle */}
          <button
            className="md:hidden flex h-10 w-10 items-center justify-center rounded-lg text-faint hover:text-ink transition-colors"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="fixed top-[57px] inset-x-4 z-30 bg-surface border border-line rounded-xl overflow-hidden shadow-[var(--shadow-pop)] md:hidden animate-[fadeIn_0.18s_ease]">
          <div className="p-2">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={cn(
                  'flex items-center px-3 py-2.5 rounded-lg text-sm transition-colors',
                  active === link.href
                    ? 'text-ink bg-card'
                    : 'text-muted hover:text-ink hover:bg-card',
                )}
              >
                {link.label}
              </a>
            ))}
          </div>
          {socials.length > 0 && (
            <div className="flex items-center gap-0.5 px-3 py-3 border-t border-line">
              {socials.map((s) => (
                <a
                  key={s.platform}
                  href={s.href}
                  target={s.platform === 'email' ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="flex h-10 w-10 items-center justify-center rounded-lg text-faint hover:text-ink hover:bg-bg transition-colors"
                >
                  <SocialIcon name={s.icon} size={16} />
                </a>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
