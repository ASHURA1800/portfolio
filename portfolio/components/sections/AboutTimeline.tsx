'use client';

import { motion } from 'motion/react';
import type { Experience } from '@/types';
import { formatDateRange } from '@/lib/utils';

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Compact milestone strip — company, role, dates only. The full
 * ExperienceSection right after About owns the detailed write-up; this is a
 * quick-glance summary woven into the personal story.
 */
export function AboutTimeline({ experience }: { experience: Experience[] }) {
  if (experience.length === 0) return null;
  const entries = experience.slice(0, 4);

  return (
    <div className="relative pl-6">
      <div className="absolute left-[3px] top-1 bottom-1 w-px bg-border" aria-hidden="true" />
      <div className="space-y-6">
        {entries.map((e, i) => (
          <motion.div
            key={e.id}
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-10% 0px' }}
            transition={{ duration: 0.45, delay: i * 0.08, ease: EASE }}
            className="group relative"
          >
            <span
              className="absolute -left-6 top-1.5 h-2 w-2 rounded-full border-2 border-accent-500 bg-bg transition-transform duration-200 group-hover:scale-125"
              aria-hidden="true"
            />
            <p className="text-xs tabular-nums tracking-wide text-faint">{formatDateRange(e)}</p>
            <p className="mt-0.5 text-sm font-medium text-ink">
              {e.role} <span className="text-faint">· {e.company}</span>
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
