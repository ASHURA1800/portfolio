import 'server-only';
import { asc, desc, eq } from 'drizzle-orm';
import {
  db,
  profile as profileTable,
  skills as skillsTable,
  experience as experienceTable,
  projects as projectsTable,
  roadmap as roadmapTable,
} from '@/lib/db';
import type {
  Profile,
  Skill,
  Experience,
  Project,
  RoadmapItem,
} from '@/types';

// ─────────────────────────────────────────────────────────────────────────────
// Server-only data access — the DB replacement for the old static data/*.ts
// getters. Every function is wrapped so an empty or unreachable DB returns safe
// defaults and never throws during a render (ISR/SSR).
// ─────────────────────────────────────────────────────────────────────────────

export { skillCategories, skillsByCategory } from './skills';

export const EMPTY_PROFILE: Profile = {
  name: '', username: '', github: '', email: '', bio: '', title: '',
  currentWork: '', location: '', avatar: '', resume: '', linkedin: '',
  twitter: '', website: '',
  about: { journey: '', currentFocus: '', philosophy: '', learning: '' },
  note: '', contactNote: '', skillsNote: '', blogIntro: '',
};

// Map the flat snake_case profile row → the nested camelCase Profile the UI uses.
type ProfileRow = typeof profileTable.$inferSelect;
function mapProfile(row: ProfileRow): Profile {
  return {
    name: row.name,
    username: row.username,
    github: row.github,
    email: row.email,
    bio: row.bio,
    title: row.title,
    currentWork: row.current_work,
    location: row.location,
    avatar: row.avatar,
    resume: row.resume,
    linkedin: row.linkedin,
    twitter: row.twitter,
    website: row.website,
    about: {
      journey: row.about_journey,
      currentFocus: row.about_current_focus,
      philosophy: row.about_philosophy,
      learning: row.about_learning,
    },
    note: row.note,
    contactNote: row.contact_note,
    skillsNote: row.skills_note,
    blogIntro: row.blog_intro,
  };
}

export async function getProfile(): Promise<Profile> {
  try {
    const [row] = await db.select().from(profileTable).limit(1);
    return row ? mapProfile(row) : EMPTY_PROFILE;
  } catch (e) {
    console.error('[content] getProfile failed:', e);
    return EMPTY_PROFILE;
  }
}

export async function getSkills(): Promise<Skill[]> {
  try {
    const rows = await db.select().from(skillsTable).orderBy(asc(skillsTable.order_index));
    return rows as Skill[];
  } catch (e) {
    console.error('[content] getSkills failed:', e);
    return [];
  }
}


export async function getExperience(): Promise<Experience[]> {
  try {
    const rows = await db.select().from(experienceTable).orderBy(asc(experienceTable.order_index));
    // Current roles pinned to the top, otherwise admin-controlled order.
    return (rows as Experience[]).sort((a, b) => Number(b.current) - Number(a.current));
  } catch (e) {
    console.error('[content] getExperience failed:', e);
    return [];
  }
}

// Normalise DB row (Date columns) → Project (string timestamps).
type ProjectRow = typeof projectsTable.$inferSelect;
function mapProject(row: ProjectRow): Project {
  return {
    ...row,
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
  } as Project;
}

export async function getProjects(): Promise<Project[]> {
  try {
    const rows = await db
      .select()
      .from(projectsTable)
      .orderBy(desc(projectsTable.featured), asc(projectsTable.order_index));
    return rows.map(mapProject);
  } catch (e) {
    console.error('[content] getProjects failed:', e);
    return [];
  }
}

export async function getFeaturedProjects(): Promise<Project[]> {
  // featured first is already the default ordering above.
  return getProjects();
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  try {
    const [row] = await db
      .select()
      .from(projectsTable)
      .where(eq(projectsTable.slug, slug))
      .limit(1);
    return row ? mapProject(row) : null;
  } catch (e) {
    console.error('[content] getProjectBySlug failed:', e);
    return null;
  }
}

export async function getCaseStudySlugs(): Promise<string[]> {
  try {
    const rows = await db
      .select({ slug: projectsTable.slug, case_study: projectsTable.case_study })
      .from(projectsTable)
      .where(eq(projectsTable.case_study, true));
    return rows.map((r) => r.slug).filter((s): s is string => Boolean(s));
  } catch (e) {
    console.error('[content] getCaseStudySlugs failed:', e);
    return [];
  }
}

export async function getRoadmap(): Promise<RoadmapItem[]> {
  try {
    const rows = await db.select().from(roadmapTable).orderBy(asc(roadmapTable.order_index));
    return rows as RoadmapItem[];
  } catch (e) {
    console.error('[content] getRoadmap failed:', e);
    return [];
  }
}
