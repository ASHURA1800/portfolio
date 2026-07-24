/**
 * theme-tokens.ts
 *
 * Single source of truth for design-token VALUES in contexts that cannot
 * read CSS custom properties: next/og ImageResponse (edge runtime, no DOM),
 * generateMetadata / manifest.ts (server, no CSS pipeline), and
 * app/global-error.tsx (must render if the root layout — and therefore
 * globals.css — itself failed to load).
 *
 * These are literal duplicates of the dark-theme values in app/globals.css
 * @theme, not derived from it — CSS and JS have no shared runtime, so a
 * true single source isn't possible across that boundary. Keep this file
 * as the ONLY place those literals live on the JS side; every consumer
 * below imports from here rather than inlining its own hex.
 *
 * If you change a color in app/globals.css @theme, update the matching
 * value here too.
 */

export const themeTokens = {
  colorBg: '#08090D',
  colorInk: '#F7F8FA',
  colorMuted: '#A0A6B5',
  colorAccent600: '#6633EE',
  colorSuccess: '#2ED573',
  colorError: '#FF5C71',
  colorErrorBgRgba: 'rgba(255, 92, 113, 0.1)',
  colorErrorBorderRgba: 'rgba(255, 92, 113, 0.3)',
  ogGlow1Rgba: 'rgba(124,77,255,0.35)',
  ogGlow2Rgba: 'rgba(34,197,245,0.22)',
} as const;
