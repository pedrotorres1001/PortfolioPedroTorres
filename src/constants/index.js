/**
 * ─────────────────────────────────────────────────────────────
 *  CONTEÚDO DO PORTFÓLIO
 *  Todo o texto do site vive aqui. Os componentes só leem daqui.
 *
 *  Texto traduzível: { en: "...", pt: "..." }. Texto igual nas duas
 *  línguas pode ser uma string simples.
 *
 *  Procura "REVIEW" para textos que escrevi e deves confirmar, e
 *  "TODO" para informação que só tu tens.
 * ─────────────────────────────────────────────────────────────
 */

export const profile = {
  name: "Pedro Torres",
  handle: "PEDRO_TORRES",
  role: "Junior Software Developer",
  company: "Kuehne+Nagel",
  tagline: {
    en: "Reliable systems by day, interactive worlds by night.",
    pt: "Sistemas fiáveis de dia, mundos interativos à noite.",
  },
  location: "Aveiro, Portugal",
  timezone: "Europe/Lisbon",
  availability: {
    en: "Open to remote collaboration worldwide",
    pt: "Disponível para colaboração remota",
  },
  email: "pedrocorreia917@gmail.com",
  // TODO: coloca o teu CV em public/cv.pdf e muda para "cv.pdf". Enquanto for null, o botão [CV.PDF] fica escondido.
  cvUrl: null,
  version: "3.0.0",
};

/** Usado no <title>, meta description e Open Graph (sempre em inglês). */
export const seo = {
  title: `${profile.name} — ${profile.role}`,
  description:
    "Portfolio of Pedro Torres — junior software developer at Kuehne+Nagel with a Master's in Digital Game Development from the University of Aveiro.",
};

/** Secções e índice lateral [00]–[05]. */
export const navLinks = [
  { id: "home", label: { en: "HOME", pt: "INÍCIO" } },
  { id: "about", label: { en: "ABOUT", pt: "SOBRE" } },
  { id: "work", label: { en: "WORK", pt: "TRABALHO" } },
  { id: "projects", label: { en: "PROJECTS", pt: "PROJETOS" } },
  { id: "education", label: { en: "BOOT_SEQ", pt: "PERCURSO" } },
  { id: "contact", label: { en: "CONTACT", pt: "CONTACTO" } },
];

/**
 * SYSTEM_PROFILE — REVIEW: texto escrito por mim só com factos que conheço.
 * Ajusta o tom e acrescenta o que te move (60–90 palavras).
 */
export const about = {
  text: {
    en: "I'm Pedro, a developer from Aveiro, Portugal. By day I work as a junior software developer at Kuehne+Nagel, migrating legacy pages to the web and untangling whatever lands in the ticket queue. By night I build games — a habit that turned into a Master's in Digital Game Development. I like work that has to be solid underneath and feel good on top: clean systems, small details, and the moment something on screen finally responds the way it should.",
    pt: "Sou o Pedro, developer de Aveiro. De dia sou junior software developer na Kuehne+Nagel, a migrar páginas antigas para a web e a desatar o que aparece na fila de tickets. À noite faço jogos — um hábito que acabou num Mestrado em Desenvolvimento de Jogos Digitais. Gosto de trabalho que tem de ser sólido por baixo e agradável por cima: sistemas limpos, detalhes pequenos e o momento em que algo no ecrã finalmente responde como deve.",
  },
  stats: [
    { key: "BASE", value: "AVEIRO/PT" },
    { key: "DAY_JOB", value: "SOFTWARE_DEV @ K+N" },
    { key: "NIGHT_JOB", value: "GAME_DEV" },
    { key: "ENGINES", value: "UNITY · UNREAL" },
    { key: "LANGS", value: "C# · C++ · JS · PYTHON" },
  ],
};

/** Experiência profissional — a primeira entrada aparece em destaque. */
export const work = [
  {
    company: "Kuehne+Nagel",
    node: "ACTIVE",
    role: "Junior Software Developer",
    // Data de entrada (AAAA-MM-DD). Alimenta os contadores de tempo na empresa.
    startDate: "2025-10-15",
    endDate: null, // null = presente
    location: "Portugal",
    contents: {
      en: [
        "Migrating legacy pages to modern web applications.",
        "Resolving support tickets across a wide range of day-to-day issues.",
      ],
      pt: [
        "Migração de páginas antigas para aplicações web modernas.",
        "Resolução de tickets sobre os mais diversos problemas do dia a dia.",
      ],
    },
    stack: [], // TODO (opcional): tecnologias que usas, ex. ["C#", ".NET", "SQL"]
  },
];

