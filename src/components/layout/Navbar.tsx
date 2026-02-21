"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/lib/LanguageContext";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { locale, setLocale, t } = useLanguage();

  const navLinks = [
    { label: t.nav.home, href: "#hero" },
    { label: t.nav.about, href: "#about" },
    { label: t.nav.projects, href: "#projects" },
    { label: t.nav.contact, href: "#contact" },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  const toggleLocale = () => setLocale(locale === "pl" ? "en" : "pl");

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-background/80 backdrop-blur-xl border-b border-border/50"
            : "bg-transparent"
        }`}
      >
        <div className="w-full h-16 md:h-20 flex items-center justify-between px-5 sm:px-8 md:px-12">
          {/* Logo */}
          <button
            onClick={() => handleClick("#hero")}
            className="text-lg font-bold tracking-tight cursor-pointer"
          >
            <span className="gradient-text">A</span>
            <span className="text-text-primary">dam</span>
            <span className="text-neon-purple">.</span>
          </button>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            <ul className="flex items-center gap-8">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <button
                    onClick={() => handleClick(link.href)}
                    className="text-sm font-mono text-text-secondary hover:text-neon-cyan transition-colors duration-300 cursor-pointer tracking-wide"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
            <button
              onClick={toggleLocale}
              className="flex items-center gap-1 text-xs font-mono px-3 py-1.5 rounded-lg border border-border/50 hover:border-neon-cyan/30 transition-all duration-300 cursor-pointer tracking-wide"
              aria-label="Toggle language"
            >
              <span className={locale === "en" ? "text-neon-cyan" : "text-text-muted"}>EN</span>
              <span className="text-text-muted/40">/</span>
              <span className={locale === "pl" ? "text-neon-cyan" : "text-text-muted"}>PL</span>
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden relative w-8 h-8 flex flex-col justify-center items-center gap-1.5 cursor-pointer"
            aria-label="Menu"
          >
            <span
              className={`w-6 h-[2px] bg-text-primary transition-all duration-300 ${
                mobileOpen ? "rotate-45 translate-y-[5px]" : ""
              }`}
            />
            <span
              className={`w-6 h-[2px] bg-text-primary transition-all duration-300 ${
                mobileOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`w-6 h-[2px] bg-text-primary transition-all duration-300 ${
                mobileOpen ? "-rotate-45 -translate-y-[5px]" : ""
              }`}
            />
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu — outside motion.nav to avoid transform containment */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="md:hidden fixed inset-0 top-16 z-50 bg-background/95 backdrop-blur-xl border-b border-border/50 overflow-hidden"
          >
            <ul className="px-8 py-8 flex flex-col gap-5">
              {navLinks.map((link, i) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <button
                    onClick={() => handleClick(link.href)}
                    className="text-lg font-mono text-text-secondary hover:text-neon-cyan transition-colors cursor-pointer"
                  >
                    <span className="text-neon-purple mr-2">0{i + 1}.</span>
                    {link.label}
                  </button>
                </motion.li>
              ))}
              <motion.li
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: navLinks.length * 0.08 }}
              >
                <button
                  onClick={toggleLocale}
                  className="flex items-center gap-2 text-lg font-mono cursor-pointer"
                >
                  <span className={locale === "en" ? "text-neon-cyan" : "text-text-muted"}>EN</span>
                  <span className="text-text-muted/40">/</span>
                  <span className={locale === "pl" ? "text-neon-cyan" : "text-text-muted"}>PL</span>
                </button>
              </motion.li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
