"use client";

import dynamic from "next/dynamic";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import ContactSection from "@/components/sections/ContactSection";

const CursorGlow = dynamic(() => import("@/components/ui/CursorGlow"), { ssr: false });

export default function Home() {
  return (
    <main>
      <CursorGlow />
      <Navbar />
      <HeroSection />
      <div className="divider-glow mx-8 sm:mx-10 md:mx-12 lg:mx-16" />
      <AboutSection />
      <div className="divider-glow mx-8 sm:mx-10 md:mx-12 lg:mx-16" />
      <ProjectsSection />
      <div className="divider-glow mx-8 sm:mx-10 md:mx-12 lg:mx-16" />
      <ContactSection />
      <Footer />
    </main>
  );
}
