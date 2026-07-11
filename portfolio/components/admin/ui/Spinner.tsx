import { cn } from '@/lib/utils';

type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg';

const SIZES: Record<SpinnerSize, string> = {
  xs: 'w-3 h-3 border-[1.5px]',
  sm: 'w-4 h-4 border-2',
  md: 'w-5 h-5 border-2',
  lg: 'w-7 h-7 border-[2.5px]',
};

interface SpinnerProps {
  size?: SpinnerSize;
  className?: string;
  /** Announced to screen readers; visually hidden. Defaults to "Loading". */
  label?: string;
}

export function Spinner({ size = 'md', className, label = 'Loading' }: SpinnerProps) {
  return (
    <span
      role="status"
      aria-live="polite"
      className={cn(
        'inline-block rounded-full border-current border-t-transparent animate-spin',
        'text-[currentColor] motion-reduce:animate-[spin_1.5s_linear_infinite]',
        SIZES[size],
        className
      )}
    >
      <span className="sr-only">{label}</span>
    </span>
  );
}
