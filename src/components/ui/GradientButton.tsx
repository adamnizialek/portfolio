"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  href?: string;
  variant?: "filled" | "outline";
  onClick?: () => void;
  target?: string;
}

export default function GradientButton({
  children,
  href,
  variant = "filled",
  onClick,
  target,
}: Props) {
  const baseClasses =
    "relative inline-flex items-center gap-2 px-9 py-4 rounded-full font-semibold text-sm tracking-wide transition-all duration-300 cursor-pointer";

  const filledClasses =
    "bg-gradient-to-r from-neon-purple to-neon-cyan text-white hover:shadow-[0_0_30px_rgba(139,92,246,0.4)] hover:scale-105";

  const outlineClasses =
    "border border-neon-purple/40 text-text-primary hover:border-neon-cyan/60 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] hover:scale-105 bg-surface/50 backdrop-blur-sm";

  const classes = `${baseClasses} ${variant === "filled" ? filledClasses : outlineClasses}`;

  const Component = (
    <motion.span
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className={classes}
      style={{ padding: '14px 32px' }}
    >
      {children}
    </motion.span>
  );

  if (href) {
    return (
      <a href={href} onClick={onClick} target={target} rel={target === "_blank" ? "noopener noreferrer" : undefined}>
        {Component}
      </a>
    );
  }

  return <button onClick={onClick}>{Component}</button>;
}
