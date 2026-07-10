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
      className="max-w-2xl space-y-0 border-t border-border"
    >
      {roadmap.map((item) => (
        <motion.li
          key={item.task}
          variants={row}
          whileHover={{ x: 4 }}
          transition={{ duration: 0.2 }}
          className="flex items-center gap-4 border-b border-border py-4"
        >
          <span className={`status-dot shrink-0 ${STATUS_DOT[item.status]}`} aria-hidden="true" />
          <span className={`flex-1 text-sm ${STATUS_STYLE[item.status]}`}>{item.task}</span>
          <span className="shrink-0 text-[0.625rem] uppercase tracking-[0.14em] text-faint/70">
            {STATUS_LABEL[item.status]}
          </span>
        </motion.li>
      ))}
    </motion.ul>
  );
}
