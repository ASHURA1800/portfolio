import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { getProfile } from "@/lib/content";
import { ThemeProvider, themeInitScript } from "@/components/providers/ThemeProvider";
import { SiteChrome } from "@/components/providers/SiteChrome";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// Set NEXT_PUBLIC_SITE_URL to your real domain in production — it feeds every
// canonical/OG URL. Falls back to localhost so no fake public domain is ever
// stamped into metadata before you've set it.
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

// Metadata is derived from the DB-backed profile. When fields are empty, neutral
// fallbacks keep the site valid without inventing a persona. Async so an admin
// edit to the profile updates SEO metadata too (ISR-cached).
export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile();
  const displayName = profile.name || "Portfolio";
  const headline = profile.title ? `${displayName} — ${profile.title}` : displayName;
  const summary = profile.bio || `${displayName} — projects and writing.`;
  const handle = profile.username ? `@${profile.username}` : undefined;

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: headline,
      template: `%s | ${displayName}`,
    },
    description: summary,
    keywords: ["Developer", "Engineer", "Next.js", "React", "TypeScript"],
    authors: profile.name ? [{ name: profile.name }] : undefined,
    creator: profile.name || undefined,
    alternates: {
      canonical: SITE_URL,
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: SITE_URL,
      siteName: `${displayName} Portfolio`,
      title: headline,
      description: summary,
    },
    twitter: {
      card: "summary_large_image",
      title: headline,
      description: summary,
      creator: handle,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#08090D",
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        {/* Runs before hydration to avoid a flash of the wrong theme. */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="font-sans antialiased bg-bg text-ink">
        <ThemeProvider>
          <SiteChrome>{children}</SiteChrome>
        </ThemeProvider>
      </body>
    </html>
  );
}
