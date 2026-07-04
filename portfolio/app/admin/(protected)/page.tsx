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

const STAT_CARDS = [
  { key: 'projects',        label: 'Projects',          icon: '🚀', href: '/admin/projects' },
  { key: 'blogs',           label: 'Blog Posts',        icon: '✍️', href: '/admin/blogs' },
  { key: 'certifications',  label: 'Certifications',    icon: '🏆', href: '/admin/certifications' },
  { key: 'testimonials',    label: 'Testimonials',      icon: '💬', href: '/admin/testimonials' },
  { key: 'contacts',        label: 'Contact Messages',  icon: '📬', href: '/admin/contacts' },
  { key: 'analytics30d',    label: 'Events (30d)',       icon: '📈', href: '/admin/analytics' },
] as const;

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
  const [stats, sections] = await Promise.all([getStats(), getSectionCounts()]);

  // Checklist completion state
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

  // Profile notice: missing name, email, or title
  const profileMissingFields = [
    !sections.profileName.trim() && 'name',
    !sections.profileTitle.trim() && 'title',
    !sections.profileEmail.trim() && 'email',
  ].filter(Boolean) as string[];
  const showProfileNotice = profileMissingFields.length > 0;

  return (
    <div>
      {/* Profile notice — subtle amber banner */}
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

      <h1 className="text-2xl font-bold text-white mb-2">Dashboard</h1>
      <p className="text-gray-500 text-sm mb-8">Portfolio content overview</p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {STAT_CARDS.map(({ key, label, icon, href }) => (
          <Link
            key={key}
            href={href}
            className="bg-white/5 border border-white/8 rounded-2xl p-5 hover:border-violet-500/30 hover:bg-white/6 transition-all group"
          >
            <div className="text-2xl mb-3">{icon}</div>
            <div className="text-3xl font-bold text-white mb-1">
              {stats[key].toLocaleString()}
            </div>
            <div className="text-gray-500 text-sm group-hover:text-gray-400 transition-colors">
              {label}
            </div>
          </Link>
        ))}
      </div>

      {/* Content checklist — only shown when sections are incomplete */}
      {showChecklist && (
        <div className="mt-8 p-5 bg-white/5 border border-white/8 rounded-2xl">
          <h2 className="text-white font-semibold mb-1">Getting started</h2>
          <p className="text-gray-500 text-xs mb-4">
            Add content to populate your public portfolio.
          </p>
          <ul className="space-y-2.5">
            {CHECKLIST_ITEMS.map(({ key, label, href, desc }) => {
              const done = completion[key];
              return (
                <li key={key}>
                  <Link
                    href={href}
                    className="flex items-center gap-3 group"
                  >
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
        </div>
      )}
    </div>
  );
}
