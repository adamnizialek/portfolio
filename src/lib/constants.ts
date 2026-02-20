export const NAV_LINKS = [
  { label: "Start", href: "#hero" },
  { label: "O mnie", href: "#about" },
  { label: "Projekty", href: "#projects" },
  { label: "Kontakt", href: "#contact" },
] as const;

export const SOCIAL_LINKS = {
  github: "https://github.com/adamnizialek",
  linkedin: "https://www.linkedin.com/in/adam-nizialek/",
  email: "mailto:adam.nizialek1@gmail.com",
} as const;

export const SITE_CONFIG = {
  name: "Adam Niziałek",
  title: "Full-Stack Developer",
  description:
    "Tworzę nowoczesne aplikacje webowe z pasją do czystego kodu i kreatywnego designu.",
} as const;
