"use client";

import { useRef, useSyncExternalStore } from "react";
import { useGLTF, Float } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const subscribe = (cb: () => void) => {
  window.addEventListener("resize", cb);
  return () => window.removeEventListener("resize", cb);
};
const getWindowHeight = () => window.innerHeight;

export default function AvatarModel() {
  const { scene } = useGLTF("/models/avatar.glb");
  const groupRef = useRef<THREE.Group>(null);
  const { viewport } = useThree();
  const windowHeight = useSyncExternalStore(subscribe, getWindowHeight, () => 800);

  const isMobile = viewport.width < 6;
  const isShortMobile = isMobile && windowHeight < 700;
  const scale = isShortMobile ? 1.2 : isMobile ? 1.4 : 2;
  const posX = isMobile ? 0 : 2;
  const posY = isShortMobile ? -1.8 : isMobile ? -1.5 : -1.2;

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
