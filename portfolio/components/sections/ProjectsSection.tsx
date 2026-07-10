'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { SectionContainer } from '@/components/ui/SectionContainer';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { MotionReveal } from '@/components/ui/MotionReveal';
import { PillTabs } from '@/components/ui/PillTabs';
import { ProjectCard } from '@/components/sections/ProjectCard';
import type { Project } from '@/types';
import { useAnalytics } from '@/hooks/useAnalytics';

const EASE = [0.22, 1, 0.36, 1] as const;

export function ProjectsSection({
  projects,
  githubUrl,
}: {
  projects: Project[];
  githubUrl: string;
}) {
  const { track } = useAnalytics();

  const categories = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => p.category && set.add(p.category));
    return Array.from(set);
  }, [projects]);

  const hasFeatured = projects.some((p) => p.featured);
  const filters = ['All', ...(hasFeatured ? ['Featured'] : []), ...categories];
  const [active, setActive] = useState('All');

  const filtered = useMemo(() => {
    if (active === 'All') return projects;
    if (active === 'Featured') return projects.filter((p) => p.featured);
    return projects.filter((p) => p.category === active);
  }, [projects, active]);

  if (projects.length === 0) return null;

  return (
    <SectionContainer id="projects" width="wide" className="relative">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[-6%] top-[30%] h-72 w-72 rounded-full bg-accent-500/8 blur-[100px]" />
      </div>

      <MotionReveal>
        <SectionHeading
          eyebrow="Selected work"
          title="Things I've built"
          description="A few projects worth talking about — what they solve, how they're built, and what I took away."
        />
      </MotionReveal>

      {/* Filter tabs */}
      {filters.length > 2 && (
        <MotionReveal delay={0.08} className="mt-10">
          <PillTabs
            options={filters}
            active={active}
            onChange={setActive}
            layoutId="projects-tab-bg"
            label="Filter projects"
          />
        </MotionReveal>
      )}

      {/* Desktop/tablet grid */}
      <div className="mt-10 hidden sm:block">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: EASE }}
            className="grid grid-cols-2 gap-6 lg:grid-cols-3"
          >
            {filtered.map((p, i) => (
              <ProjectCard key={p.id} project={p} index={i} priority={i < 2} />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Mobile: horizontal scroll-snap carousel */}
      <div className="mt-10 sm:hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: EASE }}
            className="scrollbar-hide -mx-[var(--space-gutter)] flex snap-x snap-mandatory gap-4 overflow-x-auto px-[var(--space-gutter)] pb-2"
          >
            {filtered.map((p, i) => (
              <div key={p.id} className="w-[85vw] shrink-0 snap-center">
                <ProjectCard project={p} index={i} priority={i === 0} />
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {githubUrl && (
        <MotionReveal delay={0.1} className="mt-16 border-t border-border pt-8">
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track('github_click', { source: 'projects_more' })}
            className="inline-flex items-center gap-2 text-sm text-faint transition-colors duration-200 hover:text-ink"
          >
            More on GitHub
            <ArrowUpRight size={14} />
          </a>
        </MotionReveal>
      )}
    </SectionContainer>
  );
}