export const education = [
  {
    institution: "University of Aveiro",
    degree: { en: "Master's in Digital Game Development", pt: "Mestrado em Desenvolvimento de Jogos Digitais" },
    period: "2024 — 2026",
    status: "COMPLETED",
    contents: {
      en: [
        "Game design, real-time development techniques and industry-standard pipelines.",
        "Shipped team projects in Unity and Unreal Engine — Volcano Heart and Unbreakable Phone.",
      ],
      pt: [
        "Design de jogos, técnicas de desenvolvimento em tempo real e pipelines da indústria.",
        "Projetos de equipa lançados em Unity e Unreal Engine — Volcano Heart e Unbreakable Phone.",
      ],
    },
  },
  {
    institution: "University of Aveiro",
    degree: { en: "Bachelor's in Computer Engineering", pt: "Licenciatura em Engenharia Informática" },
    period: "2021 — 2024",
    status: "COMPLETED",
    contents: {
      en: [
        "Foundations in software engineering, programming languages and computer science.",
        "Final project on sensing and perception for autonomous vehicles, in a team of six.",
      ],
      pt: [
        "Bases sólidas em engenharia de software, linguagens de programação e ciência da computação.",
        "Projeto final sobre perceção e sensores para veículos autónomos, numa equipa de seis.",
      ],
    },
  },
];

/** Linha do tempo "boot sequence" (ligada ao scroll). */
export const bootSequence = [
  { date: "2021", code: "INIT", label: { en: "Bachelor's in Computer Engineering", pt: "Licenciatura em Eng. Informática" } },
  { date: "2024", code: "MODULE_LOADED", label: { en: "Master's in Digital Game Development", pt: "Mestrado em Jogos Digitais" } },
  { date: "2025-10-15", code: "DEPLOYED @ K+N", label: { en: "Junior Software Developer at Kuehne+Nagel", pt: "Junior Software Developer na Kuehne+Nagel" } },
  { date: "2026", code: "MODULE_COMPLETE", label: { en: "Master's degree completed", pt: "Mestrado concluído" } },
  { date: "NOW", code: "RUNNING", label: { en: "Building systems and worlds", pt: "A construir sistemas e mundos" } },
];

/** Cartão "VOW" — princípios. */
export const principles = [
  { key: "CRAFT", value: "CODE_IS_CRAFT" },
  { key: "DESIGN", value: "SOLID · GRASP · DESIGN_PATTERNS" },
  { key: "INTENT", value: "BUILD_THINGS_PEOPLE_ENJOY_USING" },
];

/** Filtros do arquivo de projetos. */
export const projectFilters = [
  { id: "all", label: { en: "ALL", pt: "TODOS" } },
  { id: "games", label: { en: "GAMES", pt: "JOGOS" } },
  { id: "web", label: "WEB" },
  { id: "systems", label: { en: "SYSTEMS", pt: "SISTEMAS" } },
  { id: "art", label: { en: "3D ART", pt: "ARTE 3D" } },
];

/**
 * Projetos.
 * - role / team: os dos jogos vêm dos créditos públicos no itch.io. null = não mostrado.
 * - highlights: pontos-chave (o que fizeste, decisões, resultado). null = não mostrado.
 * - gallery: imagens extra em public/assets/projects/ (webp). TODO: acrescenta 2–3 por projeto.
 * - video: URL de um vídeo (mp4/webm) para o painel. TODO opcional.
 * - embedUrl: widget do itch.io carregado só quando o visitante clica em [RUN BUILD].
 */
