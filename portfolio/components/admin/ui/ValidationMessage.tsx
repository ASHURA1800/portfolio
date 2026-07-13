import { AlertCircle, CheckCircle2, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ValidationTone = 'error' | 'warning' | 'success' | 'info';

export interface ValidationMessageProps {
  tone?: ValidationTone;
  children: React.ReactNode;
  className?: string;
}

const TONE_CONFIG: Record<ValidationTone, { icon: typeof AlertCircle; color: string }> = {
  error: { icon: AlertCircle, color: 'text-[var(--color-error)]' },
  warning: { icon: AlertCircle, color: 'text-[var(--color-warning)]' },
  success: { icon: CheckCircle2, color: 'text-[var(--color-success)]' },
  info: { icon: Info, color: 'text-[var(--color-faint)]' },
};

/**
 * Single-line field-level feedback with an icon — the standard shape for
 * form validation across every admin form (replaces ad-hoc `<p className="text-error">`
 * one-offs). Use role="alert" tone for errors so screen readers announce
 * changes immediately.
 */
export function ValidationMessage({ tone = 'error', children, className }: ValidationMessageProps) {
  const { icon: Icon, color } = TONE_CONFIG[tone];
  return (
    <p
      role={tone === 'error' ? 'alert' : undefined}
      className={cn('flex items-start gap-1.5 text-xs', color, className)}
    >
      <Icon size={13} className="shrink-0 mt-[1px]" />
      <span>{children}</span>
    </p>
  );
}
