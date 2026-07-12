'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'motion/react';
import type { ActivityKind } from '@/lib/analytics/activity';

// ── kind config ───────────────────────────────────────────────────────────────

const KIND_META: Record<
  ActivityKind,
  { label: string; icon: string; accent: string; dot: string }
> = {
  project:       { label: 'Project',       icon: '🚀', accent: 'rgba(124,77,255,0.12)', dot: '#7C4DFF' },
  certification: { label: 'Certification', icon: '🏆', accent: 'rgba(251,191,36,0.10)', dot: '#FBBF24' },
  build_log:     { label: 'Build Log',     icon: '🔨', accent: 'rgba(34,197,245,0.10)', dot: '#22C5F5' },
  learning:      { label: 'Learning',      icon: '📖', accent: 'rgba(52,211,153,0.10)', dot: '#34D399' },
  roadmap:       { label: 'Roadmap',       icon: '🗺️',  accent: 'rgba(249,115,22,0.10)', dot: '#F97316' },
  profile:       { label: 'Profile',       icon: '👤', accent: 'rgba(168,85,247,0.10)', dot: '#A855F7' },
};

// ── time formatting ───────────────────────────────────────────────────────────

function relativeTime(date: Date): string {
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString('en', { month: 'short', day: 'numeric' });
}

// ── component ─────────────────────────────────────────────────────────────────

export interface ActivityCardProps {
  id: string;
  kind: ActivityKind;
  label: string;
  sublabel?: string;
  updatedAt: Date;
  href: string;
  /** Whether to show the vertical connector line below (all but last) */
  showLine?: boolean;
  /** Stagger index for entrance animation */
  index?: number;
}

export default function ActivityCard({
  kind,
  label,
  sublabel,
  updatedAt,
  href,
  showLine = true,
  index = 0,
}: ActivityCardProps) {
  const reduce = useReducedMotion();
  const meta = KIND_META[kind];

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.055, ease: [0.22, 1, 0.36, 1] }}
      style={{ display: 'flex', gap: '0.75rem', position: 'relative' }}
    >
      {/* Timeline column: dot + vertical rule */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          flexShrink: 0,
          width: '1.5rem',
        }}
      >
        {/* Dot */}
        <div
          aria-hidden="true"
          style={{
            width: '0.5rem',
            height: '0.5rem',
            borderRadius: '50%',
            background: meta.dot,
            flexShrink: 0,
            marginTop: '0.375rem',
            boxShadow: `0 0 6px ${meta.dot}88`,
          }}
        />
        {/* Connector line */}
        {showLine && (
          <div
            aria-hidden="true"
            style={{
              flex: 1,
              width: '1px',
              background:
                'linear-gradient(to bottom, rgba(255,255,255,0.07) 0%, transparent 100%)',
              marginTop: '0.25rem',
              minHeight: '1.25rem',
            }}
          />
        )}
      </div>

      {/* Card body */}
      <Link
        href={href}
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          gap: '0.625rem',
          padding: '0.5rem 0.625rem',
          borderRadius: 'var(--radius-md)',
          background: meta.accent,
          border: '1px solid rgba(255,255,255,0.05)',
          textDecoration: 'none',
          marginBottom: showLine ? '0.375rem' : 0,
          transition: 'border-color 150ms ease, background 150ms ease',
          minWidth: 0,
        }}
        className="group hover:border-white/12 hover:brightness-110"
      >
        {/* Kind icon */}
        <span
          aria-hidden="true"
          style={{ fontSize: '0.875rem', flexShrink: 0, lineHeight: 1 }}
        >
          {meta.icon}
        </span>

        {/* Text */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: 'var(--text-sm)',
              fontWeight: 500,
              color: 'var(--color-ink)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              lineHeight: 'var(--leading-snug)',
            }}
          >
            {label}
          </div>
          {sublabel && (
            <div
              style={{
                fontSize: 'var(--text-xs)',
                color: 'var(--color-faint)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                marginTop: '0.0625rem',
              }}
            >
              {sublabel}
            </div>
          )}
        </div>

        {/* Kind badge + time */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: '0.125rem',
            flexShrink: 0,
          }}
        >
          <span
            style={{
              fontSize: '0.625rem',
              fontWeight: 600,
              letterSpacing: 'var(--tracking-wider)',
              textTransform: 'uppercase',
              color: meta.dot,
              lineHeight: 1,
            }}
          >
            {meta.label}
          </span>
          <span
            style={{
              fontSize: 'var(--text-xs)',
              color: 'var(--color-faint)',
              fontVariantNumeric: 'tabular-nums',
              lineHeight: 1,
            }}
          >
            {relativeTime(updatedAt)}
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
