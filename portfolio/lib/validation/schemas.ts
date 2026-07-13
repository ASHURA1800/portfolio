import { z } from 'zod';

// ─── Shared helpers ───────────────────────────────────────────────────────────

// Accepts a valid URL or an empty string (clear intent from admin UI).
// Transforms "" → null so the DB stores NULL, not an empty string.
const optionalUrl = (msg: string) =>
  z.string().url(msg).or(z.literal('')).optional().transform((v) => (v === '' ? null : v));

// Like optionalUrl but keeps "" as "" (no null) — for NOT NULL columns that
// default to '' (e.g. the single-row profile table).
const urlOrEmpty = (msg: string) =>
  z.string().trim().url(msg).or(z.literal('')).optional();

// ─── Contact ─────────────────────────────────────────────────────────────────

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name too long'),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email('Invalid email address')
    .max(200, 'Email too long'),
  subject: z
    .string()
    .trim()
    .min(3, 'Subject must be at least 3 characters')
    .max(200, 'Subject too long'),
  message: z
    .string()
    .trim()
    .min(10, 'Message must be at least 10 characters')
    .max(5000, 'Message too long'),
  // Honeypot — bots fill this in, humans don't
  website: z.string().max(0, 'Bot detected').optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;

// ─── Project ──────────────────────────────────────────────────────────────────

export const projectSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(200),
  // Lowercase-hyphen slug drives /projects/<slug>; optional (only case studies need one)
  slug: z
    .string()
    .trim()
    .max(200)
    .regex(/^[a-z0-9-]*$/, 'Slug must be lowercase with hyphens only')
    .optional(),
  subtitle: z.string().trim().max(300).optional(),
  description: z.string().trim().max(2000).optional(),
  problem: z.string().trim().max(2000).default(''),
  solution: z.string().trim().max(2000).default(''),
  long_description: z.string().trim().max(20_000).default(''),
  stack_reasoning: z.string().trim().max(4000).default(''),
  image: optionalUrl('Invalid image URL'),
  gradient: z.string().trim().max(200).default('from-violet-600 to-blue-600'),
  // Per-item cap prevents oversized tag strings; array cap bounds total storage
  tech_stack: z.array(z.string().trim().max(100)).max(50).default([]),
  screenshots: z.array(z.string().trim().url('Invalid screenshot URL')).max(20).default([]),
  learnings: z.array(z.string().trim().max(500)).max(30).default([]),
  challenges: z.array(z.string().trim().max(500)).max(30).default([]),
  metrics: z
    .array(
      z.object({
        label: z.string().trim().min(1).max(100),
        value: z.string().trim().min(1).max(100),
      })
    )
    .max(12)
    .default([]),
  github_url: optionalUrl('Invalid GitHub URL'),
  live_url: optionalUrl('Invalid live URL'),
  category: z.string().trim().max(100).optional(),
  status: z.enum(['live', 'in-progress', 'archived', 'concept']).default('concept'),
  year: z.string().trim().max(20).default(''),
  featured: z.boolean().default(false),
  case_study: z.boolean().default(false),
  order_index: z.number().int().default(0),
});

export type ProjectInput = z.infer<typeof projectSchema>;

// ─── Blog ─────────────────────────────────────────────────────────────────────

export const blogSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(300),
  slug: z
    .string()
    .trim()
    .min(1, 'Slug is required')
    .max(200)
    .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with hyphens only'),
  excerpt: z.string().trim().max(500).optional(),
  // Unbounded content is a DoS vector — 200k chars is generous for any blog post
  content: z.string().max(200_000).optional(),
  thumbnail: optionalUrl('Invalid thumbnail URL'),
  gradient: z.string().trim().max(200).default('from-violet-600 to-blue-600'),
  tags: z.array(z.string().trim().max(100)).max(50).default([]),
  read_time: z.string().trim().max(50).optional(),
  published: z.boolean().default(false),
});

export type BlogInput = z.infer<typeof blogSchema>;

