'use client';

import { useCallback, useId } from 'react';
import type { ReactNode } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { X } from 'lucide-react';
import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { backdropFade, modalSurface } from './motion-presets';
import { useFocusTrap } from './useFocusTrap';

type ModalSize = 'sm' | 'md' | 'lg' | 'fullscreen';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  size?: ModalSize;
  children: ReactNode;
  footer?: ReactNode;
  /** Hides the close (X) button — pair with a footer that has its own dismiss action. */
  hideCloseButton?: boolean;
}

const SIZE_CLASSES: Record<ModalSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-2xl',
  fullscreen: 'h-[calc(100vh-2rem)] max-w-[calc(100vw-2rem)]',
};

/**
 * Base overlay every dialog variant (Dialog, ConfirmDialog, DeleteDialog)
 * is built on. Handles backdrop blur, focus trap + Escape (via
 * useFocusTrap), body scroll lock, and portals to document.body so it
 * always renders above the admin sidebar/content regardless of stacking
 * context.
 */
export function Modal({ open, onClose, title, description, size = 'md', children, footer, hideCloseButton }: ModalProps) {
  const [mounted, setMounted] = useState(false);
  const titleId = useId();
  const descId = useId();

  useEffect(() => setMounted(true), []);

  const handleClose = useCallback(() => onClose(), [onClose]);
  const containerRef = useFocusTrap<HTMLDivElement>(open, handleClose);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            variants={backdropFade}
            initial="hidden"
            animate="show"
            exit="exit"
            onClick={handleClose}
            className="absolute inset-0 bg-overlay/70 backdrop-blur-sm"
            aria-hidden="true"
          />
          <motion.div
            ref={containerRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? titleId : undefined}
            aria-describedby={description ? descId : undefined}
            tabIndex={-1}
            variants={modalSurface}
            initial="hidden"
            animate="show"
            exit="exit"
            className={cn(
              'relative flex w-full flex-col overflow-hidden rounded-[var(--radius-lg)] border border-border-hover bg-bg-elevated shadow-pop',
              SIZE_CLASSES[size],
            )}
          >
            {(title || !hideCloseButton) && (
              <div className="flex items-start justify-between gap-4 border-b border-border p-5">
                <div>
                  {title && (
                    <h2 id={titleId} className="text-base font-semibold text-ink">
                      {title}
                    </h2>
                  )}
                  {description && (
                    <p id={descId} className="mt-1 text-sm text-faint">
                      {description}
                    </p>
                  )}
                </div>
                {!hideCloseButton && (
                  <button
                    type="button"
                    onClick={handleClose}
                    aria-label="Close dialog"
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-sm)] text-faint transition-colors hover:bg-surface hover:text-ink"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            )}

            <div className="flex-1 overflow-y-auto p-5">{children}</div>

            {footer && <div className="flex items-center justify-end gap-2 border-t border-border p-4">{footer}</div>}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
