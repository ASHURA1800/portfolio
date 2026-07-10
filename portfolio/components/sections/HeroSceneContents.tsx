'use client';

import { useMemo, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Float, PerformanceMonitor } from '@react-three/drei';
import * as THREE from 'three';

const PARTICLE_COUNT_HIGH = 260;
const PARTICLE_COUNT_LOW = 110;

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

/** Instanced point cloud drifting slowly around the cube — the "code particles". */
function ParticleField({ count }: { count: number }) {
  const pointsRef = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Distribute in a loose spherical shell, denser mid-radius (not a
      // hard sphere surface — reads more like scattered particles).
      const r = 2.4 + seededRandom(i * 1.7) * 2.2;
      const theta = seededRandom(i * 3.3 + 1) * Math.PI * 2;
      const phi = Math.acos(2 * seededRandom(i * 5.1 + 2) - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.6;
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, [count]);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y += delta * 0.035;
    pointsRef.current.rotation.x += delta * 0.008;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.045}
        color="#8C63FF"
        transparent
        opacity={0.65}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

/** The central floating wireframe cube, tilts gently toward the pointer. */
function FloatingCube({ pointer }: { pointer: React.RefObject<[number, number]> }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (!meshRef.current || !innerRef.current) return;
    const [px, py] = pointer.current ?? [0, 0];
    meshRef.current.rotation.y += delta * 0.15;
    meshRef.current.rotation.x = THREE.MathUtils.lerp(
      meshRef.current.rotation.x,
      py * 0.3,
      0.04,
    );
    meshRef.current.rotation.z = THREE.MathUtils.lerp(
      meshRef.current.rotation.z,
      -px * 0.15,
      0.04,
    );
    innerRef.current.rotation.y -= delta * 0.25;
    innerRef.current.rotation.x -= delta * 0.1;
  });

  return (
    <Float speed={1.4} rotationIntensity={0.3} floatIntensity={0.8}>
      <group>
        {/* Outer wireframe cube */}
        <mesh ref={meshRef}>
          <boxGeometry args={[1.6, 1.6, 1.6]} />
          <meshStandardMaterial
            color="#7C4DFF"
            wireframe
            transparent
            opacity={0.55}
            emissive="#7C4DFF"
            emissiveIntensity={0.3}
          />
        </mesh>
        {/* Inner solid glass-ish core, counter-rotating */}
        <mesh ref={innerRef} scale={0.55}>
          <icosahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color="#22C5F5"
            transparent
            opacity={0.35}
            emissive="#22C5F5"
            emissiveIntensity={0.5}
            roughness={0.35}
            metalness={0.15}
          />
        </mesh>
      </group>
    </Float>
  );
}

/** Subtle camera drift following the pointer, and a slow idle orbit. */
function CameraRig({ pointer }: { pointer: React.RefObject<[number, number]> }) {
  const { camera } = useThree();
  const t = useRef(0);

  useFrame((_, delta) => {
    t.current += delta;
    const [px, py] = pointer.current ?? [0, 0];
    const idleX = Math.sin(t.current * 0.15) * 0.3;
    const idleY = Math.cos(t.current * 0.12) * 0.15;
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, idleX + px * 0.6, 0.03);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, idleY - py * 0.4, 0.03);
    camera.lookAt(0, 0, 0);
  });

  return null;
}

export function HeroSceneContents({
  pointer,
}: {
  pointer: React.RefObject<[number, number]>;
}) {
  const [particleCount, setParticleCount] = useState(PARTICLE_COUNT_HIGH);

  return (
    <>
      {/* Adaptive quality: drop particle density under sustained frame-time
          pressure instead of the whole scene stuttering at a fixed cost. */}
      <PerformanceMonitor
        onDecline={() => setParticleCount(PARTICLE_COUNT_LOW)}
        onIncline={() => setParticleCount(PARTICLE_COUNT_HIGH)}
      />

      <ambientLight intensity={0.45} />
      <pointLight position={[4, 3, 4]} intensity={1.2} color="#8C63FF" />
      <pointLight position={[-4, -2, -3]} intensity={0.8} color="#22C5F5" />
      <pointLight position={[0, 4, -2]} intensity={0.4} color="#F7F8FA" />

      <CameraRig pointer={pointer} />
      <FloatingCube pointer={pointer} />
      <ParticleField count={particleCount} />
    </>
  );
}
