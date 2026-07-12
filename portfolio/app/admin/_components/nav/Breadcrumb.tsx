'use client';

import Link from 'next/link';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { ChevronRight, Home } from 'lucide-react';
import { useNavigation } from './NavigationContext';

export default function Breadcrumb() {
  const { breadcrumbs: crumbs } = useNavigation();
  const reduceMotion = useReducedMotion();

  // Don't render on /admin root
  if (crumbs.length <= 1) return null;

  return (
    <nav aria-label="Breadcrumb">
      <ol
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.25rem',
          listStyle: 'none',
          padding: 0,
          margin: 0,
        }}
      >
        {/* Home icon */}
        <li>
          <Link
            href="/admin"
            aria-label="Admin home"
            style={{
              display: 'flex',
              alignItems: 'center',
              color: 'var(--color-faint)',
              textDecoration: 'none',
              transition: 'color 0.15s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-muted)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-faint)')}
          >
            <Home size={13} />
          </Link>
        </li>

        <AnimatePresence initial={false} mode="popLayout">
          {crumbs.slice(1).map(({ label, href, isLast }, i) => (
            <motion.li
              key={href}
              layout={!reduceMotion}
              initial={reduceMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduceMotion ? { opacity: 1 } : { opacity: 0, x: 4 }}
              transition={reduceMotion ? { duration: 0 } : { duration: 0.18, delay: i * 0.04 }}
              style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}
            >
              <ChevronRight size={12} style={{ color: 'var(--color-disabled)' }} aria-hidden="true" />
              {isLast ? (
                <span
                  style={{
                    fontSize: 'var(--text-xs)',
                    fontWeight: 500,
                    color: 'var(--color-ink)',
                  }}
                  aria-current="page"
                >
                  {label}
                </span>
              ) : (
                <Link
                  href={href}
                  style={{
                    fontSize: 'var(--text-xs)',
                    color: 'var(--color-faint)',
                    textDecoration: 'none',
                    transition: 'color 0.15s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-muted)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-faint)')}
                >
                  {label}
                </Link>
              )}
            </motion.li>
          ))}
        </AnimatePresence>
      </ol>
    </nav>
  );
}
