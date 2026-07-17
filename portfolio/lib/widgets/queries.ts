import 'server-only';
import {
  db,
  projects,
  skills,
  experience,
  certifications,
  roadmap,
  profile as profileTable,
} from '@/lib/db';

export interface SectionStatus {
  key: string;
  label: string;
  done: boolean;
  href: string;
}

export interface PortfolioProgressData {
  /** 0–100, based on real profile field + section completion */
  score: number;
  profileFieldsDone: number;
  profileFieldsTotal: number;
  missingSections: SectionStatus[];
  /** Uploadable assets: avatar + resume — the only two file uploads in profile */
  uploads: { key: string; label: string; done: boolean }[];
}

export interface HealthScoreData {
  /** 0–100 composite of completion + content depth, both real */
  score: number;
  breakdown: { label: string; value: number; max: number }[];
}

const SECTIONS = [
  { key: 'projects', label: 'Projects', href: '/admin/projects' },
  { key: 'skills', label: 'Skills', href: '/admin/skills' },
  { key: 'experience', label: 'Experience', href: '/admin/experience' },
  { key: 'certifications', label: 'Certifications', href: '/admin/certifications' },
  { key: 'roadmap', label: 'Roadmap', href: '/admin/roadmap' },
] as const;

async function getSectionCounts() {
  const [p, s, e, c, r] = await Promise.all([
    db.$count(projects),
    db.$count(skills),
    db.$count(experience),
    db.$count(certifications),
    db.$count(roadmap),
  ]);
  return { projects: p, skills: s, experience: e, certifications: c, roadmap: r };
}

export async function getPortfolioProgress(): Promise<PortfolioProgressData> {
  try {
    const [counts, profileRows] = await Promise.all([
      getSectionCounts(),
      db
        .select({
          name: profileTable.name,
          title: profileTable.title,
          bio: profileTable.bio,
          email: profileTable.email,
          location: profileTable.location,
          avatar: profileTable.avatar,
          resume: profileTable.resume,
        })
        .from(profileTable)
        .limit(1),
    ]);

    const p = profileRows[0];
    const profileChecks = [
      !!p?.name?.trim(),
      !!p?.title?.trim(),
      !!p?.bio?.trim(),
      !!p?.email?.trim(),
      !!p?.location?.trim(),
    ];
    const profileFieldsDone = profileChecks.filter(Boolean).length;
    const profileFieldsTotal = profileChecks.length;

    const missingSections: SectionStatus[] = SECTIONS.map((s) => ({
      key: s.key,
      label: s.label,
      href: s.href,
      done: (counts as Record<string, number>)[s.key] > 0,
    })).filter((s) => !s.done);

    const sectionsDone = SECTIONS.length - missingSections.length;
    const totalChecks = profileFieldsTotal + SECTIONS.length;
    const totalDone = profileFieldsDone + sectionsDone;
    const score = totalChecks === 0 ? 0 : Math.round((totalDone / totalChecks) * 100);

    return {
      score,
      profileFieldsDone,
      profileFieldsTotal,
      missingSections,
      uploads: [
        { key: 'avatar', label: 'Profile photo', done: !!p?.avatar?.trim() },
        { key: 'resume', label: 'Resume', done: !!p?.resume?.trim() },
      ],
    };
  } catch {
    console.error('[Widgets] Failed to load portfolio progress');
    return { score: 0, profileFieldsDone: 0, profileFieldsTotal: 5, missingSections: [], uploads: [] };
  }
}

export async function getHealthScore(): Promise<HealthScoreData> {
  try {
    const counts = await getSectionCounts();

    // Depth score: caps each section's contribution so no single section
    // can dominate — capped at 3 items = full credit for that section.
    const cap = (n: number) => Math.min(n, 3);
    const breakdown = [
      { label: 'Projects', value: cap(counts.projects), max: 3 },
      { label: 'Skills', value: cap(counts.skills), max: 3 },
      { label: 'Experience', value: cap(counts.experience), max: 3 },
      { label: 'Certifications', value: cap(counts.certifications), max: 3 },
    ];
    const total = breakdown.reduce((sum, b) => sum + b.max, 0);
    const earned = breakdown.reduce((sum, b) => sum + b.value, 0);
    const score = total === 0 ? 0 : Math.round((earned / total) * 100);

    return { score, breakdown };
  } catch {
    console.error('[Widgets] Failed to load health score');
    return { score: 0, breakdown: [] };
  }
}
