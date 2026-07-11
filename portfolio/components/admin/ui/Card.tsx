import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  interactive?: boolean;
  padding?: 'sm' | 'md' | 'none';
}

const PADDING = {
  none: 'p-0',
  sm: 'p-[var(--admin-space-card-sm)]',
  md: 'p-[var(--admin-space-card)]',
};

export function Card({ children, interactive = false, padding = 'md', className, ...rest }: CardProps) {
  return (
    <div
      className={cn(
        'admin-card',
        padding !== 'md' && PADDING[padding],
        interactive && 'cursor-pointer hover:shadow-[var(--shadow-md)]',
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
