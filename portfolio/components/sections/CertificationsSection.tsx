'use client';

import { useEffect, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { SectionContainer } from '@/components/ui/SectionContainer';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import type { Certification } from '@/types';

// Data lives in Neon, managed from /admin/certifications. Fetched client-side
// so the homepage stays statically prerendered. Only real credentials render.

function formatIssued(date?: string | null): string {
  if (!date) return '';
  const d = new Date(`${date}T00:00:00`);
  if (Number.isNaN(d.getTime())) return date;
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

function CertImage({ src, alt }: { src: string; alt: string }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div
      className={`relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-line bg-muted-surface transition-opacity duration-500 ${
        loaded ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        className="h-full w-full object-cover"
      />
    </div>
  );
}

export function CertificationsSection() {
  const [items, setItems] = useState<Certification[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    fetch('/api/certifications?limit=100')
      .then((r) => (r.ok ? r.json() : null))
      .then((json) => {
        if (!active) return;
        const list: Certification[] = json?.data?.items ?? [];
        list.sort((a, b) => Number(b.is_featured) - Number(a.is_featured));
        setItems(list);
      })
      .catch(() => {
        /* leave empty on failure — no fake data */
      })
      .finally(() => {
        if (active) setReady(true);
      });
    return () => {
      active = false;
    };
  }, []);

  // Don't render until the fetch settles — no hollow section flash.
  if (!ready) return null;

  // No certifications in DB — don't render a hollow section.
  if (items.length === 0) return null;

  return (
    <SectionContainer id="certifications" width="wide">
      <SectionHeading eyebrow="Credentials" title="Certifications" />

      <Reveal className="mt-14">
        <ul className="max-w-3xl space-y-4">
          {items.map((cert) => {
            const issued = formatIssued(cert.issued_date);
            const inner = (
              <article className="group flex gap-4 rounded-xl border border-line bg-surface p-5 transition-colors duration-200 hover:border-accent-300">
                {cert.image && <CertImage src={cert.image} alt={cert.title} />}
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="flex items-center gap-1.5 font-medium text-ink transition-colors duration-200 group-hover:text-accent-700">
                      {cert.title}
                      {cert.credential_url && (
                        <ArrowUpRight
                          size={14}
                          aria-hidden="true"
                          className="text-faint opacity-0 transition-opacity group-hover:opacity-100"
                        />
                      )}
                    </h3>
                    {issued && (
                      <span className="whitespace-nowrap text-sm text-faint">
                        {issued}
                      </span>
                    )}
                  </div>

                  <div className="mt-0.5 text-sm text-muted">{cert.issuer}</div>

                  {cert.description && (
                    <p className="mt-2 text-sm leading-relaxed text-muted">
                      {cert.description}
                    </p>
                  )}

                  {cert.skills?.length > 0 && (
                    <ul className="mt-3 flex flex-wrap gap-1.5">
                      {cert.skills.map((skill) => (
                        <li
                          key={skill}
                          className="rounded-md border border-line bg-muted-surface px-2 py-0.5 text-xs text-muted"
                        >
                          {skill}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </article>
            );

            return (
              <li key={cert.id}>
                {cert.credential_url ? (
                  <a
                    href={cert.credential_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${cert.title} — view credential`}
                  >
                    {inner}
                  </a>
                ) : (
                  inner
                )}
              </li>
            );
          })}
        </ul>
      </Reveal>
    </SectionContainer>
  );
}
