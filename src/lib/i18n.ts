export type Locale = "pl" | "en";

export const translations = {
  pl: {
    nav: {
      home: "Start",
      about: "O mnie",
      projects: "Projekty",
      contact: "Kontakt",
    },
    hero: {
      description:
        "Tworzę nowoczesne aplikacje webowe z pasją do czystego kodu i kreatywnego designu.",
      cta_projects: "Zobacz projekty",
      cta_contact: "Kontakt",
    },
    about: {
      label: "01 / O mnie",
      title: "Kim jestem",
      bio1_prefix: "Cześć! Jestem ",
      bio1_name: "Adam",
      bio1_suffix:
        " — programista z pasją do tworzenia nowoczesnych aplikacji webowych. Specjalizuję się w budowaniu interaktywnych interfejsów użytkownika i solidnych systemów backendowych.",
      bio2: "Wierzę, że najlepszy kod to taki, który jest jednocześnie wydajny i elegancki. Każdy projekt traktuję jako okazję do nauki i rozwiązywania realnych problemów. Kiedy nie koduję, rozwijam swoje umiejętności w nowych technologiach i frameworkach.",
      stat_experience: "Lata doświadczenia",
      stat_projects: "Projekty",
      stat_technologies: "Technologii",
      category_frontend: "Frontend",
      category_backend: "Backend",
      category_tools: "Narzędzia",
    },
    projects: {
      label: "02 / Projekty",
      title: "Moje prace",
    },
    project_descriptions: {
      "project-1":
        "Webowa gra w szachy z możliwością rozgrywki przeciwko AI oraz podpowiedziami najlepszego ruchu. Nowoczesny interfejs z ciemnym motywem.",
      "project-2":
        "Sklep internetowy z modą premium. Fullstack aplikacja e-commerce z nowoczesnym designem, systemem zarządzania produktami i koszykiem zakupowym.",
      "project-3":
        "Aplikacja pomagająca deweloperom dobrać technologie do projektu. Rekomendacje generowane przez AI, walidowane przez społeczność programistów.",
    },
    contact: {
      label: "03 / Kontakt",
      title: "Porozmawiajmy",
      body: "Masz pomysł na projekt lub chcesz nawiązać współpracę? Chętnie porozmawiam o nowych możliwościach. Napisz do mnie!",
      email_button: "Napisz email",
    },
    footer: {
      copyright: "Adam. Wszelkie prawa zastrzeżone.",
    },
  },
  en: {
    nav: {
      home: "Home",
      about: "About",
      projects: "Projects",
      contact: "Contact",
    },
    hero: {
      description:
        "I build modern web applications with a passion for clean code and creative design.",
      cta_projects: "View projects",
      cta_contact: "Contact",
    },
    about: {
      label: "01 / About",
      title: "Who I am",
      bio1_prefix: "Hi! I'm ",
      bio1_name: "Adam",
      bio1_suffix:
        " — a developer with a passion for building modern web applications. I specialize in creating interactive user interfaces and robust backend systems.",
      bio2: "I believe the best code is both efficient and elegant. I treat every project as an opportunity to learn and solve real problems. When I'm not coding, I sharpen my skills with new technologies and frameworks.",
      stat_experience: "Years of experience",
      stat_projects: "Projects",
      stat_technologies: "Technologies",
      category_frontend: "Frontend",
      category_backend: "Backend",
      category_tools: "Tools",
    },
    projects: {
      label: "02 / Projects",
      title: "My work",
    },
    project_descriptions: {
      "project-1":
        "A web-based chess game with AI opponent and best-move hints. Modern interface with a dark theme.",
      "project-2":
        "Premium fashion online store. Full-stack e-commerce app with modern design, product management, and shopping cart.",
      "project-3":
        "An app that helps developers pick the right tech stack. AI-generated recommendations validated by the developer community.",
    },
    contact: {
      label: "03 / Contact",
      title: "Let's talk",
      body: "Have a project idea or want to collaborate? I'd love to discuss new opportunities. Get in touch!",
      email_button: "Send email",
    },
    footer: {
      copyright: "Adam. All rights reserved.",
    },
  },
} as const;

// Widened type so both locales are assignable
type DeepStringify<T> = {
  [K in keyof T]: T[K] extends string ? string : DeepStringify<T[K]>;
};

export type Translations = DeepStringify<(typeof translations)["pl"]>;
