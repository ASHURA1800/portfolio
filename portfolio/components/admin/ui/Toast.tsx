'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'motion/react';
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toastSlide } from './motion-presets';
import { useMotionVariants } from '@/lib/motion/use-motion-variants';

type ToastVariant = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  variant: ToastVariant;
  title: string;
  description?: string;
}

interface ToastContextValue {
  toast: (t: Omit<Toast, 'id'>) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const VARIANT_ICON: Record<ToastVariant, typeof CheckCircle2> = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const VARIANT_CLASSES: Record<ToastVariant, string> = {
  success: 'border-success/30 text-success',
  error: 'border-error/30 text-error',
  warning: 'border-warning/30 text-warning',
  info: 'border-accent-500/30 text-accent-300',
};

const DURATION_MS = 4500;

/**
 * Mount once near the root of the admin layout. Everything below calls
 * `useToast().toast(...)` — no per-page toast plumbing needed.
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (t: Omit<Toast, 'id'>) => {
      const id = crypto.randomUUID();
      setToasts((prev) => [...prev, { ...t, id }]);
      window.setTimeout(() => dismiss(id), DURATION_MS);
    },
    [dismiss],
  );

  const toastVariants = useMotionVariants(toastSlide);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {mounted &&
        createPortal(
          <div className="pointer-events-none fixed bottom-4 right-4 z-[200] flex w-full max-w-sm flex-col gap-2">
            <AnimatePresence>
              {toasts.map((t) => {
                const Icon = VARIANT_ICON[t.variant];
                return (
                  <motion.div
                    key={t.id}
                    layout
                    variants={toastVariants}
                    initial="hidden"
                    animate="show"
                    exit="exit"
                    role="status"
                    className={cn(
                      'pointer-events-auto flex items-start gap-3 rounded-[var(--radius-md)] border bg-bg-elevated p-3.5 shadow-lg',
                      VARIANT_CLASSES[t.variant],
                    )}
                  >
                    <Icon size={17} className="mt-0.5 shrink-0" aria-hidden="true" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-ink">{t.title}</p>
                      {t.description && <p className="mt-0.5 text-xs text-faint">{t.description}</p>}
                    </div>
                    <button
                      type="button"
                      onClick={() => dismiss(t.id)}
                      aria-label="Dismiss notification"
                      className="relative shrink-0 text-faint transition-colors before:absolute before:-inset-2.5 before:content-[''] hover:text-ink"
                    >
                      <X size={14} />
                    </button>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>,
          document.body,
        )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a ToastProvider');
  return ctx;
}
