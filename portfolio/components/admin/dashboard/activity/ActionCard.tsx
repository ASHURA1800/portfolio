'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'motion/react';
import type { LucideIcon } from 'lucide-react';

export interface ActionCardProps {
  label: string;
  description: string;
  href: string;
  icon: LucideIcon;
  /** Accent color for the icon bg + hover ring */
  accent?: string;
  index?: number;
}

/**
 * ActionCard
 * A single quick-action tile. Staggered entrance, icon in accent bubble,
 * subtle hover lift. Always navigates to an existing admin route — no new
 * routes created.
 */
export default function ActionCard({
  label,
  description,
  href,
  icon: Icon,
  accent = 'rgba(124,77,255,0.12)',
  index = 0,
}: ActionCardProps) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, delay: index * 0.045, ease: [0.22, 1, 0.36, 1] }}
      whileHover={reduce ? {} : { y: -2 }}
      whileTap={reduce ? {} : { scale: 0.97 }}
    >
      <Link
        href={href}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.625rem',
          padding: '0.875rem',
          borderRadius: 'var(--radius-lg)',
          background: 'rgba(255,255,255,0.025)',
          border: '1px solid rgba(255,255,255,0.06)',
          textDecoration: 'none',
          transition: 'border-color 150ms ease, background 150ms ease, box-shadow 150ms ease',
          cursor: 'pointer',
          height: '100%',
          boxSizing: 'border-box',
        }}
        className="group hover:border-white/12 hover:bg-white/5"
      >
        {/* Icon bubble */}
        <div
          style={{
            width: '2rem',
            height: '2rem',
            borderRadius: 'var(--radius-md)',
            background: accent,
            border: '1px solid rgba(255,255,255,0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            transition: 'transform 150ms ease',
          }}
          className="group-hover:scale-110"
        >
          <Icon size={14} style={{ color: 'var(--color-ink)', opacity: 0.85 }} />
        </div>

        {/* Text */}
        <div>
          <div
            style={{
              fontSize: 'var(--text-sm)',
              fontWeight: 600,
              color: 'var(--color-ink)',
              lineHeight: 'var(--leading-tight)',
              marginBottom: '0.1875rem',
            }}
          >
            {label}
          </div>
          <div
            style={{
              fontSize: 'var(--text-xs)',
              color: 'var(--color-faint)',
              lineHeight: 'var(--leading-snug)',
            }}
          >
            {description}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
