"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const PARTICLE_COUNT_X = 200;
const PARTICLE_COUNT_Z = 100;
const SEPARATION = 3;

export default function DottedSurface() {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);
  const isVisibleRef = useRef(true);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene setup
    const scene = new THREE.Scene();

    // Low camera looking across the surface — gives that wide horizon look
    const camera = new THREE.PerspectiveCamera(55, width / height, 1, 10000);
    camera.position.set(0, 35, 180);
    camera.lookAt(0, 0, -50);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Particles
    const totalParticles = PARTICLE_COUNT_X * PARTICLE_COUNT_Z;
    const positions = new Float32Array(totalParticles * 3);
    const colors = new Float32Array(totalParticles * 3);

    // Neon purple: rgb(139, 92, 246) -> (0.545, 0.361, 0.965)
    // Neon cyan: rgb(6, 182, 212) -> (0.024, 0.714, 0.831)
    const purple = new THREE.Color(0.545, 0.361, 0.965);
    const cyan = new THREE.Color(0.024, 0.714, 0.831);

    let idx = 0;
    for (let ix = 0; ix < PARTICLE_COUNT_X; ix++) {
      for (let iz = 0; iz < PARTICLE_COUNT_Z; iz++) {
        const x = ix * SEPARATION - (PARTICLE_COUNT_X * SEPARATION) / 2;
        const z = iz * SEPARATION - (PARTICLE_COUNT_Z * SEPARATION) / 2;
        positions[idx * 3] = x;
        positions[idx * 3 + 1] = 0;
        positions[idx * 3 + 2] = z;

        // Gradient from purple to cyan based on x position
        const t = ix / PARTICLE_COUNT_X;
        const color = purple.clone().lerp(cyan, t);
        colors[idx * 3] = color.r;
        colors[idx * 3 + 1] = color.g;
        colors[idx * 3 + 2] = color.b;

        idx++;
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.7,
      vertexColors: true,
      transparent: true,
      opacity: 0.12,
      sizeAttenuation: true,
      depthWrite: false,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Resize handling with ResizeObserver
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: w, height: h } = entry.contentRect;
        if (w === 0 || h === 0) continue;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      }
    });
    resizeObserver.observe(container);

    // Visibility observer — pause rAF when off-screen
    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        const wasVisible = isVisibleRef.current;
        isVisibleRef.current = entry.isIntersecting;
        if (!wasVisible && entry.isIntersecting) {
          animationRef.current = requestAnimationFrame(animate);
        }
      },
      { threshold: 0 }
    );
    intersectionObserver.observe(container);

    // Animation
    const clock = new THREE.Clock();

    const animate = () => {
      if (!isVisibleRef.current) return;

      const elapsed = clock.getElapsedTime();
      const posAttr = geometry.getAttribute("position") as THREE.BufferAttribute;

      let i = 0;
      for (let ix = 0; ix < PARTICLE_COUNT_X; ix++) {
        for (let iz = 0; iz < PARTICLE_COUNT_Z; iz++) {
          const y =
            Math.sin(ix * 0.3 + elapsed * 0.8) * 4 +
            Math.sin(iz * 0.4 + elapsed * 0.6) * 4;
          posAttr.setY(i, y);
          i++;
        }
      }
      posAttr.needsUpdate = true;

      renderer.render(scene, camera);
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationRef.current);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute bottom-0 left-0 w-full h-[70%] pointer-events-none"
      aria-hidden="true"
    />
  );
}
