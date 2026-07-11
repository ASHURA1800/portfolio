'use client';

import type { ReactNode } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { X } from 'lucide-react';
import { slideDown } from './motion-presets';

export function BulkActions({
  count,
  onClear,
  children,
}: {
  count: number;
  onClear: () => void;
  children: ReactNode;
}) {
  return (
    <AnimatePresence>
      {count > 0 && (
        <motion.div
          variants={slideDown}
          initial="hidden"
          animate="show"
          exit="exit"
          className="flex items-center gap-3 rounded-[var(--radius-md)] border border-accent-500/30 bg-accent-500/8 px-4 py-2.5"
        >
          <button
            type="button"
            onClick={onClear}
            aria-label="Clear selection"
            className="flex items-center gap-1.5 text-xs font-medium text-accent-300 hover:text-accent-200"
          >
            <X size={13} />
            {count} selected
          </button>
          <span className="h-4 w-px bg-accent-500/25" aria-hidden="true" />
          <div className="flex items-center gap-2">{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
