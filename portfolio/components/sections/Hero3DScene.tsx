'use client';

import { Suspense, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { HeroSceneContents } from '@/components/sections/HeroSceneContents';

/**
 * Renders the interactive 3D hero scene inside a fixed-size Canvas.
 * - dpr capped at [1, 1.75] — full device pixel ratio on retina displays
 *   costs real frame time for negligible visible gain at this element size.
 * - frameloop="always" because the camera/particles/cube are continuously
 *   animating; "demand" would just re-trigger every frame anyway here.
 * - Suspense fallback is null: Environment's HDRI loads fast and the cube
 *   underneath renders immediately, so a spinner would just flash.
 */
export function Hero3DScene() {
  const pointer = useRef<[number, number]>([0, 0]);

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    pointer.current = [
      ((e.clientX - rect.left) / rect.width - 0.5) * 2,
      ((e.clientY - rect.top) / rect.height - 0.5) * 2,
    ];
  };

  const onPointerLeave = () => {
    pointer.current = [0, 0];
  };

  return (
    <div
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className="h-full w-full"
      aria-hidden="true"
    >
      <Canvas
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        camera={{ position: [0, 0, 6], fov: 42 }}
        frameloop="always"
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
        }}
      >
        <Suspense fallback={null}>
          <HeroSceneContents pointer={pointer} />
        </Suspense>
      </Canvas>
    </div>
  );
}
