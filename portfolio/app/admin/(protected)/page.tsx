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

// Phase 4.8 — motion wrappers (client components; live in components/ui,
// NOT components/admin/ui — server page stays async, wrappers stay 'use client')
import { MotionSection } from '@/components/ui/MotionSection';
import { MotionGridItem } from '@/components/ui/MotionGridItem';

// Phase 4.3 — stats grid
import { StatsGrid } from '@/components/admin/ui/StatsGrid';
import { StatCardV2 } from '@/components/admin/ui/StatCard';
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

// Phase 4.5 — activity feed & quick actions
import { RecentUpdates, QuickActions } from '@/components/admin/dashboard/activity';
import { getRecentActivity } from '@/lib/analytics/activity';

// Phase 4.6 — dashboard widgets
import {
  PortfolioProgress,
  SystemStatus,
  InsightsPanel,
  HealthScore,
  CompletionCard,
  StorageWidget,
  SessionWidget,
} from '@/components/admin/dashboard/widgets';
import { getPortfolioProgress, getHealthScore } from '@/lib/widgets/queries';
import { getUser } from '@/lib/auth/session';
import { SESSION_MAX_AGE } from '@/lib/auth/constants';

// Admin dashboard is auth-gated and shows live counts — render per request,
// never statically prerendered at build time.
export const dynamic = 'force-dynamic';

