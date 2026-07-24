import type { MetadataRoute } from 'next';
import { getProfile } from '@/lib/content';
import { themeTokens } from '@/lib/theme-tokens';

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const profile = await getProfile();
  const name = profile.name || profile.username || 'Portfolio';

  return {
    name: `${name} — Portfolio`,
    short_name: name,
    description: profile.bio || `${name}'s portfolio`,
    start_url: '/',
    display: 'standalone',
    background_color: themeTokens.colorBg,
    theme_color: themeTokens.colorBg,
    // Only a 16/32px favicon.ico exists in this project — a real installable
    // PWA icon set (192x192 and 512x512 PNGs, ideally maskable) would need
    // to be generated from real brand assets and added to /public.
    icons: [
      {
        src: '/favicon.ico',
        sizes: '32x32',
        type: 'image/x-icon',
      },
    ],
  };
}
