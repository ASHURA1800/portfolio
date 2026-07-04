import type { Profile, Social } from '@/types';

// Social links derived from a Profile — single source of truth, no duplicated
// rows. Only links with a non-empty value are returned, so the UI never renders
// an empty/broken social icon. Pure function (no data import) so it's safe in
// both server and client components.
export function getSocials(p: Profile): Social[] {
  const all: Social[] = [
    { platform: 'github', label: 'GitHub', href: p.github, icon: 'Github' },
    { platform: 'linkedin', label: 'LinkedIn', href: p.linkedin, icon: 'Linkedin' },
    { platform: 'twitter', label: 'Twitter', href: p.twitter, icon: 'Twitter' },
    { platform: 'website', label: 'Website', href: p.website, icon: 'Globe' },
    {
      platform: 'email',
      label: 'Email',
      href: p.email ? `mailto:${p.email}` : '',
      icon: 'Mail',
    },
  ];
  return all.filter((s) => s.href.trim() !== '');
}
