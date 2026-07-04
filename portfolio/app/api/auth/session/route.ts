import { getUser } from '@/lib/auth/session';
import { ok, err } from '@/lib/services/response';

export async function GET() {
  const user = await getUser();

  if (!user) return err('Not authenticated', 401);

  return ok({
    user: {
      email: user.email,
      isAdmin: !!process.env.ADMIN_EMAIL && user.email === process.env.ADMIN_EMAIL,
    },
  });
}
