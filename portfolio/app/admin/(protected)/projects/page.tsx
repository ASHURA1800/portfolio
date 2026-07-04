import { desc, asc } from 'drizzle-orm';
import { db, projects } from '@/lib/db';
import type { Project } from '@/types';
import ProjectsManager from './ProjectsManager';

export const dynamic = 'force-dynamic';

async function getProjects(): Promise<Project[]> {
  try {
    const rows = await db
      .select()
      .from(projects)
      .orderBy(desc(projects.featured), asc(projects.order_index));
    return rows.map((r) => ({
      ...r,
      created_at: String(r.created_at),
      updated_at: String(r.updated_at),
    })) as Project[];
  } catch (e) {
    console.error('[Admin Projects] Failed to load:', e);
    return [];
  }
}

export default async function AdminProjectsPage() {
  return <ProjectsManager initial={await getProjects()} />;
}
