import { asc } from 'drizzle-orm';
import { db, certifications } from '@/lib/db';
import type { Certification } from '@/types';
import CertificationsManager from './CertificationsManager';

// Auth-gated (guarded by the (protected) layout + middleware) and shows live
// data — render per request, never statically prerendered at build time.
export const dynamic = 'force-dynamic';

async function getCertifications(): Promise<Certification[]> {
  try {
    const rows = await db
      .select()
      .from(certifications)
      .orderBy(asc(certifications.order_index), asc(certifications.issued_date));
    // Drizzle returns Date objects for date/timestamp columns; the client
    // manager only reads these as strings, so normalise to plain JSON here.
    return rows.map((r) => ({
      ...r,
      issued_date: r.issued_date ?? null,
      expiry_date: r.expiry_date ?? null,
      created_at: String(r.created_at),
      updated_at: String(r.updated_at),
    })) as Certification[];
  } catch (e) {
    console.error('[Admin Certifications] Failed to load:', e);
    return [];
  }
}

export default async function AdminCertificationsPage() {
  const initial = await getCertifications();
  return <CertificationsManager initial={initial} />;
}
