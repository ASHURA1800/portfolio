'use client';

import { AnimatePresence, motion } from 'motion/react';
import { Check, Loader2, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

export type AutosaveState = 'idle' | 'dirty' | 'saving' | 'saved';

export interface AutosaveIndicatorProps {
  state: AutosaveState;
  className?: string;
}

const CONFIG: Record<AutosaveState, { icon: typeof Check; label: string; className: string }> = {
  idle: { icon: Check, label: 'Up to date', className: 'text-[var(--color-faint)]' },
  dirty: { icon: Circle, label: 'Unsaved changes', className: 'text-[var(--color-warning)]' },
  saving: { icon: Loader2, label: 'Saving…', className: 'text-[var(--color-accent-400)]' },
  saved: { icon: Check, label: 'Saved', className: 'text-[var(--color-success)]' },
};

/** Status pill reflecting the form's real saving/saved/dirty state — this
 *  is presentation only. There's no autosave timer here: the manager
 *  still saves exclusively via its existing explicit Save button and
 *  PATCH call. This just gives the person a persistent read of whether
 *  their edits are saved, matching the "UI only" scope in the spec. */
export function AutosaveIndicator({ state, className }: AutosaveIndicatorProps) {
  const { icon: Icon, label, className: toneClass } = CONFIG[state];

  return (
    <div className={cn('inline-flex items-center gap-1.5 text-xs', toneClass, className)}>
      <AnimatePresence mode="wait">
        <motion.span
          key={state}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.15 }}
          className="inline-flex items-center gap-1.5"
        >
          <Icon size={12} className={state === 'saving' ? 'animate-spin' : state === 'dirty' ? 'fill-current' : undefined} />
          {label}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}
