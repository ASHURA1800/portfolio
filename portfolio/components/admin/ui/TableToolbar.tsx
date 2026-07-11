import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function TableToolbar({
  children,
  count,
  countLabel = 'items',
  className,
}: {
  children: ReactNode;
  count?: number;
  countLabel?: string;
  className?: string;
}) {
  return (
    <div className={cn('flex flex-col gap-3 pb-4 sm:flex-row sm:items-center sm:justify-between', className)}>
      <div className="flex flex-1 flex-wrap items-center gap-2">{children}</div>
      {count !== undefined && (
        <span className="shrink-0 text-xs text-faint">
          {count} {countLabel}
        </span>
      )}
    </div>
  );
}
