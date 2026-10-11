/**
 * ─────────────────────────────────────────────────────────────
 *  CONTEÚDO DO PORTFÓLIO
 *  Todo o texto do site vive aqui. Os componentes só leem daqui.
 *  Procura "TODO" para os campos que ainda faltam preencher.
 * ─────────────────────────────────────────────────────────────
 */

export const profile = {
  name: "Pedro Torres",
  handle: "PEDRO_TORRES",
  // TODO: substituir pelo cargo real na Kuehne+Nagel
  role: "ROLE_TBD",
  company: "Kuehne+Nagel",
  tagline:
    "Software engineer with a game developer's eye — building reliable systems and interactive worlds.",
  location: "Aveiro, Portugal",
  timezone: "Europe/Lisbon",
  availability: "Open to remote collaboration worldwide",
  email: "pedrocorreia917@gmail.com",
  version: "2.0.0",
};

/** Usado no <title>, meta description e Open Graph (ver também index.html). */
export const seo = {
  title: `${profile.name} — ${profile.role}`,
  description:
    "Portfolio of Pedro Torres — software engineer at Kuehne+Nagel with a Master's in Digital Game Development from the University of Aveiro.",
};

export const navLinks = [
  { id: "home", label: "HOME" },
  { id: "work", label: "WORK" },
  { id: "projects", label: "PROJECTS" },
  { id: "education", label: "EDU" },
  { id: "contact", label: "CONTACT" },
];

/** Experiência profissional — a primeira entrada aparece em destaque. */
export const work = [
  {
    company: "Kuehne+Nagel",
    node: "ACTIVE",
    // TODO: cargo real
    role: "ROLE_TBD",
    // TODO: confirmar o mês de entrada (formato AAAA-MM). Alimenta o contador "UPTIME".
    startDate: "2025-10",
    endDate: null, // null = presente
    location: "Portugal",
    // TODO: 2–3 pontos sobre o que fazes, tecnologias e impacto
    contents: [
      "TODO — what you build or maintain day to day",
      "TODO — main technologies and tools",
      "TODO — one concrete result or impact",
    ],
    stack: [], // TODO: ex. ["C#", ".NET", "SQL"]
  },
];

export const education = [
  {
    institution: "University of Aveiro",
    degree: "Master's in Digital Game Development",
    period: "2024 — 2026",
    // TODO: mudar para "COMPLETED" quando o mestrado estiver concluído
    status: "IN_PROGRESS",
    contents: [
      "Advanced game design, real-time development techniques and industry-standard pipelines.",
      "Shipped team projects in Unity and Unreal Engine — see Volcano Heart and Unbreakable Phone.",
    ],
  },
  {
    institution: "University of Aveiro",
    degree: "Bachelor's in Computer Engineering",
    period: "2021 — 2024",
    status: "COMPLETED",
    contents: [
      "Solid foundation in software engineering, programming languages and computer science.",
      "Final project on sensing and perception for autonomous vehicles, in a team of six.",
    ],
  },
];

/** Cartão "VOW" — princípios. */
export const principles = [
  { key: "CRAFT", value: "CODE_IS_CRAFT" },
  { key: "DESIGN", value: "SOLID · GRASP · DESIGN_PATTERNS" },
  { key: "INTENT", value: "BUILD_THINGS_PEOPLE_ENJOY_USING" },
];

export const myProjects = [
  {
    id: 1,
    title: "Volcano Heart",
    category: "2D GAME",
    description:
      "2D game project for the Master's in Digital Game Development, University of Aveiro.",
    subDescription: [
      "Volcano Heart is a 2D pixel-art game that combines exploration, combat and puzzle solving, set in underground ruins inside a volcano.",
      "The player controls a dwarf determined to recover a lost artifact essential to saving his village.",
    ],
    href: "https://ritaguimaraes.itch.io/volcano-heart",
    image: "./assets/projects/volcanoheart.webp",
    tags: ["C#", "Unity", "Aseprite", "GitHub"],
  },
  {
    id: 2,
    title: "Unbreakable Phone",
    category: "3D GAME",
    description:
      "3D game project for the Master's in Digital Game Development, University of Aveiro.",
    subDescription: [
      "Play as Dona Irene, a strong elderly woman whose goal is to take down EternaTech, the world's leading tech company, consumed by greed and power.",
      "To do so, she retrieves her trusty old phone, whose special abilities help her dismantle the evil corporation.",
    ],
    href: "https://nadjito.itch.io/unbreakable-phone",
    image: "./assets/projects/unbreakable.webp",
    tags: ["Unreal Engine", "C++", "Blender", "GitHub"],
  },
  {
    id: 3,
    title: "Bachelor Final Project",
    category: "AUTONOMOUS VEHICLES",
    description:
      "Sensing and perception for controlling autonomous mobility vehicles.",
    subDescription: [
      "Developed in PECI with a team of six, focused on the control and sensing of an autonomous vehicle.",
      "My contribution centred on the visualization component and on integrating pre-trained models to recognise obstacles and traffic signs.",
    ],
    href: "https://code.nap.av.it.pt/adas/yolo-peci",
    image: "./assets/projects/peci.webp",
    tags: ["C++", "Vanetza", "Autoware", "YOLO"],
  },
  {
    id: 4,
    title: "BlockBuster",
    category: "WEB APP",
    description:
      "A web application to buy and watch favourite movies and series.",
    subDescription: [
      "BlockBuster is an online movie store that takes you back in time.",
      "Like the good old days when you could buy a movie anywhere and watch it almost anywhere, it lets you purchase either streaming or physical copies.",
      "Built with React.",
    ],
    href: "https://github.com/MMarQs/IHC",
    image: "./assets/projects/blockbuster.webp",
    tags: ["React", "HTML", "CSS"],
  },
  {
    id: 5,
    title: "Abrigo De Carinho",
    category: "DATABASE",
    description:
      "A management system for a local animal shelter, from adoptions to staff.",
    subDescription: [
      "Proposed by a shelter in Praia de Mira to improve the management of the animals in its care.",
      "A minimalist interface makes it easy for an admin to add or remove both animals and employees.",
    ],
    href: "https://github.com/DavidPalricas/BD/tree/main/P/Projeto_Final",
    image: "./assets/projects/abrigo.webp",
    tags: ["C#", ".NET", "SQL"],
  },
  {
    id: 6,
    title: "Modelling Project",
    category: "3D MODELLING",
    description: "A 3D coffee-break area modelled in Blender.",
    subDescription: [
      "Developed for the Modelling course at the University of Aveiro.",
      "A coffee-break area with two hang-out spots, a space for snacks and meals, and counters to prepare them.",
    ],
    href: "",
    image: "./assets/projects/ma3d.webp",
    tags: ["Blender"],
  },
];

export const mySocials = [
  { name: "LinkedIn", href: "https://www.linkedin.com/in/pedro-torres-741358294/" },
  { name: "Instagram", href: "https://www.instagram.com/_ptorres__/" },
];

/** Formulário de contacto (EmailJS). Chaves públicas — já estavam no projeto. */
export const emailjsConfig = {
  serviceId: "service_c9n6vkc",
  templateId: "template_555btr2",
  publicKey: "LY2xtIyWkJ-_p4jy4",
  toName: "Pedro",
};
