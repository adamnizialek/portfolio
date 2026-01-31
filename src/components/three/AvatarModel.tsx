"use client";

import { useRef } from "react";
import { useGLTF, Float } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

export default function AvatarModel() {
  const { scene } = useGLTF("/models/avatar.glb");
  const groupRef = useRef<THREE.Group>(null);
  const { viewport } = useThree();

  const isMobile = viewport.width < 6;
  const scale = isMobile ? 1.4 : 2;
  const posX = isMobile ? 0 : 2;
  const posY = isMobile ? -1.8 : -1.2;

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.12;
    }
  });

  return (
    <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.4}>
      <group ref={groupRef} position={[posX, posY, 0]} scale={scale}>
        <primitive object={scene} />
      </group>
    </Float>
  );
}

useGLTF.preload("/models/avatar.glb");
