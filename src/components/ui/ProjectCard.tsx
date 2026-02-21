"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import type { Project } from "@/data/projects";
import { useRef } from "react";
import { GlowingEffect } from "@/components/ui/glowing-effect";

interface Props {
  project: Project;
  index: number;
  translatedDescription?: string;
}

const accentColors = [
  { from: "#8b5cf6", to: "#06b6d4" },
  { from: "#06b6d4", to: "#ec4899" },
  { from: "#ec4899", to: "#8b5cf6" },
];

export default function ProjectCard({ project, index, translatedDescription }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const accent = accentColors[index % accentColors.length];

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["6deg", "-6deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-6deg", "6deg"]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(px);
    y.set(py);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.7,
        delay: index * 0.2,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className="group relative w-full"
      style={{ perspective: "1000px" }}
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative h-full rounded-2xl"
      >
        <GlowingEffect spread={40} glow proximity={64} inactiveZone={0.01} borderWidth={3} disabled={false} />
        {/* Animated gradient border */}
        <div
          className="absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-[1px]"
          style={{
            background: `linear-gradient(135deg, ${accent.from}, ${accent.to}, ${accent.from})`,
            backgroundSize: "200% 200%",
            animation: "gradient-shift 3s ease infinite",
          }}
        />

        {/* Card body */}
        <div className="relative overflow-hidden rounded-2xl border border-border bg-surface/80 backdrop-blur-md h-full flex flex-col">
          {/* Top accent bar */}
          <div className="relative h-1 w-full overflow-hidden">
            <div
              className="absolute inset-0 opacity-60 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background: `linear-gradient(90deg, transparent, ${accent.from}, ${accent.to}, transparent)`,
              }}
            />
          </div>

          {/* Content */}
          <div className="relative z-10 p-7 md:p-9 flex flex-col flex-1">
            {/* Number + Title row */}
            <div className="flex items-start justify-between mb-5">
              <div className="flex items-baseline gap-3">
                <span
                  className="font-mono text-xs font-bold tracking-widest transition-colors duration-500"
                  style={{ color: accent.from }}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="text-xl md:text-2xl font-bold transition-colors duration-300 group-hover:text-white">
                  {project.title}
                </h3>
              </div>
              {/* Arrow icon */}
              <svg
                className="w-5 h-5 mt-1 text-text-muted opacity-0 -translate-x-2 -translate-y-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:text-white transition-all duration-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7v10" />
              </svg>
            </div>

            <p className="text-text-secondary text-sm md:text-base leading-relaxed mb-6 max-w-md">
              {translatedDescription ?? project.description}
            </p>

            {/* Spacer to push tags & links to bottom */}
            <div className="mt-auto">
              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-mono px-3 py-1.5 rounded-lg border border-border bg-background/60 text-text-secondary transition-all duration-300 group-hover:border-white/10 group-hover:bg-white/[0.03]"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Divider */}
              <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent mb-5 group-hover:via-white/10 transition-colors duration-500" />

              {/* Links */}
              <div className="flex gap-5">
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-mono text-text-secondary hover:text-neon-cyan transition-all duration-300 flex items-center gap-2 group/link"
                  >
                    <span className="w-8 h-8 rounded-lg bg-white/[0.03] border border-border flex items-center justify-center group-hover/link:border-neon-cyan/30 group-hover/link:bg-neon-cyan/[0.05] transition-all duration-300">
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                        />
                      </svg>
                    </span>
                    Live
                  </a>
                )}
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-mono text-text-secondary hover:text-neon-purple transition-all duration-300 flex items-center gap-2 group/link"
                  >
                    <span className="w-8 h-8 rounded-lg bg-white/[0.03] border border-border flex items-center justify-center group-hover/link:border-neon-purple/30 group-hover/link:bg-neon-purple/[0.05] transition-all duration-300">
                      <svg
                        className="w-3.5 h-3.5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                      </svg>
                    </span>
                    Code
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Hover glow orb */}
          <div
            className="absolute -bottom-20 -right-20 w-40 h-40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none blur-[60px]"
            style={{ background: accent.from }}
          />

          {/* Scan line on hover */}
          <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
            <div
              className="absolute left-0 w-full h-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: `linear-gradient(90deg, transparent, ${accent.from}40, transparent)`,
                animation: "scan 4s linear infinite",
              }}
            />
          </div>
        </div>
      </motion.div>
    </motion.article>
  );
}
