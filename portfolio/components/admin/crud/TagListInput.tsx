'use client';

import { TagInput } from '@/components/admin/ui/TagInput';

export interface TagListInputProps {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  max?: number;
  hint?: string;
}

/** Thin wrapper over the canonical TagInput — kept as its own file so
 *  existing manager imports (BuildLog tags, Roadmap deliverables) don't
 *  need to change. */
export function TagListInput(props: TagListInputProps) {
  return <TagInput {...props} />;
}
