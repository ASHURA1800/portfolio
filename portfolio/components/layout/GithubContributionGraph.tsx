'use client';

import { useState } from 'react';
import { motion } from 'motion/react';

/**
 * Renders a GitHub contribution graph via a public, keyless chart service
 * (ghchart.rzero.dev renders directly from a username, no API token needed).
 * Hides itself cleanly if the image fails to load rather than showing a
 * broken-image icon.
 */
export function GithubContributionGraph({ username }: { username: string }) {
  const [failed, setFailed] = useState(false);
  if (!username || failed) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="glass-subtle rounded-xl p-3"
    >
      <p className="mb-2 px-1 text-[10px] font-medium uppercase tracking-wider text-faint">
        Contribution activity
      </p>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://ghchart.rzero.dev/${encodeURIComponent(username)}`}
        alt={`${username}'s GitHub contribution graph`}
        loading="lazy"
        onError={() => setFailed(true)}
        className="w-full opacity-90 [filter:invert(0.9)_hue-rotate(180deg)_saturate(1.4)]"
      />
    </motion.div>
  );
}
