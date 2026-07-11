import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center text-center gap-3 py-16 px-6', className)}>
      {icon && (
        <span
          aria-hidden="true"
          className="flex items-center justify-center w-14 h-14 rounded-[var(--radius-lg)] bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-faint)] [&>svg]:w-6 [&>svg]:h-6"
        >
          {icon}
        </span>
      )}
      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium text-[var(--color-ink)]">{title}</p>
        {description && <p className="text-xs text-[var(--color-faint)] max-w-xs">{description}</p>}
      </div>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
