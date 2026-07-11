import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  label?: ReactNode;
  className?: string;
}

export function Divider({ orientation = 'horizontal', label, className }: DividerProps) {
  if (orientation === 'vertical') {
    return <span role="separator" aria-orientation="vertical" className={cn('inline-block w-px self-stretch bg-[var(--color-border)]', className)} />;
  }

  if (label) {
    return (
      <div role="separator" className={cn('flex items-center gap-3 text-xs text-[var(--color-faint)]', className)}>
        <span className="h-px flex-1 bg-[var(--color-border)]" />
        <span>{label}</span>
        <span className="h-px flex-1 bg-[var(--color-border)]" />
      </div>
    );
  }

  return <hr className={cn('border-0 h-px bg-[var(--color-border)]', className)} />;
}
