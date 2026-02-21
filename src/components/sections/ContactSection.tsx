"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import AnimatedSection from "@/components/ui/AnimatedSection";
import GradientButton from "@/components/ui/GradientButton";
import { SOCIAL_LINKS } from "@/lib/constants";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { useLanguage } from "@/lib/LanguageContext";

const DotRain = dynamic(() => import("@/components/ui/DotRain"), { ssr: false });

export default function ContactSection() {
  const { t } = useLanguage();
  return (
    <section id="contact" className="relative py-28 md:py-36 lg:py-40 overflow-hidden">
      <DotRain />
      {/* Background accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-neon-purple/[0.04] blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-5 sm:px-10 md:px-12 lg:px-16">
        <SectionHeading label={t.contact.label} title={t.contact.title} />

        <AnimatedSection className="max-w-3xl mx-auto text-center">
          <p className="text-lg md:text-xl text-text-secondary leading-relaxed mb-10">
            {t.contact.body}
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <GradientButton href={SOCIAL_LINKS.email} variant="filled">
              {t.contact.email_button}
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
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </GradientButton>
            <GradientButton href={SOCIAL_LINKS.linkedin} variant="outline" target="_blank">
              LinkedIn
            </GradientButton>
          </div>

          {/* Contact details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              {
                label: "Email",
                value: "adam.nizialek1@gmail.com",
                href: SOCIAL_LINKS.email,
              },
              {
                label: "GitHub",
                value: "github.com/adamnizialek",
                href: SOCIAL_LINKS.github,
              },
              {
                label: "LinkedIn",
                value: "linkedin.com/in/adam-nizialek",
                href: SOCIAL_LINKS.linkedin,
              },
            ].map((item, i) => (
              <motion.a
                key={item.label}
                href={item.href}
                target={item.href.startsWith("mailto:") ? undefined : "_blank"}
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * i, duration: 0.5 }}
                className="relative group p-5 rounded-xl border border-border bg-surface/30 hover:border-neon-purple/30 transition-all duration-300"
              >
                <GlowingEffect spread={40} glow proximity={64} inactiveZone={0.01} borderWidth={3} disabled={false} />
                <p className="text-xs font-mono text-text-muted uppercase tracking-[0.2em] mb-2">
                  {item.label}
                </p>
                <p className="text-xs sm:text-sm text-text-secondary group-hover:text-neon-cyan transition-colors duration-300 truncate">
                  {item.value}
                </p>
              </motion.a>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
