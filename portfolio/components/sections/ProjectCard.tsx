'use client';

import { useRef } from 'react';
import Image from 'next/image';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from 'motion/react';
import { ArrowUpRight, FileText, Sparkles } from 'lucide-react';
import { SocialIcon } from '@/components/ui/SocialIcon';
import type { Project } from '@/types';
import { useAnalytics } from '@/hooks/useAnalytics';

const EASE = [0.22, 1, 0.36, 1] as const;

const STATUS_LABEL: Record<Project['status'], string> = {
  live: 'Live',
  'in-progress': 'In progress',
  archived: 'Archived',
  concept: 'Concept',
};

export function ProjectCard({
  project,
  index,
  priority = false,
}: {
  project: Project;
  index: number;
  priority?: boolean;
}) {
  const { track } = useAnalytics();
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const mvX = useMotionValue(0);
  const mvY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mvY, [-0.5, 0.5], [7, -7]), {
    stiffness: 200,
    damping: 22,
  });
  const rotateY = useSpring(useTransform(mvX, [-0.5, 0.5], [-7, 7]), {
    stiffness: 200,
    damping: 22,
  });
  const glowX = useTransform(mvX, [-0.5, 0.5], [0, 100]);
  const glowY = useTransform(mvY, [-0.5, 0.5], [0, 100]);

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduceMotion) return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mvX.set((e.clientX - rect.left) / rect.width - 0.5);
    mvY.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const onPointerLeave = () => {
    mvX.set(0);
    mvY.set(0);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.07, 0.35), ease: EASE }}
      className="group relative h-full"
    >
      <motion.div
        ref={ref}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        style={
          reduceMotion
            ? undefined
            : { rotateX, rotateY, transformPerspective: 1000 }
        }
        className="brutalist relative flex h-full flex-col overflow-hidden"
      >
        {/* Cursor-follow spotlight */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: reduceMotion
              ? undefined
              : `radial-gradient(400px circle at ${glowX}% ${glowY}%, var(--hero-glow-1), transparent 60%)`,
          }}
        />

        {/* Image */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-surface">
          {project.image ? (
            <Image
              src={project.image}
              alt={`${project.title} preview`}
              fill
              loading={priority ? undefined : 'lazy'}
              priority={priority}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <Sparkles size={22} className="text-faint" strokeWidth={1.5} />
            </div>
          )}

          {/* Animated overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/20 to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-90" />

          {/* Status + featured badges */}
          <div className="absolute left-4 top-4 flex items-center gap-2">
            {project.featured && (
              <span className="flex items-center gap-1 rounded-full border border-accent-500/40 bg-accent-500/15 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-accent-200 backdrop-blur-md">
                <Sparkles size={10} />
                Featured
              </span>
            )}
            <span className="rounded-full border border-border-hover bg-bg/60 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-muted backdrop-blur-md">
              {STATUS_LABEL[project.status]}
            </span>
          </div>

          {/* Hover-revealed action buttons over the image */}
          <div className="absolute inset-x-4 bottom-4 flex translate-y-2 items-center gap-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            {project.live_url && (
              <a
                href={project.live_url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track('live_url_click', { project: project.title })}
                className="btn btn-primary btn-sm"
              >
                <ArrowUpRight size={13} />
                Live demo
              </a>
            )}
            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track('project_click', { project: project.title, type: 'github' })}
                aria-label={`View ${project.title} on GitHub`}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-border-hover bg-bg/70 text-ink backdrop-blur-md transition-colors hover:bg-bg"
              >
                <SocialIcon name="Github" size={14} />
              </a>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col p-5">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-faint">
            <span>{project.year}</span>
            {project.category && (
              <>
                <span aria-hidden="true">·</span>
                <span>{project.category}</span>
              </>
            )}
          </div>

          <h3 className="mt-2 text-lg font-bold leading-tight tracking-tight text-ink">
            {project.title}
          </h3>

          {(project.subtitle || project.description) && (
            <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">
              {project.subtitle || project.description}
            </p>
          )}

          {/* Tech stack icons/pills */}
          {project.tech_stack.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {project.tech_stack.slice(0, 5).map((t) => (
                <span key={t} className="tech-pill">
                  {t}
                </span>
              ))}
              {project.tech_stack.length > 5 && (
                <span className="tech-pill">+{project.tech_stack.length - 5}</span>
              )}
            </div>
          )}

          {project.case_study && project.slug && (
            <a
              href={`/projects/${project.slug}`}
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-accent-300 transition-colors hover:text-accent-200"
            >
              <FileText size={12} />
              Read case study
            </a>
          )}
        </div>
      </motion.div>
    </motion.article>
  );
}
