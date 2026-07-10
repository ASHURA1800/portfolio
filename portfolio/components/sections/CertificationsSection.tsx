'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { SectionContainer } from '@/components/ui/SectionContainer';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { MotionReveal } from '@/components/ui/MotionReveal';
import type { Certification } from '@/types';

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
      className={`relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-border bg-surface transition-opacity duration-500 ${
        loaded ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <Image src={src} alt={alt} fill sizes="40px" onLoad={() => setLoaded(true)} className="object-cover" />
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
      .catch(() => {})
      .finally(() => { if (active) setReady(true); });
    return () => { active = false; };
  }, []);

  if (!ready || items.length === 0) return null;

  return (
    <SectionContainer id="certifications" width="wide">
      <SectionHeading eyebrow="Credentials" title="Certifications" />

      <ul className="mt-14 max-w-3xl space-y-0 border-t border-border">
        {items.map((cert, i) => {
          const issued = formatIssued(cert.issued_date);

          const inner = (
            <article className="group flex gap-4 border-b border-border py-5 transition-colors duration-200 hover:bg-surface/50 px-1 -mx-1 rounded-lg">
              {cert.image && <CertImage src={cert.image} alt={cert.title} />}
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-4 flex-wrap">
                  <h3 className="flex items-center gap-1.5 text-sm font-semibold text-ink transition-colors duration-200 group-hover:text-accent-400">
                    {cert.title}
                    {cert.credential_url && (
                      <ArrowUpRight
                        size={12}
                        aria-hidden="true"
                        className="text-faint opacity-0 transition-opacity group-hover:opacity-100"
                      />
                    )}
                  </h3>
                  {issued && (
                    <span className="whitespace-nowrap text-xs tabular-nums text-faint">{issued}</span>
                  )}
                </div>
                <p className="mt-0.5 text-xs text-muted">{cert.issuer}</p>
                {cert.description && (
                  <p className="mt-2 text-xs leading-relaxed text-muted">{cert.description}</p>
                )}
                {cert.skills?.length > 0 && (
                  <ul className="mt-2.5 flex flex-wrap gap-1.5">
                    {cert.skills.map((skill) => (
                      <li key={skill} className="tech-pill">{skill}</li>
                    ))}
                  </ul>
                )}
              </div>
            </article>
          );

          return (
            <li key={cert.id}>
              <MotionReveal delay={Math.min(i * 0.04, 0.4)} from="up">
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
              </MotionReveal>
            </li>
          );
        })}
      </ul>
    </SectionContainer>
  );
}
