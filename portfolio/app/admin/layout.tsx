import type { Metadata } from 'next';

// The entire /admin subtree — including /admin/login — must never appear
// in search results or be followed by crawlers.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
