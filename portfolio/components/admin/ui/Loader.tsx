import { cn } from '@/lib/utils';
import { Spinner } from './Spinner';

export interface LoaderProps {
  label?: string;
  /** Fill the parent container's height rather than sizing to content. */
  fullHeight?: boolean;
  className?: string;
}

/** Section/page-level loading state — a centered Spinner with optional label. */
export function Loader({ label = 'Loading…', fullHeight = false, className }: LoaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 text-[var(--color-faint)] py-12',
        fullHeight && 'h-full min-h-[16rem]',
        className
      )}
    >
      <Spinner size="lg" className="text-[var(--color-accent-500)]" label={label} />
      <p aria-hidden="true" className="text-sm">
        {label}
      </p>
    </div>
  );
}
