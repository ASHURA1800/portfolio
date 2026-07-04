import 'server-only';
import { eq } from 'drizzle-orm';
import { db, ownerAccounts } from '@/lib/db';

export interface Owner {
  id: string;
  email: string;
  password_hash: string;
}

/**
 * Returns true when setup has been completed — either a DB owner row exists
 * or legacy env-var credentials (ADMIN_EMAIL + ADMIN_PASSWORD_HASH) are set.
 * Falls back to false on DB error so a fresh deploy triggers /setup.
 */
export async function ownerExists(): Promise<boolean> {
  // Legacy: env var credentials present → skip setup
  if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD_HASH) return true;
  try {
    const [row] = await db
      .select({ id: ownerAccounts.id })
      .from(ownerAccounts)
      .limit(1);
    return !!row;
  } catch {
    return false;
  }
}

/**
 * Returns the owner account for the given email (case-insensitive), or null.
 * Used by the login route to validate DB-backed credentials.
 */
export async function getOwnerByEmail(email: string): Promise<Owner | null> {
  try {
    const [row] = await db
      .select()
      .from(ownerAccounts)
      .where(eq(ownerAccounts.email, email.toLowerCase()))
      .limit(1);
    return row ?? null;
  } catch {
    return null;
  }
}
