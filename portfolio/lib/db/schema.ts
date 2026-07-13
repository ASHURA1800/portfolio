import { sql } from 'drizzle-orm';
import {
  pgTable,
  uuid,
  text,
  boolean,
  integer,
  date,
  timestamp,
  jsonb,
  index,
  check,
} from 'drizzle-orm/pg-core';

// Note: JS property names are kept snake_case to match the existing API
// contracts, Zod schemas, types/index.ts, and React components — so query
// results need no key remapping anywhere in the app.

// ─── contacts ─────────────────────────────────────────────────
export const contacts = pgTable(
  'contacts',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    email: text('email').notNull(),
    subject: text('subject').notNull(),
    message: text('message').notNull(),
    ip_address: text('ip_address'),
    user_agent: text('user_agent'),
    created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index('idx_contacts_created_at').on(t.created_at.desc())]
);

// ─── projects ─────────────────────────────────────────────────
export const projects = pgTable(
  'projects',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    title: text('title').notNull(),
    // slug drives /projects/<slug>. Nullable so the ADD COLUMN migration is
    // non-destructive on any pre-existing rows; unique index tolerates NULLs.
    slug: text('slug'),
    subtitle: text('subtitle'),
    description: text('description'),
    problem: text('problem').notNull().default(''),
    solution: text('solution').notNull().default(''),
    long_description: text('long_description').notNull().default(''),
    stack_reasoning: text('stack_reasoning').notNull().default(''),
    image: text('image'), // cover image (Blob URL)
    gradient: text('gradient').notNull().default('from-violet-600 to-blue-600'),
    tech_stack: text('tech_stack').array().notNull().default(sql`'{}'`),
    screenshots: text('screenshots').array().notNull().default(sql`'{}'`),
    learnings: text('learnings').array().notNull().default(sql`'{}'`),
    challenges: text('challenges').array().notNull().default(sql`'{}'`),
    metrics: jsonb('metrics')
      .$type<{ label: string; value: string }[]>()
      .notNull()
      .default([]),
    github_url: text('github_url'),
    live_url: text('live_url'),
    category: text('category'),
    status: text('status').notNull().default('concept'),
    year: text('year').notNull().default(''),
    featured: boolean('featured').notNull().default(false),
    case_study: boolean('case_study').notNull().default(false),
    order_index: integer('order_index').notNull().default(0),
    created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updated_at: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [
    index('idx_projects_featured').on(t.featured),
    index('idx_projects_order').on(t.order_index),
    index('idx_projects_slug').on(t.slug),
  ]
);

// ─── blogs ────────────────────────────────────────────────────
export const blogs = pgTable(
  'blogs',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    title: text('title').notNull(),
    slug: text('slug').notNull().unique(),
    excerpt: text('excerpt'),
    content: text('content'),
    thumbnail: text('thumbnail'),
    gradient: text('gradient').notNull().default('from-violet-600 to-blue-600'),
    tags: text('tags').array().notNull().default(sql`'{}'`),
    read_time: text('read_time'),
    published: boolean('published').notNull().default(false),
    created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updated_at: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [
    // idx_blogs_slug omitted: .unique() above already creates an index on slug
    index('idx_blogs_published').on(t.published),
  ]
);

// ─── certifications ───────────────────────────────────────────
export const certifications = pgTable(
  'certifications',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    title: text('title').notNull(),
    issuer: text('issuer').notNull(),
    description: text('description'),
    image: text('image'),
    icon: text('icon').notNull().default('🏆'),
    issued_date: date('issued_date'),
    expiry_date: date('expiry_date'),
    credential_url: text('credential_url'),
    skills: text('skills').array().notNull().default(sql`'{}'`),
    is_featured: boolean('is_featured').notNull().default(false),
    order_index: integer('order_index').notNull().default(0),
    created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updated_at: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [
    index('idx_certifications_order').on(t.order_index),
    index('idx_certifications_featured').on(t.is_featured),
  ]
);

// ─── testimonials ─────────────────────────────────────────────
export const testimonials = pgTable(
  'testimonials',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    role: text('role').notNull(),
    feedback: text('feedback').notNull(),
    avatar: text('avatar'),
    avatar_url: text('avatar_url'),
    // notNull() is required here: the CHECK constraint uses SQL comparison
    // which evaluates to NULL (not false) when rating IS NULL, bypassing it.
    rating: integer('rating').notNull().default(5),
    featured: boolean('featured').notNull().default(true),
    order_index: integer('order_index').notNull().default(0),
    created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updated_at: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [
    check('testimonials_rating_check', sql`${t.rating} >= 1 and ${t.rating} <= 5`),
    index('idx_testimonials_order').on(t.order_index),
  ]
);

// ─── analytics ────────────────────────────────────────────────
export const analytics = pgTable(
  'analytics',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    event_type: text('event_type').notNull(),
    metadata: jsonb('metadata').$type<Record<string, unknown>>().notNull().default({}),
    ip_address: text('ip_address'),
    user_agent: text('user_agent'),
    referrer: text('referrer'),
    created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index('idx_analytics_event_type').on(t.event_type),
    index('idx_analytics_created_at').on(t.created_at.desc()),
  ]
);

