import { cn } from '@/lib/utils';

export interface AuthDividerProps {
  label?: string;
  className?: string;
}

/** Horizontal rule with optional centered label — "or", "or continue with", etc. */
export function AuthDivider({ label = 'or', className }: AuthDividerProps) {
  return (
    <div className={cn('flex items-center gap-3', className)} role="separator">
      <span className="h-px flex-1 bg-[var(--color-border)]" />
      {label && <span className="text-xs text-[var(--color-faint)] shrink-0">{label}</span>}
      <span className="h-px flex-1 bg-[var(--color-border)]" />
    </div>
  );
}
