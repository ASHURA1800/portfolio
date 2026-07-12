'use client';

import { useEffect, useState } from 'react';

/**
 * Tracks whether an element (by id) has scrolled past `threshold` pixels.
 * The admin shell's scroll container is `#main-content` (see
 * app/admin/(protected)/layout.tsx), not `window` — the page itself
 * never scrolls, only the <main> region does — so this can't use a
 * plain window scroll listener the way a marketing-page topbar would.
 */
export function useScrolled(targetId: string, threshold = 8): boolean {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const el = document.getElementById(targetId);
    if (!el) return;

    const onScroll = () => setScrolled(el.scrollTop > threshold);
    onScroll();

    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, [targetId, threshold]);

  return scrolled;
}
