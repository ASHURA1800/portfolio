import type { Metadata } from 'next';
import './admin-theme.css';
import { ToastProvider } from '@/components/admin/ui/Toast';

// The entire /admin subtree — including /admin/login — must never appear
// in search results or be followed by crawlers.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <ToastProvider>{children}</ToastProvider>;
}