export const myProjects = [
  {
    id: 1,
    slug: "volcano-heart",
    title: "Volcano Heart",
    filter: "games",
    category: { en: "2D GAME", pt: "JOGO 2D" },
    description: {
      en: "2D pixel-art adventure for the Master's in Digital Game Development, University of Aveiro.",
      pt: "Aventura 2D em pixel art para o Mestrado em Desenvolvimento de Jogos Digitais, Universidade de Aveiro.",
    },
    subDescription: {
      en: [
        "Exploration, combat and puzzle solving in underground ruins inside a volcano.",
        "You play a dwarf determined to recover a lost artifact essential to saving his village.",
      ],
      pt: [
        "Exploração, combate e puzzles em ruínas subterrâneas dentro de um vulcão.",
        "Controlas um anão determinado a recuperar um artefacto perdido, essencial para salvar a sua aldeia.",
      ],
    },
    role: { en: "Programmer · Writer", pt: "Programador · Argumentista" },
    team: 4,
    highlights: null, // TODO: o que programaste (ex. sistema de combate, puzzles, IA)
    href: "https://ritaguimaraes.itch.io/volcano-heart",
    embedUrl: "https://itch.io/embed/3278179?linkback=true&border_width=0&bg_color=ececec&fg_color=1c1c1e&link_color=1c1c1e&border_color=b9bbc0",
    image: "./assets/projects/volcanoheart.webp",
    gallery: [],
    video: null,
    tags: ["C#", "Unity", "Aseprite", "GitHub"],
  },
  {
    id: 2,
    slug: "unbreakable-phone",
    title: "Unbreakable Phone",
    filter: "games",
    category: { en: "3D GAME", pt: "JOGO 3D" },
    description: {
      en: "3D action game for the Master's in Digital Game Development, University of Aveiro.",
      pt: "Jogo de ação 3D para o Mestrado em Desenvolvimento de Jogos Digitais, Universidade de Aveiro.",
    },
    subDescription: {
      en: [
        "Play as Dona Irene, a strong elderly woman out to take down EternaTech, the world's leading tech company, consumed by greed and power.",
        "Her trusty old phone has special abilities that help her dismantle the corporation.",
      ],
      pt: [
        "Joga como Dona Irene, uma senhora idosa e destemida que quer derrubar a EternaTech, a maior tecnológica do mundo, consumida pela ganância e pelo poder.",
        "O seu velho telemóvel tem habilidades especiais que a ajudam a desmantelar a empresa.",
      ],
    },
    role: { en: "Programmer", pt: "Programador" },
    team: 5,
    highlights: null, // TODO
    href: "https://nadjito.itch.io/unbreakable-phone",
    embedUrl: "https://itch.io/embed/3678672?linkback=true&border_width=0&bg_color=ececec&fg_color=1c1c1e&link_color=1c1c1e&border_color=b9bbc0",
    image: "./assets/projects/unbreakable.webp",
    gallery: [],
    video: null,
    tags: ["Unreal Engine", "C++", "Blender", "GitHub"],
  },
  {
    id: 3,
    slug: "bachelor-final-project",
    title: "Bachelor Final Project",
    filter: "systems",
    category: { en: "AUTONOMOUS VEHICLES", pt: "VEÍCULOS AUTÓNOMOS" },
    description: {
      en: "Sensing and perception for controlling autonomous mobility vehicles.",
      pt: "Perceção e sensores para o controlo de veículos de mobilidade autónoma.",
    },
    subDescription: {
      en: [
        "Developed in PECI with a team of six, focused on the control and sensing of an autonomous vehicle.",
      ],
      pt: [
        "Desenvolvido em PECI numa equipa de seis, focado no controlo e na perceção de um veículo autónomo.",
      ],
    },
    role: { en: "Visualization · Perception models", pt: "Visualização · Modelos de perceção" },
    team: 6,
    highlights: {
      en: ["Built the visualization component.", "Integrated pre-trained models to recognise obstacles and traffic signs."],
      pt: ["Desenvolvi a componente de visualização.", "Integrei modelos pré-treinados para reconhecer obstáculos e sinais de trânsito."],
    },
    href: "https://code.nap.av.it.pt/adas/yolo-peci",
    embedUrl: null,
    image: "./assets/projects/peci.webp",
    gallery: [],
    video: null,
    tags: ["C++", "Vanetza", "Autoware", "YOLO"],
  },
  {
    id: 4,
    slug: "blockbuster",
    title: "BlockBuster",
    filter: "web",
    category: { en: "WEB APP", pt: "APLICAÇÃO WEB" },
    description: {
      en: "An online movie store to buy and watch films and series.",
      pt: "Uma loja online para comprar e ver filmes e séries.",
    },
    subDescription: {
      en: [
        "A nostalgic online movie store: buy a movie anywhere and watch it almost anywhere.",
        "Offers both streaming and physical copies. Built with React.",
      ],
      pt: [
        "Uma loja de filmes nostálgica: compra um filme em qualquer lado e vê-o quase em qualquer lado.",
        "Permite cópias em streaming e físicas. Feita em React.",
      ],
    },
    role: null, // TODO: o teu papel
    team: null, // TODO
    highlights: null,
    href: "https://github.com/MMarQs/IHC",
    embedUrl: null,
    image: "./assets/projects/blockbuster.webp",
    gallery: [],
    video: null,
    tags: ["React", "HTML", "CSS"],
  },
  {
    id: 5,
    slug: "abrigo-de-carinho",
    title: "Abrigo De Carinho",
    filter: "systems",
    category: { en: "DATABASE", pt: "BASE DE DADOS" },
    description: {
      en: "A management system for a local animal shelter, from adoptions to staff.",
      pt: "Um sistema de gestão para um abrigo de animais, das adoções aos funcionários.",
    },
    subDescription: {
      en: [
        "Proposed by a shelter in Praia de Mira to improve how it manages the animals in its care.",
        "A minimalist interface lets an admin add or remove animals and employees with ease.",
      ],
      pt: [
        "Proposto por um abrigo da Praia de Mira para melhorar a gestão dos animais ao seu cuidado.",
        "Uma interface minimalista permite a um administrador adicionar ou remover animais e funcionários com facilidade.",
      ],
    },
    role: null, // TODO
    team: null, // TODO
    highlights: null,
    href: "https://github.com/DavidPalricas/BD/tree/main/P/Projeto_Final",
    embedUrl: null,
    image: "./assets/projects/abrigo.webp",
    gallery: [],
    video: null,
    tags: ["C#", ".NET", "SQL"],
  },
  {
    id: 6,
    slug: "modelling-project",
    title: "Modelling Project",
    filter: "art",
    category: { en: "3D MODELLING", pt: "MODELAÇÃO 3D" },
    description: {
      en: "A 3D coffee-break area modelled in Blender.",
      pt: "Uma zona de pausa para café modelada em Blender.",
    },
    subDescription: {
      en: [
        "Developed for the Modelling course at the University of Aveiro.",
        "Two hang-out spots, a space for snacks and meals, and counters to prepare them.",
      ],
      pt: [
        "Desenvolvido para a unidade curricular de Modelação da Universidade de Aveiro.",
        "Duas zonas de convívio, um espaço para lanches e refeições e bancadas para os preparar.",
      ],
    },
    role: null, // TODO
    team: null,
    highlights: null,
    href: "",
    embedUrl: null,
    image: "./assets/projects/ma3d.webp",
    gallery: [],
    video: null,
    tags: ["Blender"],
  },
];

