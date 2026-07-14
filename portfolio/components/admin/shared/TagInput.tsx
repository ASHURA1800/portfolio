'use client';

import { TagInput as BaseTagInput } from '@/components/admin/ui/TagInput';

export interface TagInputProps {
  label?: string;
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  /** Cosmetic only — accent color of the chips. Defaults to the neutral admin chip style. */
  variant?: 'neutral' | 'cyan';
}

/** Thin wrapper over the canonical ui/TagInput using the `tags` prop name
 *  expected by ExperienceManager. `variant` is accepted for API
 *  compatibility; chip coloring itself stays neutral (Chip doesn't expose
 *  a color prop) so this doesn't fork visual behavior across managers. */
export function TagInput({ label, tags, onChange, placeholder }: TagInputProps) {
  return <BaseTagInput label={label} values={tags} onChange={onChange} placeholder={placeholder} />;
}
