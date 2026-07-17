import 'server-only';
import { desc } from 'drizzle-orm';
import {
  db,
  projects,
  certifications,
  roadmap,
  profile as profileTable,
} from '@/lib/db';

export type ActivityKind =
  | 'project'
  | 'certification'
  | 'roadmap'
  | 'profile';

export interface ActivityEvent {
  id: string;
  kind: ActivityKind;
  /** Short display label, e.g. project title or "Profile updated" */
  label: string;
  /** Section subtitle, e.g. cert issuer or build log status */
  sublabel?: string;
  updatedAt: Date;
  /** Link to the section's admin page */
  href: string;
}

const LIMIT_PER_TABLE = 5;

/**
 * getRecentActivity
 * Derives a unified activity feed from the real updated_at columns that
 * already exist on every content table. No dedicated audit log table is
 * required — we simply select the N most-recently-touched rows per table,
 * merge, sort, and return the top entries.
 *
 * Returns an empty array (never throws) so the dashboard renders gracefully
 * when the DB is unreachable or all tables are empty.
 */
export async function getRecentActivity(limit = 10): Promise<ActivityEvent[]> {
  try {
    const [
      recentProjects,
      recentCerts,
      recentRoadmap,
      profileRows,
    ] = await Promise.all([
      db
        .select({ id: projects.id, title: projects.title, subtitle: projects.subtitle, updatedAt: projects.updated_at })
        .from(projects)
        .orderBy(desc(projects.updated_at))
        .limit(LIMIT_PER_TABLE),

      db
        .select({ id: certifications.id, title: certifications.title, issuer: certifications.issuer, updatedAt: certifications.updated_at })
        .from(certifications)
        .orderBy(desc(certifications.updated_at))
        .limit(LIMIT_PER_TABLE),

      db
        .select({ id: roadmap.id, task: roadmap.task, status: roadmap.status, updatedAt: roadmap.updated_at })
        .from(roadmap)
        .orderBy(desc(roadmap.updated_at))
        .limit(LIMIT_PER_TABLE),

      db
        .select({ id: profileTable.id, name: profileTable.name, updatedAt: profileTable.updated_at })
        .from(profileTable)
        .limit(1),
    ]);

    const events: ActivityEvent[] = [];

    for (const p of recentProjects) {
      events.push({
        id: `project-${p.id}`,
        kind: 'project',
        label: p.title,
        sublabel: p.subtitle ?? undefined,
        updatedAt: p.updatedAt,
        href: '/admin/projects',
      });
    }

    for (const c of recentCerts) {
      events.push({
        id: `cert-${c.id}`,
        kind: 'certification',
        label: c.title,
        sublabel: c.issuer,
        updatedAt: c.updatedAt,
        href: '/admin/certifications',
      });
    }

    for (const r of recentRoadmap) {
      events.push({
        id: `roadmap-${r.id}`,
        kind: 'roadmap',
        label: r.task,
        sublabel: r.status,
        updatedAt: r.updatedAt,
        href: '/admin/roadmap',
      });
    }

    if (profileRows[0]) {
      events.push({
        id: `profile-${profileRows[0].id}`,
        kind: 'profile',
        label: profileRows[0].name ? `${profileRows[0].name}'s profile` : 'Profile',
        sublabel: 'Profile updated',
        updatedAt: profileRows[0].updatedAt,
        href: '/admin/profile',
      });
    }

    // Sort newest first, return top N
    return events
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
      .slice(0, limit);
  } catch (err) {
    console.error('[Activity] Failed to load recent activity:', err);
    return [];
  }
}
