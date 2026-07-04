import { asc } from 'drizzle-orm';
import { db, roadmap } from '@/lib/db';
import type { RoadmapItem } from '@/types';
import RoadmapManager from './RoadmapManager';

export const dynamic = 'force-dynamic';

async function getRoadmap(): Promise<RoadmapItem[]> {
  try {
    return (await db.select().from(roadmap).orderBy(asc(roadmap.order_index))) as RoadmapItem[];
  } catch (e) {
    console.error('[Admin Roadmap] Failed to load:', e);
    return [];
  }
}

export default async function AdminRoadmapPage() {
  return <RoadmapManager initial={await getRoadmap()} />;
}
