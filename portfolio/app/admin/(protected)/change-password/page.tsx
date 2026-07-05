import type { Metadata } from 'next';
import { ChangePasswordForm } from './ChangePasswordForm';

export const metadata: Metadata = {
  title: 'Change Password',
};

export default function ChangePasswordPage() {
  return (
    <div className="max-w-md">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Change Password</h1>
        <p className="text-gray-500 text-sm mt-1">Update your admin account password</p>
      </div>
      <ChangePasswordForm />
    </div>
  );
}
