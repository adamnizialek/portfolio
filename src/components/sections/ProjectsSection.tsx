"use client";

import SectionHeading from "@/components/ui/SectionHeading";
import ProjectCard from "@/components/ui/ProjectCard";
import { projects } from "@/data/projects";

export default function ProjectsSection() {
  return (
    <section id="projects" className="relative py-28 md:py-36 lg:py-40">
      {/* Background accent */}
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-neon-cyan/[0.03] blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-8 sm:px-10 md:px-12 lg:px-16">
        <SectionHeading label="02 / Projekty" title="Moje prace" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 justify-items-center">
          {projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
