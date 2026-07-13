import type { Project } from '@/types';
import { Card } from '@/components/admin/ui/Card';
import { Badge } from '@/components/admin/ui/Badge';
import { ProjectActions } from './ProjectActions';

export interface ProjectCardProps {
  project: Project;
  onEdit: () => void;
  onDelete: () => void;
  onToggleFeatured: () => void;
}

const STATUS_TONE: Record<Project['status'], 'success' | 'warning' | 'neutral' | 'info'> = {
  live: 'success',
  'in-progress': 'warning',
  archived: 'neutral',
  concept: 'info',
};

/** Grid-view card for one project. */
export function ProjectCard({ project, onEdit, onDelete, onToggleFeatured }: ProjectCardProps) {
  return (
    <Card padding="none" className="flex flex-col overflow-hidden">
      <div className="aspect-video bg-[var(--color-bg)] relative overflow-hidden">
        {project.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={project.image} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[var(--color-faint)] text-xs">No cover</div>
        )}
      </div>
      <div className="flex flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-medium text-[var(--color-ink)] truncate">{project.title}</h3>
          <Badge tone={STATUS_TONE[project.status]} size="sm">
            {project.status}
          </Badge>
        </div>
        <p className="text-xs text-[var(--color-faint)] truncate">
          {project.category ?? 'Uncategorised'}
          {project.year ? ` · ${project.year}` : ''}
        </p>
        <div className="flex items-center justify-between pt-1 mt-1 border-t border-[var(--color-border)]">
          {project.featured ? (
            <Badge tone="info" size="sm">
              Featured
            </Badge>
          ) : (
            <span />
          )}
          <ProjectActions
            featured={project.featured}
            onToggleFeatured={onToggleFeatured}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </div>
      </div>
    </Card>
  );
}
