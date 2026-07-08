'use client';

import { Code, ArrowUpRight, FileText } from 'lucide-react';
import Image from 'next/image';
import { SectionContainer } from '@/components/ui/SectionContainer';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal, staggerDelay } from '@/components/ui/Reveal';
import { Button } from '@/components/ui/Button';
import type { Project } from '@/types';
import { useAnalytics } from '@/hooks/useAnalytics';

function ProjectImage({ src, alt }: { src?: string; alt: string }) {
  if (!src) {
    return (
      <div className="aspect-[16/10] w-full rounded-xl border border-line bg-surface flex items-center justify-center">
        <span className="text-xs text-faint">No preview</span>
      </div>
    );
  }
  return (
    <div className="aspect-[16/10] w-full overflow-hidden rounded-xl border border-line bg-surface">
      <Image
        src={src}
        alt={alt}
        width={800}
        height={500}
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
      />
    </div>
  );
}

function ProjectBlock({ project, index }: { project: Project; index: number }) {
  const { track } = useAnalytics();
  const reversed = index % 2 === 1;
  const keyLearning = project.learnings[0];
  const num = String(index + 1).padStart(2, '0');

  return (
    <Reveal delay={staggerDelay(index, 60)}>
      <article
        className={`group grid items-start gap-10 lg:grid-cols-2 lg:gap-16 ${
          reversed ? 'lg:[&>*:first-child]:order-2' : ''
        }`}
      >
        {/* Image */}
        <div className="overflow-hidden">
          <ProjectImage src={project.image ?? undefined} alt={`${project.title} preview`} />
        </div>

        {/* Content */}
        <div className="flex flex-col justify-center">
          {/* Number + meta */}
          <div className="flex items-center gap-3 mb-4">
            <span className="text-[0.6875rem] font-medium tabular-nums text-accent-500/60">
              {num}
            </span>
            <span className="h-px flex-1 max-w-[2rem] bg-line" aria-hidden="true" />
            <span className="text-[0.6875rem] uppercase tracking-[0.16em] text-faint">
              {project.year}
              {project.category && <> · {project.category}</>}
            </span>
          </div>

          <h3 className="text-2xl md:text-3xl font-semibold tracking-[-0.02em] text-ink leading-tight">
            {project.title}
          </h3>

          {/* Story */}
          <div className="mt-5 space-y-4">
            {project.problem && (
              <div>
                <p className="mb-1 text-[0.625rem] uppercase tracking-[0.16em] text-faint">Problem</p>
                <p className="max-w-[52ch] text-sm leading-relaxed text-muted">{project.problem}</p>
              </div>
            )}
            {(project.solution || project.description) && (
              <div>
                <p className="mb-1 text-[0.625rem] uppercase tracking-[0.16em] text-faint">Solution</p>
                <p className="max-w-[52ch] text-sm leading-relaxed text-muted">
                  {project.solution || project.description}
                </p>
              </div>
            )}
          </div>

          {/* Stack */}
          {project.tech_stack.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-1.5">
              {project.tech_stack.map((t) => (
                <span key={t} className="tech-pill">{t}</span>
              ))}
            </div>
          )}

          {/* Key learning */}
          {keyLearning && (
            <div className="mt-5 editorial-bar">
              <p className="text-xs text-muted leading-relaxed">{keyLearning}</p>
            </div>
          )}

          {/* Actions */}
          <div className="mt-7 flex flex-wrap items-center gap-2.5">
            {project.case_study && project.slug && (
              <Button href={`/projects/${project.slug}`} size="sm" icon={<FileText size={13} />}>
                Case study
              </Button>
            )}
            {project.live_url && (
              <Button
                href={project.live_url}
                external
                variant="secondary"
                size="sm"
                icon={<ArrowUpRight size={13} />}
                iconPosition="right"
                onClick={() => track('live_url_click', { project: project.title })}
              >
                Live demo
              </Button>
            )}
            {project.github_url && (
              <Button
                href={project.github_url}
                external
                variant="ghost"
                size="sm"
                icon={<Code size={13} />}
                onClick={() => track('project_click', { project: project.title, type: 'github' })}
              >
                Code
              </Button>
            )}
          </div>
        </div>
      </article>
    </Reveal>
  );
}

export function ProjectsSection({
  projects,
  githubUrl,
}: {
  projects: Project[];
  githubUrl: string;
}) {
  const { track } = useAnalytics();
  if (projects.length === 0) return null;

  return (
    <SectionContainer id="projects" width="wide">
      <SectionHeading
        eyebrow="Selected work"
        title="Things I've built"
        description="A few projects worth talking about — what they solve, how they're built, and what I took away."
      />

      <div className="mt-16 space-y-24 md:space-y-32">
        {projects.map((p, i) => (
          <ProjectBlock key={p.id} project={p} index={i} />
        ))}
      </div>

      {githubUrl && (
        <div className="mt-20 pt-8 border-t border-line">
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track('github_click', { source: 'projects_more' })}
            className="inline-flex items-center gap-2 text-sm text-faint hover:text-ink transition-colors duration-200"
          >
            More on GitHub
            <ArrowUpRight size={14} />
          </a>
        </div>
      )}
    </SectionContainer>
  );
}
