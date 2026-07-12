import type { Metadata } from 'next';
import { PasswordRecoveryLayout } from '@/components/admin/auth/recovery';
import { RecoveryForm } from '@/components/admin/auth/recovery';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Forgot Password',
};

export default function ForgotPasswordPage() {
  return (
    <PasswordRecoveryLayout>
      <RecoveryForm />
    </PasswordRecoveryLayout>
  );
}
