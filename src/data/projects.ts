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
      "Webowa gra w szachy online z nowoczesnym interfejsem i ciemnym motywem. Pozwala na rozgrywkę w przeglądarce.",
    tags: ["React", "JavaScript", "CSS"],
    liveUrl: "https://chess-app-adamnizialek.netlify.app/",
    githubUrl: "https://github.com/adamnizialek/Chess-APP",
  },
  {
    id: "project-2",
    title: "Projekt Drugi",
    description:
      "Opis drugiego projektu. Dodaj tutaj szczegóły dotyczące technologii i rozwiązań.",
    tags: ["Next.js", "Node.js", "PostgreSQL"],
    liveUrl: "#",
    githubUrl: "#",
  },
  {
    id: "project-3",
    title: "Projekt Trzeci",
    description:
      "Opis trzeciego projektu. Opisz wyzwania i jak je rozwiązałeś.",
    tags: ["Python", "Docker", "REST API"],
    liveUrl: "#",
    githubUrl: "#",
  },
];
