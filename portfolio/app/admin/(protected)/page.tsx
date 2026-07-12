import type { ReactNode } from 'react';
import { gte } from 'drizzle-orm';
import {
  db,
  projects,
  blogs,
  certifications,
  testimonials,
  contacts,
  analytics,
  skills,
  experience,
  buildLog,
  learnings,
  roadmap,
  profile as profileTable,
} from '@/lib/db';
import Link from 'next/link';

// Phase 4 layout + hero
import {
  DashboardLayout,
  DashboardContent,
  DashboardSection,
  DashboardGrid,
  DashboardWidget,
} from '@/components/admin/dashboard/layout';
import { DashboardHero } from '@/components/admin/dashboard/hero';

// Phase 4.3 — stats grid
import { StatsGrid } from '@/components/admin/ui/StatsGrid';
import { StatCardV2 } from '@/components/admin/ui/StatCardV2';
import {
  Rocket,
  Wrench,
  Briefcase,
  Award,
  Hammer,
  BookOpen,
  Map,
  Mail,
} from 'lucide-react';

// Phase 4.4 — analytics & charts
import {
  AnalyticsCard,
  PortfolioGrowthChart,
  ContentDistributionChart,
  SkillsChart,
  ActivityChart,
} from '@/components/admin/analytics';
import {
  getPortfolioGrowth,
  getContentDistribution,
  getSkillsByCategory,
  getActivityTimeline,
} from '@/lib/analytics/queries';

// Admin dashboard is auth-gated and shows live counts — render per request,
// never statically prerendered at build time.
export const dynamic = 'force-dynamic';

const EMPTY_STATS = {
  projects: 0,
  blogs: 0,
  certifications: 0,
  testimonials: 0,
  contacts: 0,
  analytics30d: 0,
};

async function getStats() {
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  try {
    const [
      projectsCount,
      blogsCount,
      certsCount,
      testimonialsCount,
      contactsCount,
      analytics30d,
    ] = await Promise.all([
      db.$count(projects),
      db.$count(blogs),
      db.$count(certifications),
      db.$count(testimonials),
      db.$count(contacts),
      db.$count(analytics, gte(analytics.created_at, since)),
    ]);
    return { projects: projectsCount, blogs: blogsCount, certifications: certsCount, testimonials: testimonialsCount, contacts: contactsCount, analytics30d };
  } catch {
    console.error('[Admin Dashboard] Failed to load stats');
    return EMPTY_STATS;
  }
}

interface SectionCounts {
  skills: number;
  experience: number;
  buildLog: number;
  learnings: number;
  roadmap: number;
  profileName: string;
  profileTitle: string;
  profileEmail: string;
}

const EMPTY_SECTION_COUNTS: SectionCounts = {
  skills: 0,
  experience: 0,
  buildLog: 0,
  learnings: 0,
  roadmap: 0,
  profileName: '',
  profileTitle: '',
  profileEmail: '',
};

async function getSectionCounts(): Promise<SectionCounts> {
  try {
    const [
      skillsCount,
      expCount,
      buildLogCount,
      learningsCount,
      roadmapCount,
      profileRows,
    ] = await Promise.all([
      db.$count(skills),
      db.$count(experience),
      db.$count(buildLog),
      db.$count(learnings),
      db.$count(roadmap),
      db.select({ name: profileTable.name, title: profileTable.title, email: profileTable.email })
        .from(profileTable)
        .limit(1),
    ]);
    const p = profileRows[0];
    return {
      skills: skillsCount,
      experience: expCount,
      buildLog: buildLogCount,
      learnings: learningsCount,
      roadmap: roadmapCount,
      profileName: p?.name ?? '',
      profileTitle: p?.title ?? '',
      profileEmail: p?.email ?? '',
    };
  } catch {
    console.error('[Admin Dashboard] Failed to load section counts');
    return EMPTY_SECTION_COUNTS;
  }
}

// Phase 4.3 — the 8 categories from spec, each backed by a real count
// already fetched in getStats()/getSectionCounts(). No invented fields.
interface PrimaryStatDef {
  key: string;
  label: string;
  value: number;
  icon: ReactNode;
  href: string | null;
}

const CHECKLIST_ITEMS = [
  { key: 'profile',       label: 'Profile',         href: '/admin/profile',        desc: 'Name and title' },
  { key: 'skills',        label: 'Skills',          href: '/admin/skills',         desc: 'Your tech stack' },
  { key: 'projects',      label: 'Projects',        href: '/admin/projects',       desc: 'Featured work' },
  { key: 'experience',    label: 'Experience',      href: '/admin/experience',     desc: 'Work history' },
  { key: 'certifications',label: 'Certifications',  href: '/admin/certifications', desc: 'Credentials' },
  { key: 'buildlog',      label: 'Build Log',       href: '/admin/buildlog',       desc: 'What you\'re building' },
  { key: 'learnings',     label: 'Learnings',       href: '/admin/learnings',      desc: 'Things you\'ve learned' },
  { key: 'roadmap',       label: 'Roadmap',         href: '/admin/roadmap',        desc: 'What\'s next' },
] as const;

