import 'server-only';
import { gte, sql } from 'drizzle-orm';
import {
  db,
  projects,
  skills,
  experience,
  certifications,
  roadmap,
  analytics,
} from '@/lib/db';

export interface GrowthPoint {
  /** e.g. "2026-04" */
  month: string;
  count: number;
}

export interface DistributionSlice {
  name: string;
  value: number;
}

export interface SkillsCategoryPoint {
  category: string;
  avgProficiency: number;
  count: number;
}

export interface ActivityPoint {
  /** e.g. "2026-06-05" */
  day: string;
  count: number;
}

/**
 * Cumulative content growth over the last N months, derived from real
 * created_at timestamps across the core content tables. One SQL call per
 * table, grouped by month — no synthetic data.
 */
export async function getPortfolioGrowth(months = 6): Promise<GrowthPoint[]> {
  const since = new Date();
  since.setMonth(since.getMonth() - (months - 1));
  since.setDate(1);
  since.setHours(0, 0, 0, 0);

  const tables = [projects, skills, experience, certifications, roadmap];

  try {
    const perTableRows = await Promise.all(
      tables.map((t) =>
        db
          .select({
            month: sql<string>`to_char(${t.created_at}, 'YYYY-MM')`,
            count: sql<number>`count(*)::int`,
          })
          .from(t)
          .where(gte(t.created_at, since))
          .groupBy(sql`to_char(${t.created_at}, 'YYYY-MM')`)
      )
    );

    const byMonth = new Map<string, number>();
    for (const rows of perTableRows) {
      for (const row of rows) {
        byMonth.set(row.month, (byMonth.get(row.month) ?? 0) + row.count);
      }
    }

    // Build a contiguous month axis so gaps render as 0, not missing points.
    const points: GrowthPoint[] = [];
    const cursor = new Date(since);
    for (let i = 0; i < months; i++) {
      const key = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, '0')}`;
      points.push({ month: key, count: byMonth.get(key) ?? 0 });
      cursor.setMonth(cursor.getMonth() + 1);
    }
    return points;
  } catch {
    console.error('[Analytics] Failed to load portfolio growth');
    return [];
  }
}

/** How many rows exist per content type, right now — real counts only. */
export async function getContentDistribution(): Promise<DistributionSlice[]> {
  try {
    const [p, s, e, c, r] = await Promise.all([
      db.$count(projects),
      db.$count(skills),
      db.$count(experience),
      db.$count(certifications),
      db.$count(roadmap),
    ]);
    return [
      { name: 'Projects', value: p },
      { name: 'Skills', value: s },
      { name: 'Experience', value: e },
      { name: 'Certifications', value: c },
      { name: 'Roadmap', value: r },
    ].filter((slice) => slice.value > 0);
  } catch {
    console.error('[Analytics] Failed to load content distribution');
    return [];
  }
}

/** Average proficiency + count grouped by skills.category — real columns. */
export async function getSkillsByCategory(): Promise<SkillsCategoryPoint[]> {
  try {
    const rows = await db
      .select({
        category: skills.category,
        avgProficiency: sql<number>`round(avg(${skills.proficiency}))::int`,
        count: sql<number>`count(*)::int`,
      })
      .from(skills)
      .groupBy(skills.category)
      .orderBy(sql`avg(${skills.proficiency}) desc`);
    return rows;
  } catch {
    console.error('[Analytics] Failed to load skills by category');
    return [];
  }
}

/** Daily event counts for the last N days from the real analytics table. */
export async function getActivityTimeline(days = 14): Promise<ActivityPoint[]> {
  const since = new Date();
  since.setDate(since.getDate() - (days - 1));
  since.setHours(0, 0, 0, 0);

  try {
    const rows = await db
      .select({
        day: sql<string>`to_char(${analytics.created_at}, 'YYYY-MM-DD')`,
        count: sql<number>`count(*)::int`,
      })
      .from(analytics)
      .where(gte(analytics.created_at, since))
      .groupBy(sql`to_char(${analytics.created_at}, 'YYYY-MM-DD')`);

    const byDay = new Map(rows.map((r) => [r.day, r.count]));
    const points: ActivityPoint[] = [];
    const cursor = new Date(since);
    for (let i = 0; i < days; i++) {
      const key = cursor.toISOString().slice(0, 10);
      points.push({ day: key, count: byDay.get(key) ?? 0 });
      cursor.setDate(cursor.getDate() + 1);
    }
    return points;
  } catch {
    console.error('[Analytics] Failed to load activity timeline');
    return [];
  }
}
