'use client';

import { useId, useState, type ReactNode, cloneElement, isValidElement } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { cn } from '@/lib/utils';

export interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  side?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

const SIDE_POSITION: Record<NonNullable<TooltipProps['side']>, string> = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  right: 'left-full top-1/2 -translate-y-1/2 ml-2',
};

const SIDE_OFFSET: Record<NonNullable<TooltipProps['side']>, { x?: number; y?: number }> = {
  top: { y: 4 },
  bottom: { y: -4 },
  left: { x: 4 },
  right: { x: -4 },
};

/**
 * Hover + keyboard-focus tooltip. Wraps a single child, attaching the
 * trigger's aria-describedby so the tooltip text is announced on focus,
 * not just shown visually on hover.
 */
export function Tooltip({ content, children, side = 'top', className }: TooltipProps) {
  const [open, setOpen] = useState(false);
  const tooltipId = useId();

  const trigger = isValidElement(children)
    ? cloneElement(children as React.ReactElement<Record<string, unknown>>, {
        'aria-describedby': tooltipId,
        onMouseEnter: () => setOpen(true),
        onMouseLeave: () => setOpen(false),
        onFocus: () => setOpen(true),
        onBlur: () => setOpen(false),
      })
    : children;

  return (
    <span className="relative inline-flex">
      {trigger}
      <AnimatePresence>
        {open && (
          <motion.span
            role="tooltip"
            id={tooltipId}
            initial={{ opacity: 0, ...SIDE_OFFSET[side] }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, ...SIDE_OFFSET[side] }}
            transition={{ duration: 0.15 }}
            className={cn(
              'absolute z-[var(--z-admin-dropdown)] pointer-events-none whitespace-nowrap',
              'bg-[var(--color-card)] border border-[var(--color-border-hover)] rounded-[var(--radius-sm)]',
              'px-2 py-1 text-xs text-[var(--color-ink)] shadow-[var(--shadow-md)]',
              SIDE_POSITION[side],
              className
            )}
          >
            {content}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}
