export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  liveUrl?: string;
  githubUrl?: string;
}

export const projects: Project[] = [
  {
    id: "project-1",
    title: "Chess App",
    description:
      "Webowa gra w szachy z możliwością rozgrywki przeciwko AI oraz podpowiedziami najlepszego ruchu. Nowoczesny interfejs z ciemnym motywem.",
    tags: ["React", "JavaScript", "CSS"],
    liveUrl: "https://chess-app-adamnizialek.netlify.app/",
    githubUrl: "https://github.com/adamnizialek/Chess-APP",
  },
  {
    id: "project-2",
    title: "Avvenire Store",
    description:
      "Sklep internetowy z modą premium. Fullstack aplikacja e-commerce z nowoczesnym designem, systemem zarządzania produktami i koszykiem zakupowym.",
    tags: ["Next.js", "TypeScript", "Docker"],
    liveUrl: "https://avvenire.vercel.app/",
    githubUrl: "https://github.com/adamnizialek/avvenire-store",
  },
  {
    id: "project-3",
    title: "Stack Matcher",
    description:
      "Aplikacja pomagająca deweloperom dobrać technologie do projektu. Rekomendacje generowane przez AI, walidowane przez społeczność programistów.",
    tags: ["Next.js", "TypeScript", "Prisma", "PostgreSQL", "AI"],
    liveUrl: "https://stack-matcher.vercel.app/",
    githubUrl: "https://github.com/adamnizialek/stack-matcher",
  },
];
