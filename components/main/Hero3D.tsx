'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Stars } from '@react-three/drei';
import { useRef, useState } from 'react';
// @ts-ignore
import * as random from 'maath/random/dist/maath-random.esm';

const Hero3D = () => {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas camera={{ position: [0, 0, 1] }}>
        <Stars />
        <Globe />
      </Canvas>
    </div>
  );
};

const Globe = () => {
  const ref = useRef<any>();

  useFrame((state, delta) => {
    ref.current.rotation.y += delta / 5;
  });

  return (
    <group ref={ref}>
      <mesh>
        <sphereGeometry args={[0.5, 64, 64]} />
        <meshStandardMaterial color="#0EA5E9" wireframe />
      </mesh>
      <Rings />
    </group>
  );
}

const Rings = () => {
  const items = [...Array(3)].map((_, i) => {
    const r = 0.6 + i * 0.15;
    return (
      <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[0,0,0]}>
        <ringGeometry args={[r, r + 0.01, 64]} />
        <meshBasicMaterial color="#0EA5E9" transparent opacity={0.5} />
      </mesh>
    )
  });

  return <>{items}</>;
}

export default Hero3D;
