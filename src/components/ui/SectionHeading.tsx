"use client";

import { m } from "framer-motion";

interface Props {
  label: string;
  title: string;
}

export default function SectionHeading({ label, title }: Props) {
  return (
    <m.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="mb-14 md:mb-16 lg:mb-20 text-center"
    >
      <span className="font-mono text-sm tracking-[0.3em] uppercase text-neon-cyan mb-4 block">
        {label}
      </span>
      <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
        {title}
        <span className="text-neon-purple">.</span>
      </h2>
      <div className="mt-5 w-24 h-[2px] bg-gradient-to-r from-neon-purple to-neon-cyan mx-auto" />
    </m.div>
  );
}
