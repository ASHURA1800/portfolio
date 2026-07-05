# Portfolio CMS

A self-hosted developer portfolio with a full content management system. Everything is editable through an admin dashboard — no code changes needed to update your profile, projects, blog posts, skills, certifications, and more.

---

## Features

- **Admin CMS** — password-protected dashboard at `/admin` for managing all content
- **Public portfolio** — home page with hero, about, projects, skills, experience, build log, learnings, roadmap, certifications, and contact sections
- **Blog** — write and publish articles with ISR (content appears within 60 s of publish)
- **Project case studies** — per-project detail pages at `/projects/:slug`
- **Contact form** — rate-limited with email notification and auto-reply
- **File uploads** — images and resume stored on Vercel Blob
- **GitHub stats** — live repo stats fetched from the GitHub API
- **Analytics** — simple event tracking (page views, project clicks, resume downloads)
- **First-run setup** — `/setup` creates the owner account on a fresh deploy
- **ISR** — public pages revalidate every 60 s; zero redeploys needed for content updates
- **Security** — JWT sessions, bcrypt passwords, Zod validation, rate limiting, security headers, XSS-sanitised blog HTML

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Database | Neon (serverless PostgreSQL) |
| ORM | Drizzle ORM |
| Storage | Vercel Blob |
| Auth | JWT (jose) + bcrypt |
| Email | Nodemailer (SMTP) |
| Deployment | Vercel |

---

## Architecture

```
Browser / CDN
    │
    ▼
Next.js App Router (Vercel Edge + Node.js)
    │
    ├── /app                  Page components (Server + Client)
    │   ├── (public)          Portfolio homepage, blog, project pages
    │   ├── admin/            CMS dashboard (protected)
    │   ├── api/              REST API routes
    │   └── setup/            First-run owner account creation
    │
    ├── /lib
    │   ├── db/               Drizzle schema + Neon client
    │   ├── auth/             JWT signing/verification, session helpers
    │   ├── content/          Server-only DB query helpers
    │   ├── services/         Email (nodemailer), API response helpers
    │   ├── storage/          Vercel Blob upload/delete
    │   └── validation/       Zod schemas, rate limiter
    │
    └── Neon PostgreSQL ◄──── Drizzle migrations (drizzle/)
        Vercel Blob  ◄──────── File uploads (images, resume)
```

**Data flow:**
- Public pages are Server Components that query Neon directly via Drizzle.
- ISR (`revalidate = 60`) means content is prerendered and cached, refreshing automatically.
- Admin pages call `requireAdmin()` server-side and re-verify the JWT on every request.
- The Edge middleware guards all `/admin/**` routes before the request reaches the server.

---

## Folder Structure

```
portfolio/
├── app/
│   ├── admin/
│   │   ├── (protected)/      Auth-gated CMS pages
│   │   │   ├── page.tsx      Dashboard with content stats
│   │   │   ├── profile/      Profile editor
│   │   │   ├── projects/     Project CRUD
│   │   │   ├── skills/       Skills editor
│   │   │   ├── experience/   Work history editor
│   │   │   ├── certifications/
│   │   │   ├── buildlog/
│   │   │   ├── learnings/
│   │   │   └── roadmap/
│   │   ├── _components/      AdminSidebar
│   │   ├── login/            Login page + form
│   │   └── layout.tsx        Admin root layout (noindex)
│   ├── api/
│   │   ├── auth/             login · logout · session · setup
│   │   ├── analytics/        Event tracking
│   │   ├── blogs/            Public + admin CRUD
│   │   ├── buildlog/
│   │   ├── certifications/
│   │   ├── contact/
│   │   ├── experience/
│   │   ├── github/           GitHub stats proxy (1 h cache)
│   │   ├── learnings/
│   │   ├── profile/
│   │   ├── projects/
│   │   ├── resume/download/  Blob redirect + analytics
│   │   ├── roadmap/
│   │   ├── skills/
│   │   ├── storage/[bucket]/ File upload/delete (admin only)
│   │   └── testimonials/
│   ├── blog/                 Blog listing + [slug] detail
│   ├── projects/[slug]/      Case study pages
│   ├── setup/                First-run account creation
│   ├── layout.tsx            Root layout (fonts, metadata)
│   └── page.tsx              Public homepage
├── components/
│   ├── layout/               Navbar, Footer
│   ├── sections/             One component per homepage section
│   └── ui/                   Button, Reveal, SectionHeading, etc.
├── drizzle/                  SQL migration files
├── hooks/                    useAnalytics, useContact
├── lib/                      (see Architecture above)
├── scripts/
│   └── seed-content.ts       Idempotent DB seed
├── types/
│   └── index.ts              Shared TypeScript types
├── .env.example              Env var template
├── DEPLOYMENT.md             Full deployment guide
├── drizzle.config.ts
├── middleware.ts             Edge JWT guard
└── next.config.ts
```

