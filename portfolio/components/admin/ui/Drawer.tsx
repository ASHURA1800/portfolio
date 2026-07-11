'use client';

import { useCallback, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'motion/react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { backdropFade, drawerSlide } from './motion-presets';
import { useFocusTrap } from './useFocusTrap';

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  width?: 'sm' | 'md' | 'lg';
}

const WIDTH_CLASSES = { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-lg' };

export function Drawer({ open, onClose, title, children, footer, width = 'md' }: DrawerProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const handleClose = useCallback(() => onClose(), [onClose]);
  const containerRef = useFocusTrap<HTMLDivElement>(open, handleClose);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100]">
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
            tabIndex={-1}
            variants={drawerSlide}
            initial="hidden"
            animate="show"
            exit="exit"
            className={cn(
              'absolute right-0 top-0 flex h-full w-full flex-col border-l border-border-hover bg-bg-elevated shadow-pop',
              WIDTH_CLASSES[width],
            )}
          >
            <div className="flex items-center justify-between border-b border-border p-5">
              {title && <h2 className="text-base font-semibold text-ink">{title}</h2>}
              <button
                type="button"
                onClick={handleClose}
                aria-label="Close panel"
                className="ml-auto flex h-11 w-11 items-center justify-center rounded-[var(--radius-sm)] text-faint transition-colors hover:bg-surface hover:text-ink"
              >
                <X size={16} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5">{children}</div>
            {footer && <div className="flex items-center justify-end gap-2 border-t border-border p-4">{footer}</div>}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
