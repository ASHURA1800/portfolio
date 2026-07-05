'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const NAV = [
  { href: '/admin',                label: 'Dashboard',       icon: '📊' },
  { href: '/admin/profile',        label: 'Profile',         icon: '👤' },
  { href: '/admin/projects',       label: 'Projects',        icon: '🚀' },
  { href: '/admin/skills',         label: 'Skills',          icon: '🛠️' },
  { href: '/admin/experience',     label: 'Experience',      icon: '💼' },
  { href: '/admin/certifications', label: 'Certifications',  icon: '🏆' },
  { href: '/admin/buildlog',       label: 'Build Log',       icon: '🧱' },
  { href: '/admin/learnings',      label: 'Learnings',       icon: '💡' },
  { href: '/admin/roadmap',        label: 'Roadmap',         icon: '🗺️' },
];

export default function AdminSidebar({ userEmail }: { userEmail: string }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <aside className="w-60 bg-gray-900 border-r border-white/8 flex flex-col py-6 px-3 min-h-screen">
      <div className="px-3 mb-8">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center text-white font-bold text-sm">A</div>
          <span className="text-white font-semibold text-sm">Portfolio Admin</span>
        </div>
        <p className="text-gray-600 text-xs mt-1 truncate">{userEmail}</p>
      </div>

      <nav className="flex-1 space-y-1">
        {NAV.map(({ href, label, icon }) => {
          const active = pathname === href || (href !== '/admin' && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                active
                  ? 'bg-violet-600/20 text-violet-300 font-medium'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>{icon}</span>
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 pt-4 border-t border-white/8">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
        >
          <span>🚪</span>
          Sign Out
        </button>
      </div>
    </aside>
  );
}
