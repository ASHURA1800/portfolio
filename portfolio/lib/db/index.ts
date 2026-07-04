import "server-only";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

// Lazily initialise so that importing this module never crashes at build time
// when DATABASE_URL hasn't been injected yet (common on Vercel's build step).
// The error is deferred until an actual DB call is made at request time.

type DB = ReturnType<typeof drizzle<typeof schema>>;

let _db: DB | undefined;

function getDb(): DB {
  if (_db) return _db;
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("[db] DATABASE_URL environment variable is not set");
  // neon() creates a Neon HTTP client — optimal for Vercel serverless (no
  // persistent connection overhead; each query goes over HTTPS).
  _db = drizzle(neon(url), { schema });
  return _db;
}

// Proxy forwards every property access to the lazily-created Drizzle instance.
// This preserves the `db.select()`, `db.insert()`, `db.$count()`, etc. API
// while keeping the module import side-effect-free during builds.
// The receiver is explicitly bound so method calls on the real instance work
// correctly without `this` pointing at the empty proxy stub.
// NOTE: neon-http uses HTTP transport and does NOT support transactions.
// Calling db.transaction() will throw at runtime. Use the neon-serverless
// WebSocket adapter if transaction support is needed.
export const db: DB = new Proxy({} as DB, {
  get(_target, prop) {
    const instance = getDb();
    const value = Reflect.get(instance, prop, instance);
    return typeof value === "function" ? value.bind(instance) : value;
  },
});

export * from "./schema";
