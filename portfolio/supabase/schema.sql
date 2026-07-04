-- ============================================================
-- Portfolio Database Schema
-- Run this in the Supabase SQL Editor
-- ============================================================

-- ── Enable UUID extension ──────────────────────────────────
create extension if not exists "uuid-ossp";

-- ── contacts ──────────────────────────────────────────────
create table if not exists public.contacts (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  email       text not null,
  subject     text not null,
  message     text not null,
  ip_address  text,
  user_agent  text,
  created_at  timestamptz not null default now()
);

-- ── projects ──────────────────────────────────────────────
create table if not exists public.projects (
  id           uuid primary key default uuid_generate_v4(),
  title        text not null,
  subtitle     text,
  description  text,
  image        text,
  gradient     text default 'from-violet-600 to-blue-600',
  tech_stack   text[] default '{}',
  github_url   text,
  live_url     text,
  category     text,
  featured     boolean default false,
  order_index  int default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- ── blogs ─────────────────────────────────────────────────
create table if not exists public.blogs (
  id          uuid primary key default uuid_generate_v4(),
  title       text not null,
  slug        text unique not null,
  excerpt     text,
  content     text,
  thumbnail   text,
  gradient    text default 'from-violet-600 to-blue-600',
  tags        text[] default '{}',
  read_time   text,
  published   boolean default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ── certifications ────────────────────────────────────────
create table if not exists public.certifications (
  id           uuid primary key default uuid_generate_v4(),
  title        text not null,
  issuer       text not null,
  image        text,
  icon         text default '🏆',
  issued_date  date,
  expiry_date  date,
  credential_url text,
  order_index  int default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- ── testimonials ──────────────────────────────────────────
create table if not exists public.testimonials (
  id         uuid primary key default uuid_generate_v4(),
  name       text not null,
  role       text not null,
  feedback   text not null,
  avatar     text,
  avatar_url text,
  rating     int default 5 check (rating >= 1 and rating <= 5),
  featured   boolean default true,
  order_index int default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ── analytics ─────────────────────────────────────────────
create table if not exists public.analytics (
  id          uuid primary key default uuid_generate_v4(),
  event_type  text not null,   -- 'page_view' | 'project_click' | 'resume_download' | 'contact_submit'
  metadata    jsonb default '{}',
  ip_address  text,
  user_agent  text,
  referrer    text,
  created_at  timestamptz not null default now()
);

-- ── storage buckets ───────────────────────────────────────
insert into storage.buckets (id, name, public)
values
  ('projects',        'projects',        true),
  ('blogs',           'blogs',           true),
  ('certifications',  'certifications',  true),
  ('avatars',         'avatars',         true),
  ('resume',          'resume',          true)
on conflict (id) do nothing;

-- ── updated_at trigger function ───────────────────────────
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace trigger projects_updated_at
  before update on public.projects
  for each row execute procedure public.handle_updated_at();

create or replace trigger blogs_updated_at
  before update on public.blogs
  for each row execute procedure public.handle_updated_at();

create or replace trigger certifications_updated_at
  before update on public.certifications
  for each row execute procedure public.handle_updated_at();

create or replace trigger testimonials_updated_at
  before update on public.testimonials
  for each row execute procedure public.handle_updated_at();

-- ── Row Level Security ────────────────────────────────────

-- contacts: public can INSERT, only authenticated admin can SELECT/UPDATE/DELETE
alter table public.contacts enable row level security;

create policy "Public can insert contacts"
  on public.contacts for insert to anon, authenticated
  with check (true);

create policy "Admin can view contacts"
  on public.contacts for select to authenticated
  using (auth.jwt() ->> 'email' = current_setting('app.admin_email', true));

create policy "Admin can delete contacts"
  on public.contacts for delete to authenticated
  using (auth.jwt() ->> 'email' = current_setting('app.admin_email', true));

-- projects: public can read, only authenticated admin can mutate
alter table public.projects enable row level security;

create policy "Public can view projects"
  on public.projects for select to anon, authenticated
  using (true);

create policy "Admin can manage projects"
  on public.projects for all to authenticated
  using (auth.jwt() ->> 'email' = current_setting('app.admin_email', true))
  with check (auth.jwt() ->> 'email' = current_setting('app.admin_email', true));

-- blogs: public can read published, admin can see all
alter table public.blogs enable row level security;

create policy "Public can view published blogs"
  on public.blogs for select to anon
  using (published = true);

create policy "Admin can manage blogs"
  on public.blogs for all to authenticated
  using (auth.jwt() ->> 'email' = current_setting('app.admin_email', true))
  with check (auth.jwt() ->> 'email' = current_setting('app.admin_email', true));

-- certifications: public read-only
alter table public.certifications enable row level security;

create policy "Public can view certifications"
  on public.certifications for select to anon, authenticated
  using (true);

create policy "Admin can manage certifications"
  on public.certifications for all to authenticated
  using (auth.jwt() ->> 'email' = current_setting('app.admin_email', true))
  with check (auth.jwt() ->> 'email' = current_setting('app.admin_email', true));

-- testimonials: public read featured
alter table public.testimonials enable row level security;

create policy "Public can view testimonials"
  on public.testimonials for select to anon, authenticated
  using (true);

create policy "Admin can manage testimonials"
  on public.testimonials for all to authenticated
  using (auth.jwt() ->> 'email' = current_setting('app.admin_email', true))
  with check (auth.jwt() ->> 'email' = current_setting('app.admin_email', true));

-- analytics: public insert, admin read
alter table public.analytics enable row level security;

create policy "Public can insert analytics"
  on public.analytics for insert to anon, authenticated
  with check (true);

create policy "Admin can view analytics"
  on public.analytics for select to authenticated
  using (auth.jwt() ->> 'email' = current_setting('app.admin_email', true));

-- ── Storage RLS ───────────────────────────────────────────

-- Public read all buckets
create policy "Public can view project images"
  on storage.objects for select to anon, authenticated
  using (bucket_id in ('projects', 'blogs', 'certifications', 'avatars', 'resume'));

-- Admin can upload/delete in all buckets
create policy "Admin can upload files"
  on storage.objects for insert to authenticated
  with check (auth.jwt() ->> 'email' = current_setting('app.admin_email', true));

create policy "Admin can update files"
  on storage.objects for update to authenticated
  using (auth.jwt() ->> 'email' = current_setting('app.admin_email', true));

create policy "Admin can delete files"
  on storage.objects for delete to authenticated
  using (auth.jwt() ->> 'email' = current_setting('app.admin_email', true));

-- ── Indexes ───────────────────────────────────────────────
create index if not exists idx_analytics_event_type on public.analytics(event_type);
create index if not exists idx_analytics_created_at on public.analytics(created_at desc);
create index if not exists idx_blogs_slug on public.blogs(slug);
create index if not exists idx_blogs_published on public.blogs(published);
create index if not exists idx_projects_featured on public.projects(featured);
create index if not exists idx_contacts_created_at on public.contacts(created_at desc);
