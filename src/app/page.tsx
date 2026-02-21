"use client";

import dynamic from "next/dynamic";
import { LazyMotion, domAnimation } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import { LanguageProvider } from "@/lib/LanguageContext";

const AboutSection = dynamic(() => import("@/components/sections/AboutSection"));
const ProjectsSection = dynamic(() => import("@/components/sections/ProjectsSection"));
const ContactSection = dynamic(() => import("@/components/sections/ContactSection"));
const CursorGlow = dynamic(() => import("@/components/ui/CursorGlow"), { ssr: false });

export default function Home() {
  return (
    <LanguageProvider>
      <LazyMotion features={domAnimation} strict>
        <main className="overflow-x-hidden">
          <CursorGlow />
          <Navbar />
          <HeroSection />
          <div className="divider-glow mx-5 sm:mx-10 md:mx-12 lg:mx-16" />
          <AboutSection />
          <div className="divider-glow mx-5 sm:mx-10 md:mx-12 lg:mx-16" />
          <ProjectsSection />
          <div className="divider-glow mx-5 sm:mx-10 md:mx-12 lg:mx-16" />
          <ContactSection />
          <Footer />
        </main>
      </LazyMotion>
    </LanguageProvider>
  );
}
