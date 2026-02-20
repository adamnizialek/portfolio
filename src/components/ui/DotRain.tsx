"use client";

import { useEffect, useRef } from "react";

const PARTICLE_COUNT = 120;

interface Particle {
  x: number;
  y: number;
  speed: number;
  size: number;
  opacity: number;
  color: [number, number, number];
}

export default function DotRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = container.clientWidth;
    let height = container.clientHeight;
    canvas.width = width;
    canvas.height = height;

    // Neon purple: rgb(139, 92, 246)
    // Neon cyan: rgb(6, 182, 212)
    const purple: [number, number, number] = [139, 92, 246];
    const cyan: [number, number, number] = [6, 182, 212];

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const createParticle = (startAtTop: boolean): Particle => {
      const t = Math.random();
      return {
        x: Math.random() * width,
        y: startAtTop ? -Math.random() * height * 0.3 : Math.random() * height,
        speed: 0.3 + Math.random() * 0.7,
        size: 1.3 + Math.random() * 1.7,
        opacity: 0.1 + Math.random() * 0.16,
        color: [
          lerp(purple[0], cyan[0], t),
          lerp(purple[1], cyan[1], t),
          lerp(purple[2], cyan[2], t),
        ],
      };
    };

    const particles: Particle[] = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(createParticle(false));
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      for (const p of particles) {
        p.y += p.speed;

        // Fade out near the bottom
        const fadeZone = height * 0.7;
        const fadeFactor = p.y > fadeZone ? 1 - (p.y - fadeZone) / (height - fadeZone) : 1;

        if (p.y > height) {
          Object.assign(p, createParticle(true));
          continue;
        }

        const half = p.size;
        ctx.fillStyle = `rgba(${p.color[0]}, ${p.color[1]}, ${p.color[2]}, ${p.opacity * Math.max(fadeFactor, 0)})`;
        ctx.fillRect(p.x - half, p.y - half, half * 2, half * 2);
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: w, height: h } = entry.contentRect;
        if (w === 0 || h === 0) continue;
        width = w;
        height = h;
        canvas.width = w;
        canvas.height = h;
      }
    });
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(animationRef.current);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}
