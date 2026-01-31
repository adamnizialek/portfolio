export const NAV_LINKS = [
  { label: "Start", href: "#hero" },
  { label: "O mnie", href: "#about" },
  { label: "Projekty", href: "#projects" },
  { label: "Kontakt", href: "#contact" },
] as const;

export const SOCIAL_LINKS = {
  github: "https://github.com/",
  linkedin: "https://linkedin.com/in/",
  email: "mailto:adam@example.com",
} as const;

export const SITE_CONFIG = {
  name: "Adam",
  title: "Full-Stack Developer",
  description:
    "Tworzę nowoczesne aplikacje webowe z pasją do czystego kodu i kreatywnego designu.",
} as const;
