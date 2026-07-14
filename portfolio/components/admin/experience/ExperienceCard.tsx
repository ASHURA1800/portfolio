'use client';

import { motion } from 'motion/react';
import { Pencil, Trash2 } from 'lucide-react';
import type { Experience } from '@/types';
import { IconButton } from '@/components/admin/ui/IconButton';
import { Badge } from '@/components/admin/ui/Badge';
import { Chip } from '@/components/admin/ui/Chip';
import { staggerItem } from '@/components/admin/ui/motion-presets';

interface ExperienceCardProps {
  item: Experience;
  onEdit: (x: Experience) => void;
  onDelete: (x: Experience) => void;
  isLast: boolean;
  index: number;
}

/** Single timeline entry for the Experience manager — role, company,
 *  dates, tech stack, impact bullets. Sits inside ExperienceManager's own
 *  timeline container; the vertical connector line is drawn per-item
 *  since ExperienceManager renders these directly (not through
 *  CrudList/CrudListItem). */
export function ExperienceCard({ item, onEdit, onDelete, isLast }: ExperienceCardProps) {
  return (
    <motion.div variants={staggerItem} initial="hidden" animate="show" className="relative pl-6 sm:pl-8 pb-6 last:pb-0">
      {!isLast && (
        <div aria-hidden="true" className="absolute left-[7px] sm:left-[11px] top-5 bottom-0 w-px bg-[var(--color-border)]" />
      )}
      <span
        aria-hidden="true"
        className="absolute left-0 sm:left-1 top-1.5 w-3.5 h-3.5 rounded-full border-2 border-[var(--color-bg)] ring-2 ring-[var(--color-border)]"
        style={{ background: item.current ? 'var(--color-success)' : 'var(--color-faint)' }}
      />
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-4 hover:border-[var(--color-border-hover)] transition-colors">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-[var(--color-faint)]">
                {item.start_date} — {item.current ? 'Present' : item.end_date || '—'}
              </span>
              {item.current && <Badge tone="success" size="sm">Current</Badge>}
              <Badge tone="neutral" size="sm">{item.type}</Badge>
            </div>
            <h3 className="text-[var(--color-ink)] font-medium mt-1">{item.role}</h3>
            <p className="text-sm text-[var(--color-muted)]">
              {item.company}{item.location ? ` · ${item.location}` : ''}
            </p>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <IconButton label="Edit" icon={<Pencil size={15} />} variant="ghost" onClick={() => onEdit(item)} />
            <IconButton label="Delete" icon={<Trash2 size={15} />} variant="danger" onClick={() => onDelete(item)} />
          </div>
        </div>

        {item.description && <p className="text-sm text-[var(--color-muted)] mt-2">{item.description}</p>}

        {item.impact?.length > 0 && (
          <ul className="mt-3 space-y-1">
            {item.impact.map((line, i) => (
              <li key={i} className="text-xs text-[var(--color-muted)] flex items-start gap-1.5">
                <span className="text-[var(--color-faint)] mt-0.5">•</span> {line}
              </li>
            ))}
          </ul>
        )}

        {item.tech_stack?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-[var(--color-border)]">
            {item.tech_stack.map((t) => <Chip key={t} size="sm">{t}</Chip>)}
          </div>
        )}

        {item.achievements?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {item.achievements.map((a) => <Badge key={a} tone="info" size="sm">{a}</Badge>)}
          </div>
        )}
      </div>
    </motion.div>
  );
}
