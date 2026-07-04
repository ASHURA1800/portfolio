import type { Metadata, Viewport } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import { getProfile } from "@/lib/content";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-instrument-serif",
  weight: "400", // Instrument Serif ships a single weight
  style: ["normal", "italic"],
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
  themeColor: "#faf8f5",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${instrumentSerif.variable}`}>
      <body className="font-sans antialiased bg-bg text-ink">
        {children}
      </body>
    </html>
  );
}
