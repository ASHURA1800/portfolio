// ─────────────────────────────────────────────────────────────────────────────
// Idempotent seed script. Safe to run repeatedly — each section skips if rows
// already exist. Handles:
//   • Profile: ensures one empty row exists
//   • Owner account: migrates ADMIN_EMAIL + ADMIN_PASSWORD_HASH to DB if set
//   • Skills + Projects: starter content
//
// Run:  npm run db:seed
// (reads .env.local via dotenv, uses DATABASE_URL_DIRECT for direct connection)
// ─────────────────────────────────────────────────────────────────────────────

import { config } from 'dotenv';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '../lib/db/schema';

config({ path: '.env.local', override: true });
config();

const url = process.env.DATABASE_URL_DIRECT ?? process.env.DATABASE_URL;
if (!url) throw new Error('DATABASE_URL is not set — add it to .env.local');

const db = drizzle(neon(url), { schema });

const SKILLS = [
  { name: 'TypeScript', category: 'Frontend', proficiency: 88, years: '3+ years', context: 'Primary language across all projects' },
  { name: 'React', category: 'Frontend', proficiency: 90, years: '3+ years', context: 'Production SPAs and component systems' },
  { name: 'Next.js', category: 'Frontend', proficiency: 85, years: '2+ years', context: 'Full-stack App Router apps' },
  { name: 'Tailwind CSS', category: 'Frontend', proficiency: 88, years: '2+ years', context: 'Design systems and UI work' },
  { name: 'Node.js', category: 'Backend', proficiency: 82, years: '3+ years', context: 'APIs and server-side logic' },
  { name: 'Python', category: 'Backend', proficiency: 80, years: '2+ years', context: 'Backends and AI tooling' },
  { name: 'PostgreSQL', category: 'Database', proficiency: 80, years: '2+ years', context: 'Relational data via Neon/Drizzle' },
  { name: 'Drizzle ORM', category: 'Database', proficiency: 75, years: '1+ year', context: 'Type-safe schema and queries' },
  { name: 'OpenAI API', category: 'AI', proficiency: 82, years: '2+ years', context: 'LLM features and agents' },
  { name: 'Docker', category: 'DevOps', proficiency: 72, years: '2+ years', context: 'Containerized dev and deploys' },
  { name: 'Vercel', category: 'DevOps', proficiency: 85, years: '2+ years', context: 'Hosting and CI for web apps' },
  { name: 'Git', category: 'Tools', proficiency: 88, years: '3+ years', context: 'Daily version control' },
];

const PROJECTS = [
  {
    title: 'MonetIQ',
    slug: 'monetiq',
    description: 'A fintech platform pairing ML models with real-time market data for retail investors.',
    problem: 'Retail investors rarely get the kind of real-time, data-driven insight that professional desks take for granted.',
    solution: 'A platform that pairs machine-learning models with live market data to surface portfolio insight in a fast, approachable interface.',
    tech_stack: ['Next.js', 'Python', 'FastAPI', 'PostgreSQL', 'Redis'],
    category: 'FinTech',
    status: 'in-progress',
    year: '2025',
    featured: true,
    case_study: true,
  },
  {
    title: 'CBT Exam Portal',
    slug: 'cbt-exam-portal',
    description: 'A multi-tenant computer-based testing platform built to stay responsive under load.',
    problem: 'Institutions need to run high-stakes exams for many students at once without the system slowing down on exam day.',
    solution: 'A multi-tenant testing platform architected to stay responsive under heavy concurrent load.',
    tech_stack: ['React', 'Node.js', 'MongoDB', 'WebSocket', 'Docker'],
    category: 'EdTech',
    status: 'live',
    year: '2024',
    featured: true,
    case_study: true,
  },
  {
    title: 'AROS AI Assistant',
    slug: 'aros',
    description: 'A multi-agent assistant with tool use and persistent memory for autonomous tasks.',
    problem: "Most assistants stop at chat — they can't research, plan, and carry out multi-step work on their own.",
    solution: 'A multi-agent system with tool use and persistent memory that researches and executes tasks autonomously.',
    tech_stack: ['Python', 'LangChain', 'FastAPI', 'OpenAI', 'React'],
    category: 'AI',
    status: 'in-progress',
    year: '2025',
    featured: true,
    case_study: true,
  },
  {
    title: 'CodyChat',
    slug: 'codychat',
    description: 'A code-aware chat interface with syntax highlighting and conversation branching.',
    problem: 'General-purpose chat tools lose the thread on real codebases — no syntax awareness, no branching.',
    solution: 'A code-aware chat interface with syntax highlighting and conversation branching built for developer workflows.',
    tech_stack: ['Next.js', 'TypeScript', 'OpenAI', 'PostgreSQL'],
    category: 'Dev Tools',
    status: 'concept',
    year: '2024',
    featured: false,
    case_study: false,
  },
];

async function main() {
  // Owner account — migrate env-var credentials to DB if present and not yet seeded.
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;
  const existingOwner = await db.select().from(schema.ownerAccounts).limit(1);
  if (existingOwner.length === 0) {
    if (adminEmail && adminPasswordHash) {
      await db.insert(schema.ownerAccounts).values({
        email: adminEmail.toLowerCase(),
        password_hash: adminPasswordHash,
      });
      console.log('✓ owner_accounts: migrated from env vars');
    } else {
      console.log('• owner_accounts: empty and no ADMIN_EMAIL+ADMIN_PASSWORD_HASH set');
      console.log('  → visit /setup after deploy to create your owner account');
    }
  } else {
    console.log('• owner_accounts: already present, skipped');
  }

  // Profile — ensure exactly one (empty) row exists.
  const existingProfile = await db.select().from(schema.profile).limit(1);
  if (existingProfile.length === 0) {
    await db.insert(schema.profile).values({}).onConflictDoNothing();
    console.log('✓ profile: created 1 empty row');
  } else {
    console.log('• profile: already present, skipped');
  }

  // Skills.
  const existingSkills = await db.select().from(schema.skills).limit(1);
  if (existingSkills.length === 0) {
    await db.insert(schema.skills).values(
      SKILLS.map((s, i) => ({ ...s, order_index: i }))
    );
    console.log(`✓ skills: inserted ${SKILLS.length}`);
  } else {
    console.log('• skills: already present, skipped');
  }

  // Projects.
  const existingProjects = await db.select().from(schema.projects).limit(1);
  if (existingProjects.length === 0) {
    await db.insert(schema.projects).values(
      PROJECTS.map((p, i) => ({ ...p, order_index: i }))
    );
    console.log(`✓ projects: inserted ${PROJECTS.length}`);
  } else {
    console.log('• projects: already present, skipped');
  }

  console.log('\nSeed complete.');
}

main().catch((e) => {
  console.error('Seed failed:', e);
  process.exit(1);
});
