'use client';

import type { ReactNode } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { cn } from '@/lib/utils';

export interface ChartContainerProps {
  title: string;
  description?: string;
  children: ReactNode;
  /** Pass true when the underlying data array is empty. Renders a
   *  placeholder instead of an empty chart canvas. */
  isEmpty?: boolean;
  emptyLabel?: string;
  height?: number;
  className?: string;
}

const EASE = [0.22, 1, 0.36, 1] as const;

export function ChartContainer({
  title,
  description,
  children,
  isEmpty = false,
  emptyLabel = 'Not enough data yet',
  height = 260,
  className,
}: ChartContainerProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: EASE }}
      className={cn('admin-chart-container', className)}
    >
      <div className="admin-chart-header">
        <h3 className="admin-chart-title">{title}</h3>
        {description && <p className="admin-chart-description">{description}</p>}
      </div>

      {/* Mobile: horizontal scroll so recharts axes/legends never get
          crushed on narrow viewports instead of overflowing or clipping. */}
      <div className="admin-chart-scroll">
        <AnimatePresence mode="wait" initial={false}>
          {isEmpty ? (
            <motion.div
              key="empty"
              className="admin-chart-empty"
              style={{ height }}
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reduceMotion ? undefined : { opacity: 0 }}
              transition={{ duration: 0.2, ease: EASE }}
            >
              <span>{emptyLabel}</span>
            </motion.div>
          ) : (
            <motion.div
              key="chart"
              style={{ width: '100%', height }}
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reduceMotion ? undefined : { opacity: 0 }}
              transition={{ duration: 0.2, ease: EASE }}
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
