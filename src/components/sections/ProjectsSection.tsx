"use client";

import dynamic from "next/dynamic";
import SectionHeading from "@/components/ui/SectionHeading";
import ProjectCard from "@/components/ui/ProjectCard";
import { projects } from "@/data/projects";
import { useLanguage } from "@/lib/LanguageContext";

const DottedSurface = dynamic(() => import("@/components/ui/DottedSurface"), { ssr: false });

export default function ProjectsSection() {
  const { t } = useLanguage();
  return (
    <section id="projects" className="relative py-28 md:py-36 lg:py-40 overflow-hidden">
      <DottedSurface />
      {/* Background accents */}
      <div className="absolute top-1/4 left-0 w-[500px] h-[500px] rounded-full bg-neon-purple/[0.03] blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-neon-cyan/[0.03] blur-[120px] pointer-events-none" />

      {/* Horizontal grid lines */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
        <div className="absolute top-1/4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-purple to-transparent" />
        <div className="absolute top-3/4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-cyan to-transparent" />
      </div>

      <div className="max-w-6xl mx-auto px-8 sm:px-10 md:px-12 lg:px-16 relative z-10">
        <SectionHeading label={t.projects.label} title={t.projects.title} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 justify-items-center">
          {projects.map((project, i) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={i}
              translatedDescription={t.project_descriptions[project.id as keyof typeof t.project_descriptions]}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
