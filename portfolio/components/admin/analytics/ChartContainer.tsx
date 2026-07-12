'use client';

import type { ReactNode } from 'react';
import { motion } from 'motion/react';
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

export function ChartContainer({
  title,
  description,
  children,
  isEmpty = false,
  emptyLabel = 'Not enough data yet',
  height = 260,
  className,
}: ChartContainerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className={cn('admin-chart-container', className)}
    >
      <div className="admin-chart-header">
        <h3 className="admin-chart-title">{title}</h3>
        {description && <p className="admin-chart-description">{description}</p>}
      </div>

      {isEmpty ? (
        <div className="admin-chart-empty" style={{ height }}>
          <span>{emptyLabel}</span>
        </div>
      ) : (
        <div style={{ width: '100%', height }}>{children}</div>
      )}
    </motion.div>
  );
}
