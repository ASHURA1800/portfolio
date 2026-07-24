'use client';

import { motion } from 'motion/react';
import type { RoadmapItem, RoadmapStatus } from '@/types';

const EASE = [0.22, 1, 0.36, 1] as const;

const STATUS_STYLE: Record<RoadmapStatus, string> = {
  done: 'text-faint line-through',
  'in-progress': 'text-ink',
  planned: 'text-muted',
};

const STATUS_DOT: Record<RoadmapStatus, string> = {
  done: 'bg-success/50',
  'in-progress': 'bg-accent-500',
  planned: 'bg-border-strong',
};

const STATUS_LABEL: Record<RoadmapStatus, string> = {
  done: 'Done',
  'in-progress': 'In progress',
  planned: 'Planned',
};

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};

const row = {
  hidden: { opacity: 0, x: -12 },
  show: { opacity: 1, x: 0, transition: { duration: 0.4, ease: EASE } },
};

export function RoadmapList({ roadmap }: { roadmap: RoadmapItem[] }) {
  return (
    <motion.ul
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-10% 0px' }}
      className="relative max-w-2xl space-y-3"
    >
      {/* Connection line running behind milestones */}
      <div
        className="absolute left-[0.9375rem] top-2 bottom-2 w-px bg-border"
        aria-hidden="true"
      />
      {roadmap.map((item) => (
        <motion.li
          key={item.task}
          variants={row}
          whileHover={{ x: 4 }}
          transition={{ duration: 0.2 }}
          className="clay relative flex items-center gap-4 px-4 py-4"
        >
          <span className="relative shrink-0">
            <span className={`status-dot ${STATUS_DOT[item.status]}`} aria-hidden="true" />
            {item.status === 'done' && (
              <motion.span
                className="absolute inset-0 -m-1 rounded-full border border-success"
                initial={{ scale: 0.6, opacity: 0.8 }}
                animate={{ scale: 1.8, opacity: 0 }}
                transition={{ duration: 1.2, ease: EASE }}
                aria-hidden="true"
              />
            )}
          </span>
          <span className={`flex-1 text-sm ${STATUS_STYLE[item.status]}`}>{item.task}</span>
          <span className="shrink-0 text-[0.625rem] uppercase tracking-[0.14em] text-faint/70">
            {STATUS_LABEL[item.status]}
          </span>
        </motion.li>
      ))}
    </motion.ul>
  );
}
