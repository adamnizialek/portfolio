"use client";

import { motion } from "framer-motion";
import type { Project } from "@/data/projects";

interface Props {
  project: Project;
  index: number;
}

export default function ProjectCard({ project, index }: Props) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.6,
        delay: index * 0.15,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className="group relative"
    >
      <div className="relative overflow-hidden rounded-2xl border border-border bg-surface/60 backdrop-blur-sm p-7 md:p-9 transition-all duration-500 hover:border-neon-purple/40 hover:shadow-[0_0_40px_rgba(139,92,246,0.08)] scan-line h-full">
        {/* Number */}
        <span className="font-mono text-[5rem] md:text-[7rem] font-bold absolute -top-4 -right-2 text-surface-light/80 select-none leading-none transition-colors duration-500 group-hover:text-neon-purple/10">
          {String(index + 1).padStart(2, "0")}
        </span>

        {/* Content */}
        <div className="relative z-10">
          <h3 className="text-xl md:text-2xl font-bold mb-4 transition-colors duration-300 group-hover:text-neon-cyan">
            {project.title}
          </h3>

          <p className="text-text-secondary text-sm md:text-base leading-relaxed mb-6 max-w-md">
            {project.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs font-mono px-3 py-1 rounded-full border border-border bg-background/50 text-text-secondary transition-colors duration-300 group-hover:border-neon-purple/30 group-hover:text-neon-purple"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Links */}
          <div className="flex gap-4">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-mono text-text-secondary hover:text-neon-cyan transition-colors duration-300 flex items-center gap-1.5"
              >
                <svg
                  className="w-4 h-4"
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
                Live
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-mono text-text-secondary hover:text-neon-purple transition-colors duration-300 flex items-center gap-1.5"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                </svg>
                Code
              </a>
            )}
          </div>
        </div>

        {/* Hover gradient accent */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none bg-gradient-to-br from-neon-purple/[0.03] via-transparent to-neon-cyan/[0.03]" />
      </div>
    </motion.article>
  );
}
