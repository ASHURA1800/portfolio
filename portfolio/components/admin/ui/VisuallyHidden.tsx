import type { ReactNode } from 'react';

/** Screen-reader-only content — visually hidden, still announced. */
export function VisuallyHidden({ children }: { children: ReactNode }) {
  return (
    <span className="absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0 [clip:rect(0,0,0,0)]">
      {children}
    </span>
  );
}
