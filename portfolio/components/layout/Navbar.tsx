'use client';

import { useEffect, useRef, useState, useId } from 'react';
import { Menu, X, FileText } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import type { Social } from '@/types';
import { SocialIcon } from '@/components/ui/SocialIcon';
import { SocialLinks } from '@/components/ui/SocialLinks';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { ScrollProgress } from '@/components/ui/ScrollProgress';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'Certifications', href: '#certifications' },
  { label: 'Contact', href: '#contact' },
];

const EASE = [0.22, 1, 0.36, 1] as const;

const menuContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.04 },
  },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

const menuItem = {
  hidden: { opacity: 0, y: -10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: EASE } },
};

export function Navbar({
  brand,
  socials,
  visibleSections,
  resume,
}: {
  brand: string;
  socials: Social[];
  visibleSections?: string[];
  resume?: string;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState('');
  const navRef = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const reduceMotion = useReducedMotion();

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

  // Lock body scroll while the mobile menu is open, and close on Escape.
  useEffect(() => {
    if (!menuOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  // Close mobile menu automatically if the viewport grows past the md breakpoint.
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const onChange = () => setMenuOpen(false);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return (
    <>
      <ScrollProgress />

      <motion.nav
        ref={navRef}
        initial={false}
        animate={{ height: scrolled ? 60 : 76 }}
        transition={{ duration: 0.3, ease: EASE }}
        className={cn(
          'fixed inset-x-0 top-0 z-40 flex items-center',
          scrolled ? 'glass-nav shadow-sm' : 'border-b border-transparent bg-transparent',
        )}
      >
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-[var(--space-gutter)]">
          {/* Brand */}
          <Link
            href="/"
            className="rounded-sm text-sm font-medium tracking-tight text-ink transition-colors duration-200 hover:text-accent-400"
          >
            {brand}
            <span className="text-accent-500">.</span>
          </Link>

          {/* Desktop links */}
          <div className="hidden items-center gap-1 md:flex" role="navigation" aria-label="Primary">
            {links.map((link) => {
              const isActive = active === link.href;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  aria-current={isActive ? 'true' : undefined}
                  className={cn(
                    'relative rounded-md px-3 py-2 text-xs font-medium tracking-wide transition-colors duration-200',
                    isActive ? 'text-ink' : 'text-faint hover:text-muted',
                  )}
                >
                  {link.label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-underline"
                      aria-hidden="true"
                      className="absolute inset-x-3 -bottom-0.5 h-px bg-accent-400"
                      transition={
                        reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 380, damping: 32 }
                      }
                    />
                  )}
                </a>
              );
            })}
          </div>

          {/* Desktop right cluster: socials, theme toggle, resume */}
          <div className="hidden items-center gap-2 md:flex">
            {socials.length > 0 && (
              <div className="flex items-center gap-0.5 pr-1">
                {socials.slice(0, 3).map((s) => (
                  <a
                    key={s.platform}
                    href={s.href}
                    target={s.platform === 'email' ? undefined : '_blank'}
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="flex h-8 w-8 items-center justify-center rounded-md text-faint transition-colors duration-200 hover:bg-surface hover:text-ink"
                  >
                    <SocialIcon name={s.icon} size={15} />
                  </a>
                ))}
              </div>
            )}
            <ThemeToggle />
            {resume && (
              <a href={resume} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm ml-1">
                <FileText size={13} />
                Resume
              </a>
            )}
          </div>

          {/* Mobile: theme toggle + menu button */}
          <div className="flex items-center gap-1.5 md:hidden">
            <ThemeToggle />
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-lg text-faint transition-colors hover:text-ink"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              aria-controls={menuId}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={menuOpen ? 'close' : 'open'}
                  initial={{ rotate: -60, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 60, opacity: 0 }}
                  transition={{ duration: 0.2, ease: EASE }}
                  className="flex items-center justify-center"
                >
                  {menuOpen ? <X size={18} /> : <Menu size={18} />}
                </motion.span>
              </AnimatePresence>
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop */}
            <motion.button
              type="button"
              aria-label="Close menu"
              tabIndex={-1}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 z-30 bg-overlay/60 backdrop-blur-sm md:hidden"
            />

            <motion.div
              id={menuId}
              role="navigation"
              aria-label="Mobile"
              variants={menuContainer}
              initial="hidden"
              animate="show"
              exit="exit"
              className="glass-strong fixed inset-x-4 top-[72px] z-40 overflow-hidden rounded-2xl shadow-pop md:hidden"
            >
              <div className="p-2">
                {links.map((link) => (
                  <motion.a
                    key={link.href}
                    variants={menuItem}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    aria-current={active === link.href ? 'true' : undefined}
                    className={cn(
                      'flex items-center rounded-lg px-4 py-3 text-sm transition-colors',
                      active === link.href
                        ? 'bg-card text-ink'
                        : 'text-muted hover:bg-card hover:text-ink',
                    )}
                  >
                    {link.label}
                  </motion.a>
                ))}
                {resume && (
                  <motion.a
                    variants={menuItem}
                    href={resume}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 flex items-center gap-2 rounded-lg px-4 py-3 text-sm text-muted transition-colors hover:bg-card hover:text-ink"
                  >
                    <FileText size={15} />
                    Résumé
                  </motion.a>
                )}
              </div>
              {socials.length > 0 && (
                <motion.div variants={menuItem} className="border-t border-border px-3 py-3">
                  <SocialLinks socials={socials} size="lg" variant="ghost" liftOnHover={false} />
                </motion.div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
