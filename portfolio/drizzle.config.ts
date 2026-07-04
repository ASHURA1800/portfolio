import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

// .env.local holds real secrets (gitignored, per Next.js convention) and takes
// priority. .env provides non-secret fallbacks for anything not in .env.local.
config({ path: '.env.local', override: true });
config();

// Neon: prefer a direct (non-pooled) connection URL for drizzle-kit commands.
// The pooler endpoint (-pooler in the hostname) uses PgBouncer which can drop
// DDL statements, and its channel_binding param is unsupported by the pg client
// bundled in drizzle-kit. Add DATABASE_URL_DIRECT to .env.local pointing at the
// non-pooler Neon endpoint when running migrations or schema pushes.
const url = process.env.DATABASE_URL_DIRECT ?? process.env.DATABASE_URL;
if (!url) throw new Error('DATABASE_URL is not set — add it to .env.local');

export default defineConfig({
  schema: './lib/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: { url },
});
