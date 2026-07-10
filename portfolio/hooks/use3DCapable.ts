'use client';

import { useEffect, useState } from 'react';

/**
 * Conservative capability check for whether to render the WebGL hero scene
 * at all. Errs toward the safe/cheap 2D fallback (HeroVisual) whenever
 * signals are ambiguous — a missed 3D scene costs nothing, a janky one
 * costs first impressions.
 */
export function use3DCapable(): boolean | null {
  // null = still deciding (avoids a flash of one variant then the other)
  const [capable, setCapable] = useState<boolean | null>(null);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setCapable(false);
      return;
    }

    // Narrow viewports: mobile GPUs + the visual is small anyway, not worth it.
    const narrow = window.matchMedia('(max-width: 1023px)').matches;
    if (narrow) {
      setCapable(false);
      return;
    }

    // Heuristic device signals — hardwareConcurrency/deviceMemory aren't
    // universally supported, so absence is treated as "unknown" (proceed),
    // not "fails". Only a confirmed low value disqualifies.
    const cores = navigator.hardwareConcurrency;
    if (typeof cores === 'number' && cores > 0 && cores < 4) {
      setCapable(false);
      return;
    }
    const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
    if (typeof memory === 'number' && memory > 0 && memory < 4) {
      setCapable(false);
      return;
    }

    // Actual WebGL2 support check — the hard requirement.
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
      if (!gl) {
        setCapable(false);
        return;
      }
    } catch {
      setCapable(false);
      return;
    }

    setCapable(true);
  }, []);

  return capable;
}
