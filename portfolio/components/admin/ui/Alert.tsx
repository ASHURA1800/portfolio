'use client';

import type { ReactNode } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { slideDown } from './motion-presets';

type AlertVariant = 'success' | 'error' | 'warning' | 'info';

const VARIANT_ICON: Record<AlertVariant, typeof CheckCircle2> = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const VARIANT_CLASSES: Record<AlertVariant, string> = {
  success: 'border-success/30 bg-success-bg text-success',
  error: 'border-error/30 bg-error-bg text-error',
  warning: 'border-warning/30 bg-warning-bg text-warning',
  info: 'border-accent-500/30 bg-accent-500/10 text-accent-300',
};

/** Inline, persistent feedback block (form-level errors, page notices) — not a transient popup like Toast. */
export function Alert({
  variant = 'info',
  title,
  children,
  onDismiss,
  className,
}: {
  variant?: AlertVariant;
  title?: string;
  children: ReactNode;
  onDismiss?: () => void;
  className?: string;
}) {
  const Icon = VARIANT_ICON[variant];

  return (
    <motion.div
      variants={slideDown}
      initial="hidden"
      animate="show"
      exit="exit"
      role={variant === 'error' ? 'alert' : 'status'}
      className={cn('flex items-start gap-3 rounded-[var(--radius-md)] border p-3.5', VARIANT_CLASSES[variant], className)}
    >
      <Icon size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
      <div className="min-w-0 flex-1 text-sm">
        {title && <p className="font-medium text-ink">{title}</p>}
        <div className={cn(title && 'mt-0.5', 'text-current')}>{children}</div>
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss"
          className="relative shrink-0 text-current opacity-70 before:absolute before:-inset-2.5 before:content-[''] hover:opacity-100"
        >
          <X size={14} />
        </button>
      )}
    </motion.div>
  );
}

/** Full-width top-of-page banner — same variants as Alert, different placement/weight. */
export function Banner({
  variant = 'info',
  children,
  onDismiss,
  className,
}: {
  variant?: AlertVariant;
  children: ReactNode;
  onDismiss?: () => void;
  className?: string;
}) {
  const Icon = VARIANT_ICON[variant];

  return (
    <motion.div
      variants={slideDown}
      initial="hidden"
      animate="show"
      exit="exit"
      role={variant === 'error' ? 'alert' : 'status'}
      className={cn('flex items-center gap-3 border-b px-5 py-3', VARIANT_CLASSES[variant], className)}
    >
      <Icon size={16} className="shrink-0" aria-hidden="true" />
      <div className="flex-1 text-sm">{children}</div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss"
          className="relative shrink-0 opacity-70 before:absolute before:-inset-2.5 before:content-[''] hover:opacity-100"
        >
          <X size={14} />
        </button>
      )}
    </motion.div>
  );
}
