import { asc } from 'drizzle-orm';
import { db, experience } from '@/lib/db';
import type { Experience } from '@/types';
import ExperienceManager from './ExperienceManager';

export const dynamic = 'force-dynamic';

async function getExperience(): Promise<Experience[]> {
  try {
    return (await db.select().from(experience).orderBy(asc(experience.order_index))) as Experience[];
  } catch (e) {
    console.error('[Admin Experience] Failed to load:', e);
    return [];
  }
}

export default async function AdminExperiencePage() {
  return <ExperienceManager initial={await getExperience()} />;
}
