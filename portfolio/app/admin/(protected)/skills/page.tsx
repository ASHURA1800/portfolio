import { asc } from 'drizzle-orm';
import { db, skills } from '@/lib/db';
import type { Skill } from '@/types';
import SkillsManager from './SkillsManager';

export const dynamic = 'force-dynamic';

async function getSkills(): Promise<Skill[]> {
  try {
    return (await db.select().from(skills).orderBy(asc(skills.order_index))) as Skill[];
  } catch (e) {
    console.error('[Admin Skills] Failed to load:', e);
    return [];
  }
}

export default async function AdminSkillsPage() {
  return <SkillsManager initial={await getSkills()} />;
}
