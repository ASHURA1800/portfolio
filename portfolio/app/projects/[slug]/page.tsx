import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ArrowLeft, ArrowRight, ArrowUpRight, Code } from 'lucide-react';
import { getProjectBySlug, getCaseStudySlugs, getProjects } from '@/lib/content';
import type { ProjectStatus } from '@/types';
import { Button } from '@/components/ui/Button';

const STATUS_LABEL: Record<ProjectStatus, string> = {
  live: 'Live',
  'in-progress': 'In progress',
  archived: 'Archived',
  concept: 'Concept',
};

// DB-driven, so allow slugs that didn't exist at build time; ISR keeps it fast.
export const dynamicParams = true;
export const revalidate = 60;

export async function generateStaticParams() {
  return (await getCaseStudySlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project || !project.case_study) return { title: 'Project not found' };

  const description = project.description || project.solution || undefined;
  const canonical = `/projects/${slug}`;
  const cover = project.image || project.screenshots[0];

  return {
    title: project.title,
    description,
    alternates: { canonical },
    openGraph: {
      type: 'article',
      url: canonical,
      title: project.title,
      description,
      ...(cover ? { images: [{ url: cover }] } : {}),
    },
  };
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-accent-400">
        {label}
      </h2>
      {children}
    </section>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2.5">
      {items.map((it, i) => (
        <li key={i} className="flex max-w-[70ch] gap-3 leading-relaxed text-muted">
          <span className="mt-2.5 h-1 w-1 flex-none rounded-full bg-accent-400" />
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project || !project.case_study) notFound();

  const images = project.screenshots;
  const overview = project.long_description || project.description;

  // prev/next within the case-study set only (the only pages that exist)
  const all = await getProjects();
  const caseStudies = all.filter((p) => p.case_study && p.slug);
  const idx = caseStudies.findIndex((p) => p.slug === slug);
  const prev = idx > 0 ? caseStudies[idx - 1] : null;
  const next = idx >= 0 && idx < caseStudies.length - 1 ? caseStudies[idx + 1] : null;

  return (
    <main className="px-[var(--space-gutter)] py-24">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/#projects"
          className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-ink"
        >
          <ArrowLeft size={15} />
          Back to projects
        </Link>

        <header className="mt-10">
          <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.16em] text-faint">
            <span>{project.year}</span>
            <span className="text-line">·</span>
            <span>{STATUS_LABEL[project.status]}</span>
            {project.category && (
              <>
                <span className="text-line">·</span>
                <span>{project.category}</span>
              </>
            )}
          </div>
          <h1 className="mt-4 text-4xl font-normal leading-[1.1] tracking-tight text-ink md:text-5xl">
            {project.title}
          </h1>
          {overview && (
            <p className="mt-5 max-w-[70ch] text-xl leading-relaxed text-muted">{overview}</p>
          )}
        </header>

        <div className="mt-12 space-y-10">
          {project.problem && (
            <Section label="Problem">
              <p className="max-w-[70ch] leading-relaxed text-muted">{project.problem}</p>
            </Section>
          )}
          {(project.solution || project.description) && (
            <Section label="Solution">
              <p className="max-w-[70ch] leading-relaxed text-muted">
                {project.solution || project.description}
              </p>
            </Section>
          )}

          {project.tech_stack.length > 0 && (
            <Section label="Tech stack">
              <div className="flex flex-wrap gap-2">
                {project.tech_stack.map((t) => (
                  <span
                    key={t}
                    className="rounded-md border border-line px-2.5 py-1 text-xs text-muted"
                  >
                    {t}
                  </span>
                ))}
              </div>
              {project.stack_reasoning && (
                <p className="mt-4 max-w-[70ch] leading-relaxed text-muted">
                  {project.stack_reasoning}
                </p>
              )}
            </Section>
          )}

          {project.challenges.length > 0 && (
            <Section label="Challenges">
              <BulletList items={project.challenges} />
            </Section>
          )}
          {project.learnings.length > 0 && (
            <Section label="Learnings">
              <BulletList items={project.learnings} />
            </Section>
          )}
          {project.metrics.length > 0 && (
            <Section label="Results">
              <dl className="flex flex-wrap gap-x-12 gap-y-4">
                {project.metrics.map((m) => (
                  <div key={m.label}>
                    <dt className="text-xs uppercase tracking-[0.14em] text-faint">{m.label}</dt>
                    <dd className="mt-1 text-2xl text-ink">{m.value}</dd>
                  </div>
                ))}
              </dl>
            </Section>
          )}
        </div>
      </div>

      {/* Screenshots — break out wider than the 70ch text column. Click to open
          full-size in a new tab (no modal, no lightbox JS). */}
      {images.length > 0 && (
        <div className="mx-auto mt-14 max-w-5xl">
          <div className="space-y-5">
            {images.map((src) => (
              <a
                key={src}
                href={src}
                target="_blank"
                rel="noopener noreferrer"
                className="block overflow-hidden rounded-xl border border-line bg-card"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={`${project.title} screenshot`}
                  loading="lazy"
                  className="w-full"
                />
              </a>
            ))}
          </div>
        </div>
      )}

      <div className="mx-auto mt-14 max-w-3xl">
        {(project.live_url || project.github_url) && (
          <div className="flex flex-wrap items-center gap-3">
            {project.live_url && (
              <Button
                href={project.live_url}
                external
                icon={<ArrowUpRight size={15} />}
                iconPosition="right"
              >
                Live demo
              </Button>
            )}
            {project.github_url && (
              <Button href={project.github_url} external variant="secondary" icon={<Code size={15} />}>
                View code
              </Button>
            )}
          </div>
        )}

        {(prev || next) && (
          <nav className="mt-12 flex items-center justify-between gap-4 border-t border-line pt-6 text-sm">
            {prev ? (
              <Link
                href={`/projects/${prev.slug}`}
                className="inline-flex items-center gap-2 text-muted transition-colors hover:text-ink"
              >
                <ArrowLeft size={15} />
                {prev.title}
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link
                href={`/projects/${next.slug}`}
                className="inline-flex items-center gap-2 text-muted transition-colors hover:text-ink"
              >
                {next.title}
                <ArrowRight size={15} />
              </Link>
            ) : (
              <span />
            )}
          </nav>
        )}
      </div>
    </main>
  );
}
