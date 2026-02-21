"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import AnimatedSection from "@/components/ui/AnimatedSection";
import SectionHeading from "@/components/ui/SectionHeading";
import { skills } from "@/data/skills";
import { GlowingEffect } from "@/components/ui/glowing-effect";

const ShaderBackground = dynamic(() => import("@/components/ui/ShaderBackground"), { ssr: false });

const categoryAccents = {
  frontend: { color: "#06b6d4" },
  backend: { color: "#8b5cf6" },
  tools: { color: "#ec4899" },
} as const;

export default function AboutSection() {
  const categories = ["frontend", "backend", "tools"] as const;
  const categoryLabels = {
    frontend: "Frontend",
    backend: "Backend",
    tools: "Narzędzia",
  };

  return (
    <section id="about" className="relative py-28 md:py-36 lg:py-40 overflow-hidden">
      <ShaderBackground />
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
              { value: "5+", label: "Projekty" },
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

        {/* Skills */}
        <AnimatedSection delay={0.2}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-3xl mx-auto">
            {categories.map((category) => {
              const accent = categoryAccents[category];
              return (
                <div
                  key={category}
                  className="relative group rounded-2xl border border-border/50 bg-surface/40 backdrop-blur-sm p-6 hover:border-white/10 transition-all duration-500"
                >
                  <GlowingEffect spread={40} glow proximity={64} inactiveZone={0.01} borderWidth={3} disabled={false} />
                  {/* Glow on hover */}
                  <div
                    className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-[1px] -z-10"
                    style={{ background: `linear-gradient(135deg, ${accent.color}30, transparent, ${accent.color}20)` }}
                  />

                  <h3
                    className="text-xs font-mono tracking-[0.25em] uppercase mb-5 text-center"
                    style={{ color: accent.color }}
                  >
                    {categoryLabels[category]}
                  </h3>
                  <div className="flex flex-wrap justify-center gap-2">
                    {skills
                      .filter((s) => s.category === category)
                      .map((skill, i) => (
                        <motion.span
                          key={skill.name}
                          initial={{ opacity: 0, scale: 0.8 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.05, duration: 0.3 }}
                          whileHover={{ scale: 1.08, y: -2 }}
                          className="px-3.5 py-2 text-sm font-mono rounded-xl border bg-background/60 text-text-secondary transition-all duration-300 cursor-default"
                          style={{
                            borderColor: `${accent.color}20`,
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = `${accent.color}60`;
                            e.currentTarget.style.color = accent.color;
                            e.currentTarget.style.boxShadow = `0 0 20px ${accent.color}15`;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = `${accent.color}20`;
                            e.currentTarget.style.color = '';
                            e.currentTarget.style.boxShadow = 'none';
                          }}
                        >
                          {skill.name}
                        </motion.span>
                      ))}
                  </div>
                </div>
              );
            })}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
