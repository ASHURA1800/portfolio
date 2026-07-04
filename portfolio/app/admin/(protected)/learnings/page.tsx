import { asc } from 'drizzle-orm';
import { db, learnings } from '@/lib/db';
import type { Learning } from '@/types';
import LearningsManager from './LearningsManager';

export const dynamic = 'force-dynamic';

async function getLearnings(): Promise<Learning[]> {
  try {
    return (await db.select().from(learnings).orderBy(asc(learnings.order_index))) as Learning[];
  } catch (e) {
    console.error('[Admin Learnings] Failed to load:', e);
    return [];
  }
}

export default async function AdminLearningsPage() {
  return <LearningsManager initial={await getLearnings()} />;
}
