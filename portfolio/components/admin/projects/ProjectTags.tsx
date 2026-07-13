'use client';

import { useState } from 'react';
import { Chip } from '@/components/admin/ui/Chip';
import { Input } from '@/components/admin/ui/Input';
import { Button } from '@/components/admin/ui/Button';

export interface ProjectTagsProps {
  label: string;
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder: string;
}

/** Tag/chip list editor — same add/dedupe/remove logic as the audited
 *  TagInput (case-insensitive dedupe, Enter or comma to add), rebuilt on
 *  the real Chip + Input components instead of raw markup. Used for
 *  tech_stack, learnings, and challenges — all plain string[] fields. */
export function ProjectTags({ label, tags, onChange, placeholder }: ProjectTagsProps) {
  const [draft, setDraft] = useState('');

  const add = () => {
    const v = draft.trim();
    if (!v || tags.some((t) => t.toLowerCase() === v.toLowerCase())) {
      setDraft('');
      return;
    }
    onChange([...tags, v]);
    setDraft('');
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs text-[var(--color-faint)] font-medium">{label}</label>
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((t) => (
            <Chip key={t} size="sm" onRemove={() => onChange(tags.filter((x) => x !== t))}>
              {t}
            </Chip>
          ))}
        </div>
      )}
      <div className="flex gap-2">
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ',') {
              e.preventDefault();
              add();
            }
          }}
          placeholder={placeholder}
          containerClassName="flex-1"
        />
        <Button type="button" variant="secondary" size="md" onClick={add}>
          Add
        </Button>
      </div>
    </div>
  );
}