export default async function AdminDashboard() {
  const [stats, sections, growth, distribution, skillsCategories, activity] = await Promise.all([
    getStats(),
    getSectionCounts(),
    getPortfolioGrowth(),
    getContentDistribution(),
    getSkillsByCategory(),
    getActivityTimeline(),
  ]);

  // Phase 4.3 — 8 spec categories, mapped from real counts only.
  const primaryStats: PrimaryStatDef[] = [
    { key: 'projects',       label: 'Projects',        value: stats.projects,          icon: <Rocket size={18} />,    href: '/admin/projects' },
    { key: 'skills',         label: 'Skills',          value: sections.skills,         icon: <Wrench size={18} />,    href: '/admin/skills' },
    { key: 'experience',     label: 'Experience',      value: sections.experience,     icon: <Briefcase size={18} />, href: '/admin/experience' },
    { key: 'certifications', label: 'Certifications',  value: stats.certifications,    icon: <Award size={18} />,     href: '/admin/certifications' },
    { key: 'buildLog',       label: 'Build Logs',      value: sections.buildLog,       icon: <Hammer size={18} />,    href: '/admin/buildlog' },
    { key: 'learnings',      label: 'Learnings',       value: sections.learnings,      icon: <BookOpen size={18} />,  href: '/admin/learnings' },
    { key: 'roadmap',        label: 'Roadmap',         value: sections.roadmap,        icon: <Map size={18} />,       href: '/admin/roadmap' },
    { key: 'messages',       label: 'Messages',        value: stats.contacts,          icon: <Mail size={18} />,      href: null },
  ];

  // Completion state — identical logic to before
  const completion: Record<string, boolean> = {
    profile:        !!(sections.profileName.trim() && sections.profileTitle.trim()),
    skills:         sections.skills > 0,
    projects:       stats.projects > 0,
    experience:     sections.experience > 0,
    certifications: stats.certifications > 0,
    buildlog:       sections.buildLog > 0,
    learnings:      sections.learnings > 0,
    roadmap:        sections.roadmap > 0,
  };
  const showChecklist = Object.values(completion).some((v) => !v);

  const profileMissingFields = [
    !sections.profileName.trim() && 'name',
    !sections.profileTitle.trim() && 'title',
    !sections.profileEmail.trim() && 'email',
  ].filter(Boolean) as string[];
  const showProfileNotice = profileMissingFields.length > 0;

  // Build completion items array for the hero ring
  const completionItems = CHECKLIST_ITEMS.map(({ key, label }) => ({
    key,
    label,
    done: completion[key] ?? false,
  }));

  return (
    <DashboardLayout>
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <DashboardHero
        name={sections.profileName}
        title={sections.profileTitle}
        completionItems={completionItems}
      />

      <DashboardContent>
        {/* ── Profile notice ───────────────────────────────────── */}
        {showProfileNotice && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-500/8 px-4 py-3">
            <span className="mt-0.5 text-amber-400">⚠</span>
            <div className="text-sm">
              <span className="text-amber-300 font-medium">Profile incomplete — </span>
              <span className="text-amber-500/80">
                Missing: {profileMissingFields.join(', ')}.{' '}
              </span>
              <Link href="/admin/profile" className="text-amber-400 underline hover:text-amber-300 transition-colors">
                Fill it in →
              </Link>
            </div>
          </div>
        )}

        {/* ── Stat cards (Phase 4.3) ──────────────────────────────
            No trend/progress data exists yet (would need historical
            snapshots), so those props are simply omitted rather than
            faked — StatCardV2 renders fine without them. */}
        <DashboardSection first>
          <StatsGrid cols={4}>
            {primaryStats.map(({ key, label, value, icon, href }) => (
              <StatCardV2 key={key} label={label} value={value} icon={icon} href={href} />
            ))}
          </StatsGrid>
        </DashboardSection>

        {/* ── Analytics & charts (Phase 4.4) ──────────────────────
            Real queries only: monthly created_at aggregates, live table
            counts, skills.category/proficiency, and analytics.event_type
            daily counts. Empty datasets render ChartContainer's built-in
            placeholder rather than a fake chart. */}
        <DashboardSection title="Analytics" description="How your portfolio content has grown.">
          <DashboardGrid cols={2} gap="md">
            <AnalyticsCard>
              <PortfolioGrowthChart data={growth} />
            </AnalyticsCard>
            <AnalyticsCard>
              <ContentDistributionChart data={distribution} />
            </AnalyticsCard>
            <AnalyticsCard>
              <SkillsChart data={skillsCategories} />
            </AnalyticsCard>
            <AnalyticsCard>
              <ActivityChart data={activity} />
            </AnalyticsCard>
          </DashboardGrid>
        </DashboardSection>

        {/* ── Getting started checklist ────────────────────────── */}
        {showChecklist && (
          <DashboardSection
            title="Getting started"
            description="Add content to populate your public portfolio."
          >
            <DashboardWidget glass>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                {CHECKLIST_ITEMS.map(({ key, label, href, desc }) => {
                  const done = completion[key];
                  return (
                    <li key={key}>
                      <Link href={href} className="flex items-center gap-3 group">
                        <span
                          className={`w-5 h-5 flex-shrink-0 flex items-center justify-center rounded-full text-xs font-bold transition-colors ${
                            done
                              ? 'bg-emerald-500/15 text-emerald-400'
                              : 'bg-white/8 text-gray-600 group-hover:text-gray-400'
                          }`}
                        >
                          {done ? '✓' : '○'}
                        </span>
                        <span className={`text-sm transition-colors ${done ? 'text-gray-500 line-through' : 'text-gray-300 group-hover:text-white'}`}>
                          {label}
                        </span>
                        <span className="text-xs text-gray-600 group-hover:text-gray-500 transition-colors">
                          {desc}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </DashboardWidget>
          </DashboardSection>
        )}
      </DashboardContent>
    </DashboardLayout>
  );
}
