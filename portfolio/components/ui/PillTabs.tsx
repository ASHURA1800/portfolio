'use client';

import { motion } from 'motion/react';

interface PillTabsProps<T extends string> {
  options: readonly T[];
  active: T;
  onChange: (value: T) => void;
  /** Unique per-instance id so multiple PillTabs on one page don't share a layoutId animation. */
  layoutId: string;
  label: string;
  /** Base id for aria-controls wiring to a tabpanel — omit if there's no single panel to point to. */
  idPrefix?: string;
}

/**
 * Animated pill-background tab group (spring-morphs between the active
 * tab via a shared layoutId). Used by Skills category tabs and Projects
 * filter tabs — was two near-identical implementations before.
 */
export function PillTabs<T extends string>({
  options,
  active,
  onChange,
  layoutId,
  label,
  idPrefix,
}: PillTabsProps<T>) {
  return (
    <div
      role="tablist"
      aria-label={label}
      className="scrollbar-hide -mx-[var(--space-gutter)] flex gap-2 overflow-x-auto px-[var(--space-gutter)] pb-1 sm:mx-0 sm:flex-wrap sm:px-0"
    >
      {options.map((opt) => {
        const isActive = opt === active;
        return (
          <button
            key={opt}
            type="button"
            role="tab"
            id={idPrefix ? `${idPrefix}-tab-${opt}` : undefined}
            aria-selected={isActive}
            aria-controls={idPrefix ? `${idPrefix}-panel-${opt}` : undefined}
            onClick={() => onChange(opt)}
            className={`relative shrink-0 rounded-full px-4 py-2 text-xs font-medium tracking-wide transition-colors duration-200 ${
              isActive ? 'text-ink' : 'text-faint hover:text-muted'
            }`}
          >
            {isActive && (
              <motion.span
                layoutId={layoutId}
                className="absolute inset-0 rounded-full border border-accent-500/40 bg-accent-500/10"
                transition={{ type: 'spring', stiffness: 380, damping: 32 }}
              />
            )}
            <span className="relative">{opt}</span>
          </button>
        );
      })}
    </div>
  );
}
