'use client';

import { Award, ExternalLink, Pencil, Star, Trash2 } from 'lucide-react';
import type { Certification } from '@/types';
import { CrudGrid } from '@/components/admin/crud/CrudGrid';
import { CrudCard } from '@/components/admin/crud/CrudCard';
import { CrudEmptyState } from '@/components/admin/crud/CrudEmptyState';
import { Badge } from '@/components/admin/ui/Badge';
import { IconButton } from '@/components/admin/ui/IconButton';
import { Chip } from '@/components/admin/ui/Chip';

function isExpired(expiry: string | null | undefined): boolean {
  if (!expiry) return false;
  return new Date(expiry) < new Date();
}

interface CertificationGridProps {
  certs: Certification[];
  onEdit: (c: Certification) => void;
  onDelete: (c: Certification) => void;
  onToggleFeatured: (c: Certification) => void;
  onPreview: (c: Certification) => void;
}

/** Card grid for certifications — badge image, issuer, expiry state, skills. */
export function CertificationGrid({ certs, onEdit, onDelete, onToggleFeatured, onPreview }: CertificationGridProps) {
  if (certs.length === 0) {
    return <CrudEmptyState icon={<Award />} title="No certifications" description="Add your first certification to populate the public section." />;
  }

  return (
    <CrudGrid cols={3}>
      {certs.map((c) => {
        const expired = isExpired(c.expiry_date);
        return (
          <CrudCard key={c.id} layoutId={c.id} className="flex flex-col bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-4 hover:border-[var(--color-border-hover)] transition-colors">
            <div className="flex items-start justify-between gap-2 mb-3">
              <button
                type="button"
                onClick={() => onPreview(c)}
                className="flex items-center justify-center h-12 w-12 rounded-[var(--radius-md)] bg-[var(--color-surface-hover)] border border-[var(--color-border)] text-2xl shrink-0 overflow-hidden"
                aria-label="Preview badge"
              >
                {c.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={c.image} alt={c.title} className="h-full w-full object-cover" />
                ) : (
                  c.icon
                )}
              </button>
              <div className="flex items-center gap-1 shrink-0">
                <IconButton
                  label={c.is_featured ? 'Unfeature' : 'Feature'}
                  icon={<Star size={14} className={c.is_featured ? 'fill-current' : ''} />}
                  size="sm"
                  variant="ghost"
                  onClick={() => onToggleFeatured(c)}
                />
                <IconButton label="Edit" icon={<Pencil size={14} />} size="sm" variant="ghost" onClick={() => onEdit(c)} />
                <IconButton label="Delete" icon={<Trash2 size={14} />} size="sm" variant="danger" onClick={() => onDelete(c)} />
              </div>
            </div>

            <h3 className="text-[var(--color-ink)] font-medium leading-tight">{c.title}</h3>
            <p className="text-sm text-[var(--color-muted)] mt-0.5">{c.issuer}</p>

            <div className="flex items-center gap-2 flex-wrap mt-2">
              {c.is_featured && <Badge tone="info" size="sm">Featured</Badge>}
              {expired ? <Badge tone="error" size="sm">Expired</Badge> : c.expiry_date && <Badge tone="success" size="sm">Active</Badge>}
              {c.issued_date && <span className="text-xs text-[var(--color-faint)]">{c.issued_date}</span>}
            </div>

            {c.skills?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-[var(--color-border)]">
                {c.skills.slice(0, 4).map((s) => <Chip key={s} size="sm">{s}</Chip>)}
                {c.skills.length > 4 && <Chip size="sm">+{c.skills.length - 4}</Chip>}
              </div>
            )}

            {c.credential_url && (
              <a
                href={c.credential_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-[var(--color-accent-400)] hover:text-[var(--color-accent-300)] transition-colors mt-3"
              >
                <ExternalLink size={11} /> View credential
              </a>
            )}
          </CrudCard>
        );
      })}
    </CrudGrid>
  );
}
