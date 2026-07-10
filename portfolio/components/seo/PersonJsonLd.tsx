import type { Profile, Social } from '@/types';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

/**
 * Renders Person + WebSite JSON-LD from real profile/social data only —
 * never fabricates fields the CMS doesn't have populated. Fields with
 * empty values are simply omitted from the graph rather than stubbed.
 */
export function PersonJsonLd({ profile, socials }: { profile: Profile; socials: Social[] }) {
  const name = profile.name || profile.username;
  if (!name) return null;

  const sameAs = socials
    .filter((s) => s.platform !== 'email' && s.href)
    .map((s) => s.href);

  const person: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name,
    url: SITE_URL,
  };
  if (profile.title) person.jobTitle = profile.title;
  if (profile.bio) person.description = profile.bio;
  if (profile.location) person.address = { '@type': 'PostalAddress', addressLocality: profile.location };
  if (profile.avatar) person.image = profile.avatar;
  if (sameAs.length > 0) person.sameAs = sameAs;

  const website = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: `${name} — Portfolio`,
    url: SITE_URL,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }} />
    </>
  );
}
