'use client';

import { motion } from 'motion/react';
import type { BuildLogEntry, BuildStatus } from '@/types';

const EASE = [0.22, 1, 0.36, 1] as const;

const STATUS_COLOR: Record<BuildStatus, string> = {
  shipped: 'bg-success',
  'in-progress': 'bg-accent-500',
  planned: 'bg-faint',
};

const STATUS_LABEL: Record<BuildStatus, string> = {
  shipped: 'Shipped',
  'in-progress': 'In progress',
  planned: 'Planned',
};

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const row = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } },
};

export function BuildLogList({ entries }: { entries: BuildLogEntry[] }) {
  return (
    <motion.ol
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-10% 0px' }}
      className="max-w-3xl"
    >
      {entries.map((e) => (
        <motion.li
          key={e.id}
          variants={row}
          className="group grid grid-cols-1 gap-2 border-t border-border py-5 last:border-b transition-colors duration-200 hover:bg-surface/40 md:grid-cols-[10rem_1fr_auto] md:items-baseline md:gap-6"
        >
          <time className="text-xs tabular-nums text-faint">{e.date}</time>
          <div>
            <h3 className="text-sm font-medium text-ink">{e.title}</h3>
            {e.summary && <p className="mt-1 text-xs leading-relaxed text-muted">{e.summary}</p>}
          </div>
          <div className="flex items-center gap-1.5 md:justify-end">
            <span className={`status-dot ${STATUS_COLOR[e.status]}`} aria-hidden="true" />
            <span className="text-[0.6875rem] uppercase tracking-[0.14em] text-faint">
              {STATUS_LABEL[e.status]}
            </span>
          </div>
        </motion.li>
      ))}
    </motion.ol>
  );
}
