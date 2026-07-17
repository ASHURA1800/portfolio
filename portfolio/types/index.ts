// ─── Database row types (mirrors Neon/Drizzle schema) ────────────────────────

export interface Contact {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

export type ProjectStatus = 'live' | 'in-progress' | 'archived' | 'concept';

export interface ProjectMetric {
  label: string;
  value: string;
}

export interface Project {
  id: string;
  title: string;
  slug?: string | null;
  subtitle?: string | null;
  description?: string | null;
  problem: string;
  solution: string;
  long_description: string;
  stack_reasoning: string;
  image?: string | null; // cover image (Blob URL)
  gradient: string;
  tech_stack: string[];
  screenshots: string[];
  learnings: string[];
  challenges: string[];
  metrics: ProjectMetric[];
  github_url?: string | null;
  live_url?: string | null;
  category?: string | null;
  status: ProjectStatus;
  year: string;
  featured: boolean;
  case_study: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  thumbnail?: string;
  gradient: string;
  tags: string[];
  read_time?: string;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  description?: string | null;
  image?: string | null;
  icon: string;
  issued_date?: string | null;
  expiry_date?: string | null;
  credential_url?: string | null;
  skills: string[];
  is_featured: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  feedback: string;
  avatar?: string;
  avatar_url?: string;
  rating: number;
  featured: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface Analytics {
  id: string;
  event_type: AnalyticsEventType;
  metadata: Record<string, unknown>;
  ip_address?: string;
  user_agent?: string;
  referrer?: string;
  created_at: string;
}

export type AnalyticsEventType =
  | 'page_view'
  | 'project_click'
  | 'resume_download'
  | 'contact_submit'
  | 'blog_view'
  | 'github_click'
  | 'live_url_click';

// ─── API response wrapper ─────────────────────────────────────────────────────

export interface ApiSuccess<T = unknown> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  error: string;
  details?: Record<string, string[]>;
}

export type ApiResponse<T = unknown> = ApiSuccess<T> | ApiError;

// ─── Pagination ───────────────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  search?: string;
  orderBy?: string;
  order?: 'asc' | 'desc';
}

// ─── CMS content types (mirror the Drizzle tables) ────────────────────────────

export interface AboutContent {
  journey: string;
  currentFocus: string;
  philosophy: string;
  learning: string;
}

export interface Profile {
  name: string;
  username: string;
  github: string;
  email: string;
  bio: string;
  title: string;
  currentWork: string;
  location: string;
  avatar: string;
  resume: string;
  linkedin: string;
  twitter: string;
  website: string;
  about: AboutContent;
  note: string;
  contactNote: string;
  skillsNote: string;
  blogIntro: string;
}

export type SkillCategory =
  | 'Frontend'
  | 'Backend'
  | 'AI'
  | 'Database'
  | 'DevOps'
  | 'Tools';

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  proficiency: number; // 0–100
  years: string;
  context: string;
  icon?: string | null;
  order_index: number;
}

export type EmploymentType =
  | 'full-time'
  | 'part-time'
  | 'contract'
  | 'internship'
  | 'freelance';

export interface Experience {
  id: string;
  company: string;
  role: string;
  start_date: string;
  end_date: string;
  location: string;
  type: EmploymentType;
  description: string;
  tech_stack: string[];
  impact: string[];
  achievements: string[];
  current: boolean;
  order_index: number;
  /** Optional company logo URL — not yet in the DB schema; safely undefined until added. */
  logo?: string;
}

export type RoadmapStatus = 'planned' | 'in-progress' | 'done';
export type RoadmapPriority = 'low' | 'medium' | 'high' | 'critical';

export interface RoadmapItem {
  id: string;
  task: string;
  status: RoadmapStatus;
  priority: RoadmapPriority;
  milestone: string;
  target_date: string;
  deliverables: string[];
  progress: number;
  order_index: number;
}

// ─── Socials (derived from Profile) ───────────────────────────────────────────

export type SocialPlatform =
  | 'github'
  | 'linkedin'
  | 'twitter'
  | 'website'
  | 'email';

export interface Social {
  platform: SocialPlatform;
  label: string;
  href: string;
  icon: string;
}
