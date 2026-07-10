'use client';

import { Suspense, lazy } from 'react';
import { use3DCapable } from '@/hooks/use3DCapable';
import { HeroVisual } from '@/components/sections/HeroVisual';
import { WebGLErrorBoundary } from '@/components/sections/WebGLErrorBoundary';

// Lazy-loaded so the three.js/R3F bundle (several hundred KB) never ships
// to a device that's going to render the 2D fallback anyway.
const Hero3DScene = lazy(() =>
  import('@/components/sections/Hero3DScene').then((m) => ({ default: m.Hero3DScene })),
);

/**
 * Decides between the interactive 3D scene and the existing 2D HeroVisual:
 * - capable === null: still checking (first paint) — render the 2D visual
 *   immediately so there's never a blank hero, then swap up if capable.
 * - capable === false: reduced motion, low-end device signals, narrow
 *   viewport, or no WebGL — 2D visual, permanently.
 * - capable === true: attempt the 3D scene; a WebGLErrorBoundary still
 *   catches runtime failures (driver issues, context loss) and falls back.
 */
export function HeroVisualGate() {
  const capable = use3DCapable();

  if (capable !== true) return <HeroVisual />;

  return (
    <WebGLErrorBoundary fallback={<HeroVisual />}>
      <Suspense fallback={<HeroVisual />}>
        <div className="mx-auto aspect-square w-full max-w-[460px]">
          <Hero3DScene />
        </div>
      </Suspense>
    </WebGLErrorBoundary>
  );
}
