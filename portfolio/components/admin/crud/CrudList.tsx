import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface CrudListProps {
  children: ReactNode;
  className?: string;
}

/** Vertical row-list layout — matches the existing pattern used by
 *  Projects and similar managers (full-width items, stacked). Renders a
 *  real <ul> since items are enumerable, discrete records. */
export function CrudList({ children, className }: CrudListProps) {
  return <ul className={cn('flex flex-col gap-3', className)}>{children}</ul>;
}
