import { Star, Pencil, Trash2 } from 'lucide-react';
import { IconButton } from '@/components/admin/ui/IconButton';
import { cn } from '@/lib/utils';

export interface ProjectActionsProps {
  featured: boolean;
  onToggleFeatured: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

/** Standard action cluster for a project card/row — feature toggle, edit,
 *  delete. The manager still owns what each handler actually does
 *  (toggleFeatured/startEdit/the delete confirm flow); this only
 *  standardizes the buttons. */
export function ProjectActions({ featured, onToggleFeatured, onEdit, onDelete }: ProjectActionsProps) {
  return (
    <div className="flex items-center gap-1 shrink-0">
      <IconButton
        label={featured ? 'Unfeature' : 'Feature'}
        icon={<Star size={15} className={cn(featured && 'fill-current')} />}
        onClick={onToggleFeatured}
        variant="ghost"
        className={featured ? 'text-[var(--color-accent-400)]' : undefined}
        aria-pressed={featured}
      />
      <IconButton label="Edit" icon={<Pencil size={15} />} onClick={onEdit} variant="ghost" />
      <IconButton label="Delete" icon={<Trash2 size={15} />} onClick={onDelete} variant="danger" />
    </div>
  );
}
