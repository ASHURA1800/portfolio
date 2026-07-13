import Link from 'next/link';
import type { Skill } from '@/types';

export interface SkillsPreviewProps {
  skills: Skill[];
}

/** Read-only preview of the real Skills data, shown inside the Profile
 *  Manager for context (profile and skills are separate DB tables/pages
 *  in this app — this doesn't merge or edit them, just links across). */
export function SkillsPreview({ skills }: SkillsPreviewProps) {
  if (skills.length === 0) {
    return (
      <p className="text-xs text-[var(--color-faint)]">
        No skills added yet. <Link href="/admin/skills" className="text-[var(--color-accent-400)] hover:underline">Add some →</Link>
      </p>
    );
  }

  const shown = skills.slice(0, 8);
  const remaining = skills.length - shown.length;

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex flex-wrap gap-1.5">
        {shown.map((s) => (
          <span
            key={s.id}
            className="px-2.5 py-1 rounded-lg bg-[var(--color-accent-500)]/10 text-[var(--color-accent-300)] text-xs"
          >
            {s.name}
          </span>
        ))}
        {remaining > 0 && (
          <span className="px-2.5 py-1 rounded-lg bg-[var(--color-surface)] text-[var(--color-faint)] text-xs">
            +{remaining} more
          </span>
        )}
      </div>
      <Link href="/admin/skills" className="text-xs text-[var(--color-accent-400)] hover:underline w-fit">
        Manage skills →
      </Link>
    </div>
  );
}