// ─── Certification ────────────────────────────────────────────────────────────

export const certificationSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(200),
  issuer: z.string().trim().min(1, 'Issuer is required').max(200),
  description: z.string().trim().max(2000).optional(),
  image: optionalUrl('Invalid image URL'),
  icon: z.string().max(10).default('🏆'),
  // Require ISO 8601 (YYYY-MM-DD) so Postgres date columns never see garbage input
  issued_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
    .optional(),
  expiry_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
    .optional(),
  credential_url: optionalUrl('Invalid credential URL'),
  // Skill tags — trimmed, de-noised, capped so the array column stays bounded
  skills: z.array(z.string().trim().min(1).max(50)).max(20).default([]),
  is_featured: z.boolean().default(false),
  order_index: z.number().int().default(0),
});

export type CertificationInput = z.infer<typeof certificationSchema>;

// ─── Testimonial ─────────────────────────────────────────────────────────────

export const testimonialSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100),
  role: z.string().trim().min(1, 'Role is required').max(200),
  feedback: z.string().trim().min(10, 'Feedback too short').max(2000),
  avatar: z.string().max(10).optional(),
  avatar_url: optionalUrl('Invalid avatar URL'),
  rating: z.number().int().min(1).max(5).default(5),
  featured: z.boolean().default(true),
  order_index: z.number().int().default(0),
});

export type TestimonialInput = z.infer<typeof testimonialSchema>;

// ─── Profile (single row) ─────────────────────────────────────────────────────
// All fields optional so the admin can save partial edits; empty strings are
// allowed and meaningful ("not set"). URLs validated only when non-empty.
export const profileSchema = z.object({
  name: z.string().trim().max(120).optional(),
  username: z.string().trim().max(60).optional(),
  github: urlOrEmpty('Invalid GitHub URL'),
  email: z.string().trim().email('Invalid email').or(z.literal('')).optional(),
  bio: z.string().trim().max(600).optional(),
  title: z.string().trim().max(120).optional(),
  current_work: z.string().trim().max(200).optional(),
  location: z.string().trim().max(120).optional(),
  avatar: urlOrEmpty('Invalid avatar URL'),
  resume: urlOrEmpty('Invalid resume URL'),
  linkedin: urlOrEmpty('Invalid LinkedIn URL'),
  twitter: urlOrEmpty('Invalid Twitter URL'),
  website: urlOrEmpty('Invalid website URL'),
  about_journey: z.string().trim().max(2000).optional(),
  about_current_focus: z.string().trim().max(2000).optional(),
  about_philosophy: z.string().trim().max(2000).optional(),
  about_learning: z.string().trim().max(2000).optional(),
  note: z.string().trim().max(300).optional(),
  contact_note: z.string().trim().max(300).optional(),
  skills_note: z.string().trim().max(300).optional(),
  blog_intro: z.string().trim().max(300).optional(),
});

export type ProfileInput = z.infer<typeof profileSchema>;

// ─── Skill ────────────────────────────────────────────────────────────────────

export const skillSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100),
  category: z.enum(['Frontend', 'Backend', 'AI', 'Database', 'DevOps', 'Tools']),
  proficiency: z.number().int().min(0).max(100).default(0),
  years: z.string().trim().max(50).default(''),
  context: z.string().trim().max(300).default(''),
  icon: z.string().trim().max(50).optional(),
  order_index: z.number().int().default(0),
});

export type SkillInput = z.infer<typeof skillSchema>;

// ─── Experience ───────────────────────────────────────────────────────────────

export const experienceSchema = z.object({
  company: z.string().trim().min(1, 'Company is required').max(200),
  role: z.string().trim().min(1, 'Role is required').max(200),
  start_date: z.string().trim().min(1, 'Start date is required').max(50),
  end_date: z.string().trim().max(50).default(''),
  location: z.string().trim().max(200).default(''),
  type: z
    .enum(['full-time', 'part-time', 'contract', 'internship', 'freelance'])
    .default('full-time'),
  description: z.string().trim().max(2000).default(''),
  tech_stack: z.array(z.string().trim().max(100)).max(50).default([]),
  impact: z.array(z.string().trim().max(500)).max(30).default([]),
  achievements: z.array(z.string().trim().max(500)).max(30).default([]),
  current: z.boolean().default(false),
  order_index: z.number().int().default(0),
});

