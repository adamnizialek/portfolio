"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { Preload } from "@react-three/drei";
import AvatarModel from "./AvatarModel";
import Lighting from "./Lighting";

export default function Scene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 42 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
    >
      <Suspense fallback={null}>
        <Lighting />
        <AvatarModel />
        <Preload all />
      </Suspense>
    </Canvas>
  );
}
