import 'server-only';
import { eq } from 'drizzle-orm';
import { db, ownerAccounts } from '@/lib/db';

export interface Owner {
  id: string;
  email: string;
  password_hash: string;
}

/**
 * Returns true when setup has been completed — a DB owner row exists.
 * Falls back to false on DB error so a fresh deploy triggers /setup.
 */
export async function ownerExists(): Promise<boolean> {
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

/** Updates the bcrypt password hash for the given owner account. */
export async function updateOwnerPassword(id: string, password_hash: string): Promise<void> {
  await db
    .update(ownerAccounts)
    .set({ password_hash })
    .where(eq(ownerAccounts.id, id));
}