// ─── profile (single row) ─────────────────────────────────────
// One-row table: the whole site's identity. `singleton` has a unique index so
// a second row can never be inserted; the API reads/updates the sole row.
export const profile = pgTable(
  'profile',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    singleton: integer('singleton').notNull().default(1).unique(),
    name: text('name').notNull().default(''),
    username: text('username').notNull().default(''),
    github: text('github').notNull().default(''),
    email: text('email').notNull().default(''),
    bio: text('bio').notNull().default(''),
    title: text('title').notNull().default(''),
    current_work: text('current_work').notNull().default(''),
    location: text('location').notNull().default(''),
    avatar: text('avatar').notNull().default(''),
    resume: text('resume').notNull().default(''),
    linkedin: text('linkedin').notNull().default(''),
    twitter: text('twitter').notNull().default(''),
    website: text('website').notNull().default(''),
    about_journey: text('about_journey').notNull().default(''),
    about_current_focus: text('about_current_focus').notNull().default(''),
    about_philosophy: text('about_philosophy').notNull().default(''),
    about_learning: text('about_learning').notNull().default(''),
    note: text('note').notNull().default(''),
    contact_note: text('contact_note').notNull().default(''),
    skills_note: text('skills_note').notNull().default(''),
    blog_intro: text('blog_intro').notNull().default(''),
    updated_at: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow()
      .$onUpdate(() => new Date()),
  }
);

// ─── skills ───────────────────────────────────────────────────
export const skills = pgTable(
  'skills',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    category: text('category').notNull(),
    proficiency: integer('proficiency').notNull().default(0),
    years: text('years').notNull().default(''),
    context: text('context').notNull().default(''),
    icon: text('icon'),
    order_index: integer('order_index').notNull().default(0),
    created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updated_at: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [
    check('skills_proficiency_check', sql`${t.proficiency} >= 0 and ${t.proficiency} <= 100`),
    index('idx_skills_order').on(t.order_index),
  ]
);

// ─── experience ───────────────────────────────────────────────
export const experience = pgTable(
  'experience',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    company: text('company').notNull(),
    role: text('role').notNull(),
    start_date: text('start_date').notNull(),
    end_date: text('end_date').notNull().default(''),
    location: text('location').notNull().default(''),
    type: text('type').notNull().default('full-time'),
    description: text('description').notNull().default(''),
    tech_stack: text('tech_stack').array().notNull().default(sql`'{}'`),
    impact: text('impact').array().notNull().default(sql`'{}'`),
    achievements: text('achievements').array().notNull().default(sql`'{}'`),
    current: boolean('current').notNull().default(false),
    order_index: integer('order_index').notNull().default(0),
    created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updated_at: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [index('idx_experience_order').on(t.order_index)]
);

// ─── build_log ────────────────────────────────────────────────
export const buildLog = pgTable(
  'build_log',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    date: text('date').notNull(), // "YYYY-MM" or "YYYY-MM-DD" — sortable
    title: text('title').notNull(),
    summary: text('summary').notNull().default(''),
    status: text('status').notNull().default('shipped'),
    tags: text('tags').array().notNull().default(sql`'{}'`),
    created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updated_at: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [index('idx_build_log_date').on(t.date.desc())]
);

// ─── learnings ────────────────────────────────────────────────
export const learnings = pgTable(
  'learnings',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    title: text('title').notNull(),
    description: text('description').notNull().default(''),
    category: text('category').notNull().default('general'),
    difficulty: text('difficulty').notNull().default('beginner'),
    resources: jsonb('resources').$type<{ label: string; url: string }[]>().notNull().default(sql`'[]'`),
    order_index: integer('order_index').notNull().default(0),
    created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updated_at: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [index('idx_learnings_order').on(t.order_index)]
);

// ─── roadmap ──────────────────────────────────────────────────
export const roadmap = pgTable(
  'roadmap',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    task: text('task').notNull(),
    status: text('status').notNull().default('planned'),
    priority: text('priority').notNull().default('medium'),
    milestone: text('milestone').notNull().default(''),
    target_date: text('target_date').notNull().default(''),
    deliverables: text('deliverables').array().notNull().default(sql`'{}'`),
    progress: integer('progress').notNull().default(0),
    order_index: integer('order_index').notNull().default(0),
    created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updated_at: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [index('idx_roadmap_order').on(t.order_index)]
);

// ─── owner_accounts ───────────────────────────────────────────
// Single logical row enforced at the API level. Created via /setup on first
// deploy; the /setup route permanently disables itself once a row exists.
export const ownerAccounts = pgTable('owner_accounts', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  password_hash: text('password_hash').notNull(),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

// ─── password_reset_tokens ────────────────────────────────────
// Time-limited tokens for the Forgot Password flow.
// Stores a SHA-256 hash of the raw token (raw token goes only in the email).
// Invalidated on use (used_at set) or expiry (expires_at passed).
export const passwordResetTokens = pgTable(
  'password_reset_tokens',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    owner_id: uuid('owner_id').notNull().references(() => ownerAccounts.id, { onDelete: 'cascade' }),
    token_hash: text('token_hash').notNull().unique(),
    expires_at: timestamp('expires_at', { withTimezone: true }).notNull(),
    used_at: timestamp('used_at', { withTimezone: true }),
    created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index('idx_prt_owner').on(t.owner_id),
    index('idx_prt_expires').on(t.expires_at),
  ]
);
