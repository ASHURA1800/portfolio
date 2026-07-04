import { desc } from 'drizzle-orm';
import { db, buildLog } from '@/lib/db';
import type { BuildLogEntry } from '@/types';
import BuildLogManager from './BuildLogManager';

export const dynamic = 'force-dynamic';

async function getBuildLog(): Promise<BuildLogEntry[]> {
  try {
    return (await db.select().from(buildLog).orderBy(desc(buildLog.date))) as BuildLogEntry[];
  } catch (e) {
    console.error('[Admin BuildLog] Failed to load:', e);
    return [];
  }
}

export default async function AdminBuildLogPage() {
  return <BuildLogManager initial={await getBuildLog()} />;
}
