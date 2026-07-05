import 'server-only';
import crypto from 'crypto';
import { eq, and, gt, isNull } from 'drizzle-orm';
import { db, passwordResetTokens, ownerAccounts } from '@/lib/db';

const TOKEN_EXPIRY_MS = 60 * 60 * 1000; // 1 hour

function hashToken(rawToken: string): string {
  return crypto.createHash('sha256').update(rawToken).digest('hex');
}

/**
 * Generates a cryptographically random token, stores its SHA-256 hash in the
 * database, and returns the raw token (to be sent via email only).
 * Any existing unused tokens for this owner are deleted first.
 */
export async function createResetToken(ownerId: string): Promise<string> {
  const rawToken = crypto.randomBytes(32).toString('hex');
  const token_hash = hashToken(rawToken);
  const expires_at = new Date(Date.now() + TOKEN_EXPIRY_MS);

  // Invalidate existing tokens for this owner before creating a new one
  await db
    .delete(passwordResetTokens)
    .where(eq(passwordResetTokens.owner_id, ownerId));

  await db.insert(passwordResetTokens).values({ owner_id: ownerId, token_hash, expires_at });

  return rawToken;
}

export interface TokenOwner {
  tokenId: string;
  ownerId: string;
  email: string;
}

/**
 * Validates a raw reset token. Returns the associated owner if the token
 * exists, has not been used, and has not expired. Returns null otherwise.
 */
export async function validateResetToken(rawToken: string): Promise<TokenOwner | null> {
  const token_hash = hashToken(rawToken);
  const now = new Date();

  try {
    const [row] = await db
      .select({
        tokenId: passwordResetTokens.id,
        ownerId: passwordResetTokens.owner_id,
        email: ownerAccounts.email,
      })
      .from(passwordResetTokens)
      .innerJoin(ownerAccounts, eq(passwordResetTokens.owner_id, ownerAccounts.id))
      .where(
        and(
          eq(passwordResetTokens.token_hash, token_hash),
          isNull(passwordResetTokens.used_at),
          gt(passwordResetTokens.expires_at, now)
        )
      )
      .limit(1);

    if (!row) return null;
    return { tokenId: row.tokenId, ownerId: row.ownerId, email: row.email };
  } catch {
    return null;
  }
}

/** Marks a reset token as used so it cannot be replayed. */
export async function consumeResetToken(tokenId: string): Promise<void> {
  await db
    .update(passwordResetTokens)
    .set({ used_at: new Date() })
    .where(eq(passwordResetTokens.id, tokenId));
}
