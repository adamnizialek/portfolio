"use client";

import AnimatedSection from "@/components/ui/AnimatedSection";
import SectionHeading from "@/components/ui/SectionHeading";
import { skills } from "@/data/skills";

export default function AboutSection() {
  const categories = ["frontend", "backend", "tools"] as const;
  const categoryLabels = {
    frontend: "Frontend",
    backend: "Backend",
    tools: "Narzędzia",
  };

  return (
    <section id="about" className="relative py-28 md:py-36 lg:py-40">
      {/* Background accent */}
      <div className="absolute top-0 right-0 w-[300px] h-[300px] rounded-full bg-neon-purple/[0.04] blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-5 sm:px-10 md:px-12 lg:px-16">
        <SectionHeading label="01 / O mnie" title="Kim jestem" />

        {/* Bio - centered */}
        <AnimatedSection className="max-w-3xl mx-auto text-center space-y-6 mb-16">
          <p className="text-lg md:text-xl text-text-secondary leading-relaxed">
            Cześć! Jestem{" "}
            <span className="text-text-primary font-semibold">Adam</span> —
            programista z pasją do tworzenia nowoczesnych aplikacji webowych.
            Specjalizuję się w budowaniu interaktywnych interfejsów
            użytkownika i solidnych systemów backendowych.
          </p>
          <p className="text-base text-text-muted leading-relaxed">
            Wierzę, że najlepszy kod to taki, który jest jednocześnie wydajny
            i elegancki. Każdy projekt traktuję jako okazję do nauki i
            rozwiązywania realnych problemów. Kiedy nie koduję, rozwijam swoje
            umiejętności w nowych technologiach i frameworkach.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 sm:gap-6 pt-8 mt-2 border-t border-border/30">
            {[
              { value: "2+", label: "Lata doświadczenia" },
              { value: "10+", label: "Projekty" },
              { value: "5+", label: "Technologii" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl md:text-3xl font-bold gradient-text">
                  {stat.value}
                </p>
                <p className="text-xs font-mono text-text-muted mt-1 uppercase tracking-wider">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </AnimatedSection>

        {/* Skills - centered grid */}
        <AnimatedSection delay={0.2}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-10 max-w-3xl mx-auto">
            {categories.map((category) => (
              <div key={category} className="text-center">
                <h3 className="text-xs font-mono text-neon-cyan tracking-[0.25em] uppercase mb-4">
                  {categoryLabels[category]}
                </h3>
                <div className="flex flex-wrap justify-center gap-2">
                  {skills
                    .filter((s) => s.category === category)
                    .map((skill) => (
                      <span
                        key={skill.name}
                        className="px-3 py-1.5 text-sm font-mono rounded-lg border border-border bg-surface/50 text-text-secondary hover:border-neon-purple/40 hover:text-neon-purple transition-all duration-300 cursor-default"
                      >
                        {skill.name}
                      </span>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
