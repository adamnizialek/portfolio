"use client";

import { useEffect, useRef } from "react";

export default function CursorGlow() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const points = useRef<{ x: number; y: number; age: number }[]>([]);
  const mouse = useRef({ x: -100, y: -100 });
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const onMouseMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      points.current.push({ x: e.clientX, y: e.clientY, age: 0 });
      if (points.current.length > 50) {
        points.current.shift();
      }
    };
    window.addEventListener("mousemove", onMouseMove);

    const maxAge = 40;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw trail points
      for (let i = 0; i < points.current.length; i++) {
        const p = points.current[i];
        p.age++;
        const life = 1 - p.age / maxAge;
        if (life <= 0) continue;

        const radius = 60 * life;
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, radius);
        gradient.addColorStop(0, `rgba(139, 92, 246, ${0.12 * life})`);
        gradient.addColorStop(0.5, `rgba(6, 182, 212, ${0.06 * life})`);
        gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Remove dead points
      points.current = points.current.filter((p) => p.age < maxAge);

      // Main cursor glow
      const mx = mouse.current.x;
      const my = mouse.current.y;
      const mainGradient = ctx.createRadialGradient(mx, my, 0, mx, my, 120);
      mainGradient.addColorStop(0, "rgba(139, 92, 246, 0.15)");
      mainGradient.addColorStop(0.4, "rgba(6, 182, 212, 0.06)");
      mainGradient.addColorStop(1, "rgba(0, 0, 0, 0)");

      ctx.fillStyle = mainGradient;
      ctx.beginPath();
      ctx.arc(mx, my, 120, 0, Math.PI * 2);
      ctx.fill();

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-40 pointer-events-none"
      aria-hidden="true"
    />
  );
}