// ── data fetchers ─────────────────────────────────────────────────────────

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
    return {
      projects: projectsCount,
      blogs: blogsCount,
      certifications: certsCount,
      testimonials: testimonialsCount,
      contacts: contactsCount,
      analytics30d,
    };
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
    const [skillsCount, expCount, buildLogCount, learningsCount, roadmapCount, profileRows] =
      await Promise.all([
        db.$count(skills),
        db.$count(experience),
        db.$count(buildLog),
        db.$count(learnings),
        db.$count(roadmap),
        db
          .select({ name: profileTable.name, title: profileTable.title, email: profileTable.email })
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

// ── types ────────────────────────────────────────────────────────────────

interface PrimaryStatDef {
  key: string;
  label: string;
  value: number;
  icon: ReactNode;
  href: string | null;
}

const CHECKLIST_ITEMS = [
  { key: 'profile', label: 'Profile', href: '/admin/profile', desc: 'Name and title' },
  { key: 'skills', label: 'Skills', href: '/admin/skills', desc: 'Your tech stack' },
  { key: 'projects', label: 'Projects', href: '/admin/projects', desc: 'Featured work' },
  { key: 'experience', label: 'Experience', href: '/admin/experience', desc: 'Work history' },
  { key: 'certifications', label: 'Certifications', href: '/admin/certifications', desc: 'Credentials' },
  { key: 'buildlog', label: 'Build Log', href: '/admin/buildlog', desc: "What you're building" },
  { key: 'learnings', label: 'Learnings', href: '/admin/learnings', desc: "Things you've learned" },
  { key: 'roadmap', label: 'Roadmap', href: '/admin/roadmap', desc: "What's next" },
] as const;

// ── page ─────────────────────────────────────────────────────────────────

export default async function AdminDashboard() {
  const [stats, sections, growth, distribution, skillsCategories, activity, recentActivity, progress, health, user] =
    await Promise.all([
      getStats(),
      getSectionCounts(),
      getPortfolioGrowth().catch(() => []),
      getContentDistribution().catch(() => []),
      getSkillsByCategory().catch(() => []),
      getActivityTimeline().catch(() => []),
      getRecentActivity(10).catch(() => []),
      getPortfolioProgress().catch(() => ({
        score: 0,
        profileFieldsDone: 0,
        profileFieldsTotal: 0,
        missingSections: [] as { key: string; label: string; href: string; done: boolean }[],
        uploads: [] as { key: string; label: string; done: boolean }[],
      })),
      getHealthScore().catch(() => ({
        score: 0,
        breakdown: [] as { label: string; value: number; max: number }[],
      })),
      getUser().catch(() => null),
    ]);

  // Storage is "configured" iff the Vercel Blob token is present — the only
  // real signal available without a usage/quota API.
  const storageConfigured = !!process.env.BLOB_READ_WRITE_TOKEN;

  const primaryStats: PrimaryStatDef[] = [
    { key: 'projects', label: 'Projects', value: stats.projects, icon: <Rocket size={18} aria-hidden="true" />, href: '/admin/projects' },
    { key: 'skills', label: 'Skills', value: sections.skills, icon: <Wrench size={18} aria-hidden="true" />, href: '/admin/skills' },
    { key: 'experience', label: 'Experience', value: sections.experience, icon: <Briefcase size={18} aria-hidden="true" />, href: '/admin/experience' },
    { key: 'certifications', label: 'Certifications', value: stats.certifications, icon: <Award size={18} aria-hidden="true" />, href: '/admin/certifications' },
    { key: 'buildLog', label: 'Build Logs', value: sections.buildLog, icon: <Hammer size={18} aria-hidden="true" />, href: '/admin/buildlog' },
    { key: 'learnings', label: 'Learnings', value: sections.learnings, icon: <BookOpen size={18} aria-hidden="true" />, href: '/admin/learnings' },
    { key: 'roadmap', label: 'Roadmap', value: sections.roadmap, icon: <Map size={18} aria-hidden="true" />, href: '/admin/roadmap' },
    { key: 'messages', label: 'Messages', value: stats.contacts, icon: <Mail size={18} aria-hidden="true" />, href: null },
  ];

  const completion: Record<string, boolean> = {
    profile: !!(sections.profileName.trim() && sections.profileTitle.trim()),
    skills: sections.skills > 0,
    projects: stats.projects > 0,
    experience: sections.experience > 0,
    certifications: stats.certifications > 0,
    buildlog: sections.buildLog > 0,
    learnings: sections.learnings > 0,
    roadmap: sections.roadmap > 0,
  };
  const showChecklist = Object.values(completion).some((v) => !v);

  const profileMissingFields = [
    !sections.profileName.trim() && 'name',
    !sections.profileTitle.trim() && 'title',
    !sections.profileEmail.trim() && 'email',
  ].filter(Boolean) as string[];
  const showProfileNotice = profileMissingFields.length > 0;

  const completionItems = CHECKLIST_ITEMS.map(({ key, label }) => ({
    key,
    label,
    done: completion[key] ?? false,
  }));

  const completionCardItems = CHECKLIST_ITEMS.map(({ key, label, href }) => ({
    key,
    label,
    href,
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
        <main aria-label="Admin dashboard">
          {/* ── Profile notice ───────────────────────────────────── */}
          {showProfileNotice && (
            <div
              role="alert"
              className="mb-6 flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-500/8 px-4 py-3"
            >
              <span className="mt-0.5 text-amber-400" aria-hidden="true">⚠</span>
              <div className="text-sm">
                <span className="text-amber-300 font-medium">Profile incomplete — </span>
                <span className="text-amber-500/80">
                  Missing: {profileMissingFields.join(', ')}.{' '}
                </span>
                <Link
                  href="/admin/profile"
                  className="text-amber-400 underline hover:text-amber-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-400 focus-visible:outline-offset-2 rounded transition-colors"
                >
                  Fill it in →
                </Link>
              </div>
            </div>
          )}

          {/* ── Stat cards (Phase 4.3) ─────────────────────────────
              Cards cascade in via MotionGridItem (Phase 4.8). */}
          <DashboardSection first>
            <h2 className="sr-only">Portfolio statistics</h2>
            <StatsGrid cols={4}>
              {primaryStats.map(({ key, label, value, icon, href }, i) => (
                <MotionGridItem key={key} index={i}>
                  <StatCardV2 label={label} value={value} icon={icon} href={href} />
                </MotionGridItem>
              ))}
            </StatsGrid>
          </DashboardSection>

          {/* ── Analytics & charts (Phase 4.4) ─────────────────────
              Real queries only. Section fades/rises into view on scroll
              (Phase 4.8); each chart card also cascades. */}
          <DashboardSection
            title="Analytics"
            description="How your portfolio content has grown."
          >
            <MotionSection>
              <DashboardGrid cols={2} gap="md">
                {[
                  { id: 'growth', chart: <PortfolioGrowthChart key="growth" data={growth} /> },
                  { id: 'distribution', chart: <ContentDistributionChart key="distribution" data={distribution} /> },
                  { id: 'skills', chart: <SkillsChart key="skills" data={skillsCategories} /> },
                  { id: 'activity', chart: <ActivityChart key="activity" data={activity} /> },
                ].map(({ id, chart }, i) => (
                  <MotionGridItem key={id} index={i}>
                    <AnalyticsCard>{chart}</AnalyticsCard>
                  </MotionGridItem>
                ))}
              </DashboardGrid>
            </MotionSection>
          </DashboardSection>

          {/* ── Workspace (Phase 4.5 + 4.6 merged) ─────────────────
              Recent activity feed + quick actions, plus progress/health/
              completion/system/storage/session widgets. All figures come
              from real DB reads or real env/session state — nothing faked.
              InsightsPanel reuses progress data already loaded above. */}
          <DashboardSection
            title="Workspace"
            description="Recent changes, quick actions, and system state."
          >
            <MotionSection>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr',
                  gap: 'var(--admin-space-card)',
                }}
              >
                <style>{`
                  @media (min-width: 900px) {
                    .workspace-grid { grid-template-columns: 1fr 1fr !important; }
                  }
                `}</style>

                {/* Activity feed panel */}
                <DashboardWidget
                  glass
                  className="workspace-grid"
                  style={{ padding: 'var(--admin-space-card)' }}
                  as="article"
                >
                  <h3 className="sr-only">Recent activity</h3>
                  <RecentUpdates events={recentActivity} />
                </DashboardWidget>

                {/* Quick actions panel */}
                <DashboardWidget
                  glass
                  style={{ padding: 'var(--admin-space-card)' }}
                  as="article"
                >
                  <h3 className="sr-only">Quick actions</h3>
                  <QuickActions />
                </DashboardWidget>
              </div>

              <div className="mt-4">
                <DashboardGrid cols={3} gap="md">
                  {[
                    { id: 'progress', widget: <PortfolioProgress key="progress" data={progress} /> },
                    { id: 'health', widget: <HealthScore key="health" data={health} /> },
                    { id: 'completion', widget: <CompletionCard key="completion" items={completionCardItems} /> },
                    { id: 'system', widget: <SystemStatus key="system" email={user?.email ?? null} storageConfigured={storageConfigured} /> },
                    { id: 'storage', widget: <StorageWidget key="storage" storageConfigured={storageConfigured} uploads={progress.uploads} /> },
                    { id: 'session', widget: <SessionWidget key="session" email={user?.email ?? null} maxAgeSeconds={SESSION_MAX_AGE} /> },
                  ].map(({ id, widget }, i) => (
                    <MotionGridItem key={id} index={i}>
                      {widget}
                    </MotionGridItem>
                  ))}
                </DashboardGrid>
                <div className="mt-4">
                  <InsightsPanel missingSections={progress.missingSections} uploads={progress.uploads} />
                </div>
              </div>
            </MotionSection>
          </DashboardSection>

          {/* ── Getting started checklist ────────────────────────── */}
          {showChecklist && (
            <DashboardSection
              title="Getting started"
              description="Add content to populate your public portfolio."
            >
              <DashboardWidget glass>
                <ul
                  style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}
                  aria-label="Content completion checklist"
                >
                  {CHECKLIST_ITEMS.map(({ key, label, href, desc }) => {
                    const done = completion[key];
                    return (
                      <li key={key}>
                        <Link
                          href={href}
                          className="flex items-center gap-3 group rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400"
                          aria-label={`${label}: ${desc}${done ? ' — complete' : ' — incomplete'}`}
                        >
                          <span
                            aria-hidden="true"
                            className={`w-5 h-5 flex-shrink-0 flex items-center justify-center rounded-full text-xs font-bold transition-colors ${
                              done
                                ? 'bg-emerald-500/15 text-emerald-400'
                                : 'bg-white/8 text-gray-600 group-hover:text-gray-400'
                            }`}
                          >
                            {done ? '✓' : '○'}
                          </span>
                          <span
                            className={`text-sm transition-colors ${
                              done ? 'text-gray-500 line-through' : 'text-gray-300 group-hover:text-white'
                            }`}
                          >
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
        </main>
      </DashboardContent>
    </DashboardLayout>
  );
}
