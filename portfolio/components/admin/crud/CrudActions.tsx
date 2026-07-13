import type { ReactNode } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { IconButton } from '@/components/admin/ui/IconButton';

export interface CrudActionsProps {
  onEdit?: () => void;
  onDelete?: () => void;
  /** Extra buttons (e.g. a "feature" toggle), rendered before edit/delete */
  extra?: ReactNode;
  editLabel?: string;
  deleteLabel?: string;
}

/** Standard per-row action cluster. The manager still owns what edit/delete
 *  actually do (calling its own fetch handlers) — this only standardizes
 *  the buttons' look and hit targets. */
export function CrudActions({ onEdit, onDelete, extra, editLabel = 'Edit', deleteLabel = 'Delete' }: CrudActionsProps) {
  return (
    <div className="flex items-center gap-1.5 shrink-0">
      {extra}
      {onEdit && <IconButton label={editLabel} icon={<Pencil size={15} />} onClick={onEdit} variant="ghost" />}
      {onDelete && <IconButton label={deleteLabel} icon={<Trash2 size={15} />} onClick={onDelete} variant="danger" />}
    </div>
  );
}
