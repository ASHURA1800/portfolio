'use client';

import { TagInput } from '@/components/admin/ui/TagInput';

export interface ProjectTagsProps {
  label: string;
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder: string;
}

/** Thin wrapper over the canonical TagInput — kept as its own file so
 *  ProjectForm's import doesn't need to change. */
export function ProjectTags({ label, tags, onChange, placeholder }: ProjectTagsProps) {
  return <TagInput label={label} values={tags} onChange={onChange} placeholder={placeholder} />;
}
