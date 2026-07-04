# Deployment Guide

Stack: **Next.js 15 · Neon PostgreSQL · Vercel Blob · Vercel**

---

## Prerequisites

| Requirement | Notes |
|---|---|
| Node.js 20+ | |
| Neon account | [neon.tech](https://neon.tech) — free tier is enough |
| Vercel account | [vercel.com](https://vercel.com) |
| SMTP credentials | Gmail app password, Resend, Postmark, etc. (optional) |

---

## 1. Neon Database

1. Create a new project at [console.neon.tech](https://console.neon.tech).
2. From **Connection Details**, copy two URLs:
   - **Pooled** (hostname contains `-pooler`) → `DATABASE_URL`
   - **Direct** (no `-pooler`) → `DATABASE_URL_DIRECT`
3. `DATABASE_URL` is used at runtime (serverless-safe).  
   `DATABASE_URL_DIRECT` is used by `drizzle-kit` CLI commands (DDL requires a direct connection).

---

## 2. Vercel Blob Storage

1. In the Vercel Dashboard go to **Storage → Create → Blob Store**.
2. Copy the **Read/Write token** → `BLOB_READ_WRITE_TOKEN`.

---

## 3. Local Development

```bash
# Clone and install
git clone <your-repo-url>
cd portfolio
npm install

# Copy the env template
cp .env.example .env.local
# Fill in DATABASE_URL, DATABASE_URL_DIRECT, JWT_SECRET, ADMIN_EMAIL, etc.

# Run DB migrations
npm run db:migrate

# Seed starter content (idempotent — safe to re-run)
npm run db:seed

# Start the dev server
npm run dev
```

Visit:
- `http://localhost:3000` — public portfolio
- `http://localhost:3000/setup` — first-run owner account creation (**only visible before setup**)
- `http://localhost:3000/admin` — CMS dashboard (redirects to `/setup` or `/admin/login`)
- `http://localhost:3000/blog` — blog listing

---

## 4. First-Run Setup

On a fresh database the `/setup` page is available to create the owner account.  
Once an account exists the page permanently redirects to `/admin/login`.

Alternatively, set `ADMIN_EMAIL` + `ADMIN_PASSWORD_HASH` in your environment and run:

```bash
npm run db:seed
```

This migrates the env-var credentials into the `owner_accounts` table.

---

## 5. Database Commands

| Command | Description |
|---|---|
| `npm run db:generate` | Generate a new migration after schema changes |
| `npm run db:migrate` | Apply pending migrations to Neon |
| `npm run db:push` | Push schema directly (dev only — no migration file) |
| `npm run db:studio` | Open Drizzle Studio GUI |
| `npm run db:seed` | Seed starter content (idempotent) |

> **Important**: run `db:migrate` and `db:seed` against `DATABASE_URL_DIRECT` (set in `.env.local`) to avoid PgBouncer pooler issues with DDL.

---

## 6. Deploy to Vercel

### Option A — Vercel CLI

```bash
npm i -g vercel
vercel --prod
```

### Option B — GitHub + Vercel Dashboard

1. Push this repo to GitHub.
2. Vercel Dashboard → **New Project** → Import repo.
3. Framework: **Next.js** (auto-detected).
4. Add all environment variables (see table below).
5. Click **Deploy**.

### Required Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | Neon **pooled** connection string |
| `DATABASE_URL_DIRECT` | Neon **direct** connection string (drizzle-kit) |
| `JWT_SECRET` | 32+ byte random secret (`openssl rand -base64 32`) |
| `ADMIN_EMAIL` | Admin e-mail (used by `requireAdmin` guard) |
| `ADMIN_PASSWORD_HASH` | bcrypt hash of admin password (used by seed migration) |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob read/write token |
| `NEXT_PUBLIC_SITE_URL` | Production URL, e.g. `https://yourname.vercel.app` |
| `SMTP_HOST` | SMTP server host (optional — enables contact email) |
| `SMTP_PORT` | SMTP port, usually `587` |
| `SMTP_USER` | SMTP username |
| `SMTP_PASS` | SMTP password / app password |
| `NOTIFICATION_EMAIL` | Where contact form emails are sent |
| `SENDER_NAME` | Display name in outgoing emails |
| `GITHUB_USERNAME` | Your GitHub username (powers `/api/github`) |
| `GITHUB_TOKEN` | GitHub PAT (optional — raises API rate limit) |

### Vercel Post-Deploy Checklist

- [ ] Run `npm run db:migrate` once against the production database (use `DATABASE_URL_DIRECT`).
- [ ] Run `npm run db:seed` to create the profile row and starter content.
- [ ] Visit `https://<your-domain>/setup` to create the admin account (or use the seed migration path above).
- [ ] Fill in profile, skills, projects, and experience in the admin dashboard.

---

## 7. ISR & Caching

- Public pages use ISR with `revalidate = 60` seconds.
- Admin pages use `force-dynamic` — always fresh.
- The GitHub stats route caches for 1 hour on Vercel's edge CDN.
- Revalidate a page immediately: redeploy or call `revalidatePath` from a Server Action.

---

## 8. Custom Domain

In **Vercel → Project → Settings → Domains**, add your domain and follow the DNS instructions.  
Update `NEXT_PUBLIC_SITE_URL` to match.
