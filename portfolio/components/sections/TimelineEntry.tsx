'use client';

import { motion } from 'motion/react';
import { Briefcase } from 'lucide-react';
import type { Experience } from '@/types';
import { formatDateRange } from '@/lib/utils';
import { CompanyLogo } from '@/components/sections/CompanyLogo';

const EASE = [0.22, 1, 0.36, 1] as const;

export function TimelineEntry({ experience: e, index }: { experience: Experience; index: number }) {
  const fromLeft = index % 2 === 0;

  return (
    <div className="relative grid grid-cols-1 gap-6 md:grid-cols-[2.5rem_1fr]">
      {/* Node */}
      <div className="relative hidden md:flex md:justify-center">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true, margin: '-20% 0px' }}
          transition={{ duration: 0.4, ease: EASE }}
          className="relative z-10 mt-1 flex h-10 w-10 items-center justify-center rounded-full border-2 border-accent-500 bg-bg shadow-glow-accent"
        >
          <Briefcase size={15} className="text-accent-300" strokeWidth={1.75} />
          {e.current && (
            <motion.span
              className="absolute inset-0 rounded-full border-2 border-accent-400"
              animate={{ scale: [1, 1.6], opacity: [0.6, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
            />
          )}
        </motion.div>
      </div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, x: fromLeft ? -28 : 28, y: 16 }}
        whileInView={{ opacity: 1, x: 0, y: 0 }}
        viewport={{ once: true, margin: '-10% 0px' }}
        transition={{ duration: 0.55, ease: EASE }}
        whileHover={{ y: -4 }}
        className="card-glass rounded-[var(--radius-lg)] p-6 pb-8 transition-shadow duration-300 hover:shadow-lg"
      >
        <div className="flex items-start gap-4">
          <CompanyLogo company={e.company} logo={e.logo} />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <h3 className="text-base font-semibold leading-tight text-ink">{e.company}</h3>
              <p className="text-xs tabular-nums tracking-wide text-faint">{formatDateRange(e)}</p>
            </div>
            <p className="mt-0.5 text-sm text-muted">{e.role}</p>
            {(e.type || e.location) && (
              <p className="mt-1 text-xs text-faint/70">
                {e.type && <span className="capitalize">{e.type}</span>}
                {e.type && e.location && <span className="mx-1.5">·</span>}
                {e.location && <span>{e.location}</span>}
              </p>
            )}
          </div>
        </div>

        {e.description && (
          <p className="mt-4 max-w-[62ch] text-sm leading-relaxed text-muted">{e.description}</p>
        )}

        {e.impact && e.impact.length > 0 && (
          <ul className="mt-3 space-y-1.5">
            {e.impact.map((it, i) => (
              <li key={i} className="flex max-w-[62ch] gap-2.5">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent-500/60" aria-hidden="true" />
                <span className="text-sm leading-relaxed text-muted">{it}</span>
              </li>
            ))}
          </ul>
        )}

        {e.tech_stack && e.tech_stack.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {e.tech_stack.map((t) => (
              <span key={t} className="tech-pill">
                {t}
              </span>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
