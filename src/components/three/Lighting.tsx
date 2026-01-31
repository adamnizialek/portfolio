"use client";

export default function Lighting() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} color="#ffffff" />
      <pointLight position={[-4, 3, 4]} intensity={1.2} color="#8b5cf6" distance={12} />
      <pointLight position={[4, -2, 3]} intensity={0.8} color="#06b6d4" distance={10} />
      <pointLight position={[0, 4, -3]} intensity={0.4} color="#ec4899" distance={8} />
    </>
  );
}
