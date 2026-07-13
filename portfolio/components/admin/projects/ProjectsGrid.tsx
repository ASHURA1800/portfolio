import type { Project } from '@/types';
import { CrudGrid, CrudList } from '@/components/admin/crud';
import { ProjectCard } from './ProjectCard';
import { ProjectActions } from './ProjectActions';
import { Badge } from '@/components/admin/ui/Badge';

export interface ProjectsGridProps {
  projects: Project[];
  view: 'grid' | 'list';
  onEdit: (p: Project) => void;
  onDelete: (p: Project) => void;
  onToggleFeatured: (p: Project) => void;
}

const STATUS_TONE: Record<Project['status'], 'success' | 'warning' | 'neutral' | 'info'> = {
  live: 'success',
  'in-progress': 'warning',
  archived: 'neutral',
  concept: 'info',
};

/** Card/list toggle for the projects collection — same data, two layouts.
 *  Reuses CrudGrid/CrudList from the Phase 6.1 framework rather than a
 *  bespoke grid. */
export function ProjectsGrid({ projects, view, onEdit, onDelete, onToggleFeatured }: ProjectsGridProps) {
  if (view === 'grid') {
    return (
      <CrudGrid cols={3}>
        {projects.map((p) => (
          <ProjectCard
            key={p.id}
            project={p}
            onEdit={() => onEdit(p)}
            onDelete={() => onDelete(p)}
            onToggleFeatured={() => onToggleFeatured(p)}
          />
        ))}
      </CrudGrid>
    );
  }

  return (
    <CrudList>
      {projects.map((p) => (
        <li key={p.id} className="flex items-center gap-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-[var(--color-ink)] font-medium truncate">{p.title}</span>
              <Badge tone={STATUS_TONE[p.status]} size="sm">
                {p.status}
              </Badge>
              {p.featured && (
                <Badge tone="info" size="sm">
                  Featured
                </Badge>
              )}
            </div>
            <div className="text-[var(--color-faint)] text-sm truncate">
              {p.category ?? 'Uncategorised'} {p.year ? `· ${p.year}` : ''} {p.slug ? `· /${p.slug}` : ''}
            </div>
          </div>
          <ProjectActions
            featured={p.featured}
            onToggleFeatured={() => onToggleFeatured(p)}
            onEdit={() => onEdit(p)}
            onDelete={() => onDelete(p)}
          />
        </li>
      ))}
    </CrudList>
  );
}
