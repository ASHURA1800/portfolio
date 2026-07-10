'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Music2 } from 'lucide-react';

interface NowPlayingData {
  isPlaying: boolean;
  title: string;
  artist: string;
  url?: string;
}

/**
 * Polls an optional `/api/now-playing` route (not wired up yet — this
 * project has no Spotify OAuth/token storage). Renders nothing if the
 * route 404s, so it's safe to ship even before that backend exists; add
 * an endpoint returning NowPlayingData and this lights up automatically.
 */
export function NowPlaying() {
  const [data, setData] = useState<NowPlayingData | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/now-playing')
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (!cancelled) setData(json);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setChecked(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!checked || !data || !data.isPlaying) return null;

  const content = (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-subtle flex items-center gap-3 rounded-full py-2 pl-2 pr-4"
    >
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent-500/15 text-accent-300">
        <motion.span
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Music2 size={13} />
        </motion.span>
      </span>
      <div className="min-w-0">
        <p className="truncate text-xs font-medium text-ink">{data.title}</p>
        <p className="truncate text-[11px] text-faint">{data.artist}</p>
      </div>
    </motion.div>
  );

  return (
    <AnimatePresence>
      {data.url ? (
        <a href={data.url} target="_blank" rel="noopener noreferrer" aria-label={`Now playing: ${data.title} by ${data.artist}`}>
          {content}
        </a>
      ) : (
        content
      )}
    </AnimatePresence>
  );
}
