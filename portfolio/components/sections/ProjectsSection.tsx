'use client';

import { Code, ArrowUpRight, FileText } from 'lucide-react';
import { SectionContainer } from '@/components/ui/SectionContainer';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { ProjectFrame } from '@/components/ui/ProjectFrame';
import { Button } from '@/components/ui/Button';
import type { Project } from '@/types';
import { useAnalytics } from '@/hooks/useAnalytics';

function ProjectBlock({ project, index }: { project: Project; index: number }) {
  const { track } = useAnalytics();
  const reversed = index % 2 === 1; // alternating — large screens only
  const keyLearning = project.learnings[0];

  return (
    <Reveal>
      <article
        className={`grid items-center gap-10 lg:grid-cols-2 lg:gap-16 ${
          reversed ? 'lg:[&>*:first-child]:order-2' : ''
        }`}
      >
        <ProjectFrame src={project.image ?? undefined} alt={`${project.title} preview`} />

        <div>
          {/* Year (+ quiet category context) — typography only, no badges */}
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-faint">
            <span>{project.year}</span>
            {project.category && (
              <>
                <span className="text-line">·</span>
                <span>{project.category}</span>
              </>
            )}
          </div>

          <h3 className="mt-3 font-serif text-3xl md:text-4xl font-normal tracking-tight text-ink">
            {project.title}
          </h3>

          {/* Story first: problem → solution */}
          <div className="mt-5 space-y-4">
            {project.problem && (
              <div>
                <div className="mb-1 text-xs uppercase tracking-[0.15em] text-faint">
                  Problem
                </div>
                <p className="max-w-[55ch] leading-relaxed text-muted">
                  {project.problem}
                </p>
              </div>
            )}
            {(project.solution || project.description) && (
              <div>
                <div className="mb-1 text-xs uppercase tracking-[0.15em] text-faint">
                  Solution
                </div>
                <p className="max-w-[55ch] leading-relaxed text-muted">
                  {project.solution || project.description}
                </p>
              </div>
            )}
          </div>

          {project.tech_stack.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {project.tech_stack.map((t) => (
                <span
                  key={t}
                  className="rounded-md border border-line px-2.5 py-1 text-xs text-muted"
                >
                  {t}
                </span>
              ))}
            </div>
          )}

          {/* Key learning teaser — first learning only, shown only if present */}
          {keyLearning && (
            <p className="mt-6 max-w-[55ch] leading-relaxed text-ink">
              <span className="font-medium text-accent-700">Key learning → </span>
              {keyLearning}
            </p>
          )}

          {/* Buttons: Case Study → Live → GitHub (story-first), only if present */}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            {project.case_study && project.slug && (
              <Button href={`/projects/${project.slug}`} icon={<FileText size={15} />}>
                Case study
              </Button>
            )}
            {project.live_url && (
              <Button
                href={project.live_url}
                external
                variant="secondary"
                icon={<ArrowUpRight size={15} />}
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
                variant="secondary"
                icon={<Code size={15} />}
                onClick={() =>
                  track('project_click', { project: project.title, type: 'github' })
                }
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
        title="Things I've"
        highlight="built"
        description="A few projects worth talking about — what they solve, how they're built, and what I took away."
      />

      <div className="mt-16 space-y-20 md:space-y-28">
        {projects.map((p, i) => (
          <ProjectBlock key={p.id} project={p} index={i} />
        ))}

      </div>

      {githubUrl && (
        <div className="mt-20">
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track('github_click', { source: 'projects_more' })}
            className="inline-flex items-center gap-2 text-sm font-medium text-muted hover:text-ink transition-colors duration-200"
          >
            <Code size={16} />
            More on GitHub
            <ArrowUpRight size={16} />
          </a>
        </div>
      )}
    </SectionContainer>
  );
}
