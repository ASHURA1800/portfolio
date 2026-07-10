import type { Skill, SkillCategory } from '@/types';

// Pure, side-effect-free helpers — safe to import from both server and
// client components. Kept separate from lib/content/index.ts because that
// file is tagged 'server-only' (DB access), which breaks any client
// component that needs just these two utilities.

export const skillCategories: SkillCategory[] = [
  'Frontend',
  'Backend',
  'AI',
  'Database',
  'DevOps',
  'Tools',
];

export function skillsByCategory(list: Skill[], c: SkillCategory): Skill[] {
  return list.filter((s) => s.category === c);
}
