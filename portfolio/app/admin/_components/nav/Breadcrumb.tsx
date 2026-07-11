'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'motion/react';
import { ChevronRight, Home } from 'lucide-react';

/** Maps path segments to human-readable labels. */
const LABELS: Record<string, string> = {
  admin: 'Admin',
  profile: 'Profile',
  projects: 'Projects',
  skills: 'Skills',
  experience: 'Experience',
  certifications: 'Certifications',
  buildlog: 'Build Log',
  learnings: 'Learnings',
  roadmap: 'Roadmap',
  'change-password': 'Change Password',
  new: 'New',
  edit: 'Edit',
};

function toLabel(segment: string) {
  return LABELS[segment] ?? segment.charAt(0).toUpperCase() + segment.slice(1);
}

export default function Breadcrumb() {
  const pathname = usePathname();

  // /admin/projects/edit → ['admin','projects','edit']
  const segments = pathname.split('/').filter(Boolean);

  const crumbs = segments.map((seg, i) => ({
    label: toLabel(seg),
    href: '/' + segments.slice(0, i + 1).join('/'),
    isLast: i === segments.length - 1,
  }));

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

        {crumbs.slice(1).map(({ label, href, isLast }, i) => (
          <motion.li
            key={href}
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.18, delay: i * 0.04 }}
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
      </ol>
    </nav>
  );
}