---

## Installation

```bash
# 1. Clone
git clone <your-repo-url>
cd portfolio

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env.local
# Edit .env.local — see Environment Variables below
```

---

## Environment Variables

Copy `.env.example` to `.env.local` and fill in every value.

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | ✅ | Neon **pooled** connection string |
| `DATABASE_URL_DIRECT` | ✅ | Neon **direct** connection string (drizzle-kit) |
| `JWT_SECRET` | ✅ | 32+ byte random secret (`openssl rand -base64 32`) |
| `ADMIN_EMAIL` | ✅ | Admin email address |
| `ADMIN_PASSWORD_HASH` | ⬜ | bcrypt hash — used by seed migration; omit to use `/setup` |
| `BLOB_READ_WRITE_TOKEN` | ✅ | Vercel Blob token |
| `NEXT_PUBLIC_SITE_URL` | ✅ | Production URL (e.g. `https://yourname.vercel.app`) |
| `SMTP_HOST` | ⬜ | SMTP server — contact emails disabled when absent |
| `SMTP_PORT` | ⬜ | Usually `587` |
| `SMTP_USER` | ⬜ | SMTP username |
| `SMTP_PASS` | ⬜ | SMTP password / app password |
| `NOTIFICATION_EMAIL` | ⬜ | Where contact form emails are sent |
| `SENDER_NAME` | ⬜ | Display name in outgoing emails |
| `GITHUB_USERNAME` | ⬜ | GitHub username (powers `/api/github`) |
| `GITHUB_TOKEN` | ⬜ | GitHub PAT — optional, raises rate limit |

---

## Database Migration

```bash
# Apply pending migrations to Neon
npm run db:migrate

# After editing lib/db/schema.ts, generate a new migration
npm run db:generate

# (Dev only) push schema without a migration file
npm run db:push

# Open Drizzle Studio GUI
npm run db:studio
```

> Always use `DATABASE_URL_DIRECT` (set in `.env.local`) for CLI commands — the pooled URL uses PgBouncer which does not support DDL.

---

## Seed

```bash
npm run db:seed
```

Idempotent — safe to run repeatedly. Seeds:
- One empty profile row (required for the homepage to render)
- Starter skills and projects
- Owner account migration from `ADMIN_EMAIL` + `ADMIN_PASSWORD_HASH` env vars (if set)

---

## First-Run Setup

1. Run migrations: `npm run db:migrate`
2. Run seed: `npm run db:seed`
3. Start the server: `npm run dev` (or deploy)
4. Visit `/setup` — this page is only visible before any owner account exists
5. Create your owner account
6. Log in at `/admin` and fill in your profile, projects, skills, and experience

---

## Admin Login

- URL: `/admin/login` (redirects to `/admin` when authenticated)
- Credentials: the email and password you created via `/setup` (or seeded from env vars)
- Sessions expire after **7 days**

---

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for the full Neon + Vercel deployment guide.

**Quick version:**

```bash
# Deploy to Vercel
vercel --prod
```

Then set all environment variables in **Vercel → Project → Settings → Environment Variables** and run the post-deploy steps described in DEPLOYMENT.md.

---

## Development

```bash
npm run dev     # Start dev server at http://localhost:3000
npm run build   # Production build
npm run lint    # ESLint
```

---

## License

MIT — see [LICENSE](../LICENSE) for details.
