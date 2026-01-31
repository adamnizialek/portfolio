export interface Skill {
  name: string;
  category: "frontend" | "backend" | "tools";
}

export const skills: Skill[] = [
  { name: "React", category: "frontend" },
  { name: "Next.js", category: "frontend" },
  { name: "TypeScript", category: "frontend" },
  { name: "Tailwind CSS", category: "frontend" },
  { name: "Three.js", category: "frontend" },
  { name: "Node.js", category: "backend" },
  { name: "Python", category: "backend" },
  { name: "PostgreSQL", category: "backend" },
  { name: "Git", category: "tools" },
  { name: "Docker", category: "tools" },
  { name: "Figma", category: "tools" },
  { name: "Linux", category: "tools" },
];
