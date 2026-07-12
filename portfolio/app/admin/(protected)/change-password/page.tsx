import type { Metadata } from 'next';
import { ChangePasswordCard } from '@/components/admin/auth/change-password';

export const metadata: Metadata = {
  title: 'Change Password',
};

export default function ChangePasswordPage() {
  return (
    <div className="max-w-lg">
      <div className="mb-8">
        <h1 className="text-[var(--admin-text-page-title)] font-bold text-[var(--color-ink)] tracking-tight">
          Change password
        </h1>
        <p className="text-sm text-[var(--color-faint)] mt-1.5">
          Update your admin account password
        </p>
      </div>
      <ChangePasswordCard />
    </div>
  );
}