export const mySocials = [
  { name: "LinkedIn", href: "https://www.linkedin.com/in/pedro-torres-741358294/" },
  { name: "Instagram", href: "https://www.instagram.com/_ptorres__/" },
];

/** Formulário de contacto (EmailJS). Chaves públicas. */
export const emailjsConfig = {
  serviceId: "service_c9n6vkc",
  templateId: "template_555btr2",
  publicKey: "LY2xtIyWkJ-_p4jy4",
  toName: "Pedro",
};

/** Conquistas escondidas. */
export const achievements = {
  FIRST_REBUILD: { en: "Rebuilt the system for the first time", pt: "Reconstruíste o sistema pela primeira vez" },
  HELLO_TERMINAL: { en: "Opened the terminal", pt: "Abriste o terminal" },
  READ_ALL_LOGS: { en: "Opened every project dossier", pt: "Abriste todos os dossiers de projeto" },
  FOUND_THE_GAME: { en: "Found the hidden game", pt: "Encontraste o jogo escondido" },
  HIGH_SCORE: { en: "Scored 20+ in CUBE_RUNNER", pt: "Fizeste 20+ no CUBE_RUNNER" },
};

/**
 * Microcopy da interface (botões, estados, rótulos).
 */
export const ui = {
  viewProjects: { en: "[VIEW PROJECTS]", pt: "[VER PROJETOS]" },
  getInTouch: { en: "[GET IN TOUCH]", pt: "[CONTACTAR]" },
  cv: "[CV.PDF]",
  rebuild: "[REBUILD]",
  rebuilding: "[REBUILDING…]",
  uptime: { en: "UPTIME", pt: "UPTIME" },
  months: { en: "MONTHS", pt: "MESES" },
  since: { en: "SINCE", pt: "DESDE" },
  scroll: { en: "SCROLL", pt: "SCROLL" },
  linkStable: "LINK STABLE",
  sndOn: "[SND: ON]",
  sndOff: "[SND: OFF]",
  themeLight: "[THEME: LIGHT]",
  themeDark: "[THEME: DARK]",
  terminal: "[TERMINAL]",
  menu: "[MENU]",
  close: "[CLOSE]",
  skip: { en: "Skip to content", pt: "Saltar para o conteúdo" },
  // secções
  aboutLabel: { en: "SYSTEM_PROFILE", pt: "SYSTEM_PROFILE" },
  aboutTitle: "WHOAMI",
  workLabel: { en: "EXPERIENCE", pt: "EXPERIÊNCIA" },
  workTitle: "WORK_HISTORY",
  projectsLabel: { en: "SELECTED WORK", pt: "TRABALHO SELECIONADO" },
  projectsTitle: "PROJECT_ARCHIVE",
  entries: { en: "ENTRIES", pt: "ENTRADAS" },
  eduLabel: { en: "TRAINING_LOG", pt: "PERCURSO" },
  eduTitle: "BOOT_SEQUENCE",
  contactLabel: { en: "CONTACT", pt: "CONTACTO" },
  contactTitle: "OPEN_CHANNEL",
  // projetos
  overview: { en: "OVERVIEW", pt: "RESUMO" },
  role: { en: "ROLE", pt: "PAPEL" },
  team: { en: "TEAM", pt: "EQUIPA" },
  members: { en: "MEMBERS", pt: "PESSOAS" },
  stack: "STACK",
  highlights: { en: "HIGHLIGHTS", pt: "DESTAQUES" },
  gallery: { en: "GALLERY", pt: "GALERIA" },
  openProject: { en: "[OPEN PROJECT ↗]", pt: "[ABRIR PROJETO ↗]" },
  playItch: { en: "[PLAY ON ITCH.IO ↗]", pt: "[JOGAR NO ITCH.IO ↗]" },
  runBuild: "[RUN BUILD]",
  runBuildNote: {
    en: "Loads the itch.io widget (third-party content). The build itself is a desktop download.",
    pt: "Carrega o widget do itch.io (conteúdo externo). O jogo em si é um download para desktop.",
  },
  noMatch: { en: "NO_ENTRIES_MATCH_FILTER", pt: "NENHUMA_ENTRADA_NESTE_FILTRO" },
  // contacto
  contactIntro: {
    en: "Have a project, a role or a game idea in mind? Send a packet and I'll acknowledge it.",
    pt: "Tens um projeto, uma vaga ou uma ideia de jogo? Envia um pacote e eu confirmo a receção.",
  },
  copyEmail: { en: "[COPY EMAIL]", pt: "[COPIAR EMAIL]" },
  copied: { en: "[COPIED ✓]", pt: "[COPIADO ✓]" },
  fieldName: { en: "NAME", pt: "NOME" },
  fieldEmail: "EMAIL",
  fieldMessage: { en: "MESSAGE", pt: "MENSAGEM" },
  phName: "Jane Doe",
  phEmail: "jane@company.com",
  phMessage: { en: "Tell me about it…", pt: "Conta-me tudo…" },
  send: { en: "[SEND ↵]", pt: "[ENVIAR ↵]" },
  sending: { en: "[SENDING…]", pt: "[A ENVIAR…]" },
  statusIdle: { en: "AWAITING_INPUT", pt: "À_ESPERA_DE_INPUT" },
  statusSending: { en: "TRANSMITTING…", pt: "A_TRANSMITIR…" },
  statusSent: { en: "PACKET_SENT · AWAITING_ACK", pt: "PACOTE_ENVIADO · À_ESPERA_DE_ACK" },
  statusError: { en: "TRANSMISSION_FAILED · USE EMAIL", pt: "FALHA_NA_TRANSMISSÃO · USA O EMAIL" },
  newMessage: "NEW_MESSAGE",
  // footer
  builtWith: { en: "BUILT WITH REACT + THREE.JS", pt: "FEITO COM REACT + THREE.JS" },
  local: "LOCAL",
  top: "[↑ TOP]",
  achievementUnlocked: { en: "ACHIEVEMENT_UNLOCKED", pt: "CONQUISTA_DESBLOQUEADA" },
};
