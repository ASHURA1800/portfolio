import type { ReactNode } from 'react';
import { FileX2 } from 'lucide-react';
import { EmptyState } from './EmptyState';
import { SkeletonTable } from './Loading';
import { Button } from './Button';

/**
 * Convenience wrapper over EmptyState with CRUD-appropriate defaults
 * (a "nothing here yet, create the first one" framing) — most managers
 * just need this instead of assembling EmptyState props by hand.
 */
export function EmptyTable({
  itemLabel,
  onCreate,
  createLabel,
}: {
  /** Lowercase plural, e.g. "projects", "certifications". */
  itemLabel: string;
  onCreate?: () => void;
  createLabel?: string;
}) {
  return (
    <EmptyState
      icon={<FileX2 size={20} strokeWidth={1.5} />}
      title={`No ${itemLabel} yet`}
      description={`Once you add ${itemLabel}, they'll show up here.`}
      primaryAction={
        onCreate && (
          <Button size="sm" onClick={onCreate}>
            {createLabel ?? `Add ${itemLabel.replace(/s$/, '')}`}
          </Button>
        )
      }
    />
  );
}

/** Re-export under the CRUD-facing name this phase's spec asks for. */
export function TableSkeleton({ rows, columns }: { rows?: number; columns?: number }): ReactNode {
  return <SkeletonTable rows={rows} columns={columns} />;
}