export type ExperienceInput = z.infer<typeof experienceSchema>;

// ─── Build log ────────────────────────────────────────────────────────────────

export const buildLogSchema = z.object({
  // Accept YYYY-MM or YYYY-MM-DD so entries stay sortable as strings
  date: z.string().regex(/^\d{4}-\d{2}(-\d{2})?$/, 'Date must be YYYY-MM or YYYY-MM-DD'),
  title: z.string().trim().min(1, 'Title is required').max(200),
  summary: z.string().trim().max(4000).default(''),
  status: z.enum(['shipped', 'in-progress', 'planned']).default('shipped'),
  tags: z.array(z.string().trim().min(1).max(40)).max(15).default([]),
});

export type BuildLogInput = z.infer<typeof buildLogSchema>;

// ─── Learning ─────────────────────────────────────────────────────────────────

export const learningSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(200),
  description: z.string().trim().max(4000).default(''),
  category: z.string().trim().min(1).max(60).default('general'),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']).default('beginner'),
  resources: z
    .array(
      z.object({
        label: z.string().trim().min(1).max(120),
        url: z.string().trim().url('Invalid resource URL'),
      })
    )
    .max(20)
    .default([]),
  order_index: z.number().int().default(0),
});

export type LearningInput = z.infer<typeof learningSchema>;

// ─── Roadmap ──────────────────────────────────────────────────────────────────

export const roadmapSchema = z.object({
  task: z.string().trim().min(1, 'Task is required').max(300),
  status: z.enum(['planned', 'in-progress', 'done']).default('planned'),
  priority: z.enum(['low', 'medium', 'high', 'critical']).default('medium'),
  milestone: z.string().trim().max(200).default(''),
  target_date: z
    .string()
    .trim()
    .regex(/^(\d{4}-\d{2}(-\d{2})?)?$/, 'Date must be YYYY-MM or YYYY-MM-DD')
    .default(''),
  deliverables: z.array(z.string().trim().min(1).max(200)).max(30).default([]),
  progress: z.number().int().min(0).max(100).default(0),
  order_index: z.number().int().default(0),
});

export type RoadmapInput = z.infer<typeof roadmapSchema>;

// ─── Analytics ───────────────────────────────────────────────────────────────

export const analyticsSchema = z.object({
  event_type: z.enum([
    'page_view',
    'project_click',
    'resume_download',
    'contact_submit',
    'blog_view',
    'github_click',
    'live_url_click',
  ]),
  // Public endpoint: restrict values to primitives and cap key count
  // to prevent deeply nested JSON payloads abusing the jsonb column.
  metadata: z
    .record(
      z.string().max(100),
      z.union([z.string().max(500), z.number(), z.boolean(), z.null()])
    )
    .refine((m) => Object.keys(m).length <= 20, 'Too many metadata keys')
    .default({}),
  referrer: z.string().max(500).optional(),
});

export type AnalyticsInput = z.infer<typeof analyticsSchema>;

// ─── Pagination query ─────────────────────────────────────────────────────────

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().trim().optional(),
  orderBy: z.string().trim().optional(),
  order: z.enum(['asc', 'desc']).default('desc'),
});

// ─── Storage upload ───────────────────────────────────────────────────────────

export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  // SVG intentionally excluded: SVG files can contain <script> tags and event
  // handlers that execute in-browser when served directly or embedded, creating
  // a stored XSS vector.
] as const;

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export const STORAGE_BUCKETS = [
  'projects',
  'blogs',
  'certifications',
  'avatars',
  'resume',
] as const;

export type StorageBucket = (typeof STORAGE_BUCKETS)[number];
