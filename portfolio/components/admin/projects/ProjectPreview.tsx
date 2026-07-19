import Image from 'next/image';
import { Link2, Sparkles } from 'lucide-react';
import type { ProjectStatus } from '@/types';

// Matches components/sections/ProjectCard.tsx's STATUS_LABEL exactly, so
// the preview shows the same wording the public site will.
const STATUS_LABEL: Record<ProjectStatus, string> = {
  live: 'Live',
  'in-progress': 'In progress',
  archived: 'Archived',
  concept: 'Concept',
};

export interface ProjectPreviewProps {
  title: string;
  description: string;
  image: string;
  techStack: string[];
  status: ProjectStatus;
  featured: boolean;
  githubUrl: string;
  liveUrl: string;
}

/** Read-only live preview of the project card as it'll roughly appear on
 *  the public site — driven entirely by current form state (no separate
 *  fetch). Simplified compared to the real public ProjectCard (no tilt
 *  interaction, no analytics tracking) since this lives inside an editor. */
export function ProjectPreview({ title, description, image, techStack, status, featured, githubUrl, liveUrl }: ProjectPreviewProps) {
  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] overflow-hidden bg-[var(--color-surface)]">
      <div className="aspect-video bg-[var(--color-bg)] relative overflow-hidden">
        {image ? (
          <Image src={image} alt="" fill sizes="(max-width: 768px) 100vw, 500px" className="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[var(--color-faint)] text-xs">
            No cover image
          </div>
        )}
        {featured && (
          <span className="absolute top-2 right-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[var(--color-accent-500)]/90 text-white text-[10px] font-medium">
            <Sparkles size={10} /> Featured
          </span>
        )}
      </div>
      <div className="p-4 flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-sm font-semibold text-[var(--color-ink)] truncate min-w-0">{title || 'Untitled project'}</h3>
          <span className="text-[10px] text-[var(--color-faint)] uppercase tracking-wide shrink-0">
            {STATUS_LABEL[status]}
          </span>
        </div>
        {description && <p className="text-xs text-[var(--color-muted)] line-clamp-2">{description}</p>}
        {techStack.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-1">
            {techStack.slice(0, 5).map((t) => (
              <span key={t} className="px-2 py-0.5 rounded-md bg-[var(--color-accent-500)]/10 text-[var(--color-accent-300)] text-[10px]">
                {t}
              </span>
            ))}
          </div>
        )}
        {(githubUrl || liveUrl) && (
          <div className="flex items-center gap-3 mt-1">
            {githubUrl && <Link2 size={13} className="text-[var(--color-faint)]" aria-label="GitHub link set" />}
            {liveUrl && <Link2 size={13} className="text-[var(--color-accent-400)]" aria-label="Live link set" />}
          </div>
        )}
      </div>
    </div>
  );
}
