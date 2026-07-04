import { db, profile } from '@/lib/db';
import ProfileManager from './ProfileManager';

export const dynamic = 'force-dynamic';

async function getProfileRow() {
  try {
    const [row] = await db.select().from(profile).limit(1);
    return row ?? null;
  } catch (e) {
    console.error('[Admin Profile] Failed to load:', e);
    return null;
  }
}

export default async function AdminProfilePage() {
  return <ProfileManager initial={await getProfileRow()} />;
}
