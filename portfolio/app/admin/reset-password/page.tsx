import { Suspense } from 'react';
import type { Metadata } from 'next';
import { PasswordRecoveryLayout, ResetForm } from '@/components/admin/auth/recovery';
import { AuthLoader } from '@/components/admin/auth/shared';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Reset Password',
};

export default function ResetPasswordPage() {
  return (
    <PasswordRecoveryLayout>
      <Suspense fallback={<AuthLoader />}>
        <ResetForm />
      </Suspense>
    </PasswordRecoveryLayout>
  );
}
