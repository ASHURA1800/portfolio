'use client';

import { AnimatePresence, motion } from 'motion/react';
import { Loader } from './Loading';
import { Progress } from './Loading';
import { fadeIn } from './motion-presets';

/**
 * Blocking overlay for an in-progress operation scoped to a specific
 * surface (a card, a form, a table) — absolutely positioned over its
 * nearest `relative` ancestor. Distinct from PageLoader (route-level) and
 * Toast (non-blocking, transient).
 */
export function LoadingOverlay({ active, label = 'Loading' }: { active: boolean; label?: string }) {
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate="show"
          exit="exit"
          role="status"
          aria-live="polite"
          className="absolute inset-0 z-30 flex items-center justify-center rounded-[inherit] bg-bg-elevated/80 backdrop-blur-sm"
        >
          <Loader label={label} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Same blocking-overlay shape as LoadingOverlay, but for determinate progress (uploads). */
export function ProgressOverlay({
  active,
  value,
  label = 'Uploading',
}: {
  active: boolean;
  value: number;
  label?: string;
}) {
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate="show"
          exit="exit"
          role="status"
          aria-live="polite"
          className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-3 rounded-[inherit] bg-bg-elevated/85 backdrop-blur-sm p-6"
        >
          <div className="w-full max-w-[220px]">
            <Progress value={value} label={label} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
