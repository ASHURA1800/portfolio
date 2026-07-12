import { Suspense } from 'react';
import { ResetPasswordForm } from './ResetPasswordForm';
import { AuthLoader } from '@/components/admin/auth/shared';

export const dynamic = 'force-dynamic';

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<AuthLoader />}>
      <ResetPasswordForm />
    </Suspense>
  );
}
