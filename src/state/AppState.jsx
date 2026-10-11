import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import sfx from "../lib/sfx";

const AppCtx = createContext(null);

/* localStorage pode falhar (modo privado, bloqueios) — nunca deixar isso partir o site. */
const store = {
  get(k, fallback) {
    try {
      const v = localStorage.getItem(`pt:${k}`);
      return v === null ? fallback : JSON.parse(v);
    } catch {
      return fallback;
    }
  },
  set(k, v) {
    try {
      localStorage.setItem(`pt:${k}`, JSON.stringify(v));
    } catch {
      /* ignorar */
    }
  },
};

const initialTheme = () => {
  const saved = store.get("theme", null);
  if (saved) return saved;
  try {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  } catch {
    return "light";
  }
};

const initialLang = () => {
  const saved = store.get("lang", null);
  if (saved) return saved;
  return (navigator.language || "en").toLowerCase().startsWith("pt") ? "pt" : "en";
};

export function AppStateProvider({ children }) {
  const [lang, setLangState] = useState(initialLang);
  const [theme, setThemeState] = useState(initialTheme);
  const [sound, setSoundState] = useState(false); // sempre desligado ao entrar
  const [loop, setLoop] = useState(0);
  const [unlocked, setUnlocked] = useState(() => store.get("achievements", []));
  const [toast, setToast] = useState(null);
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [gameOpen, setGameOpen] = useState(false);
  const [openProject, setOpenProject] = useState(null); // slug
  const [seenProjects, setSeenProjects] = useState(() => new Set());
  const toastTimer = useRef(0);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = theme === "dark" ? "#111214" : "#E4E5E7";
  }, [theme]);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((l) => {
    setLangState(l);
    store.set("lang", l);
  }, []);
  const setTheme = useCallback((t) => {
    setThemeState(t);
    store.set("theme", t);
  }, []);
  const setSound = useCallback((on) => {
    setSoundState(on);
    if (on) sfx.enable();
    else sfx.disable();
  }, []);

  const unlock = useCallback((id) => {
    setUnlocked((prev) => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      store.set("achievements", next);
      clearTimeout(toastTimer.current);
      setToast(id);
      sfx.chime();
      toastTimer.current = setTimeout(() => setToast(null), 3600);
      return next;
    });
  }, []);

  const rebuild = useCallback(() => {
    setLoop((n) => n + 1);
    sfx.rebuild();
    unlock("FIRST_REBUILD");
  }, [unlock]);

  const openDossier = useCallback((slug, total) => {
    setOpenProject(slug);
    if (!slug) return;
    setSeenProjects((prev) => {
      const next = new Set(prev).add(slug);
      if (total && next.size >= total) unlock("READ_ALL_LOGS");
      return next;
    });
  }, [unlock]);

  const openTerminal = useCallback(
    (v = true) => {
      setTerminalOpen(v);
      if (v) unlock("HELLO_TERMINAL");
    },
    [unlock]
  );

  const openGame = useCallback(
    (v = true) => {
      setGameOpen(v);
      if (v) unlock("FOUND_THE_GAME");
    },
    [unlock]
  );

  const value = useMemo(
    () => ({
      lang, setLang, theme, setTheme, sound, setSound,
      loop, rebuild, unlocked, unlock, toast,
      terminalOpen, openTerminal, gameOpen, openGame,
      openProject, openDossier, seenProjects,
    }),
    [lang, setLang, theme, setTheme, sound, setSound, loop, rebuild, unlocked, unlock, toast,
      terminalOpen, openTerminal, gameOpen, openGame, openProject, openDossier, seenProjects]
  );

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useApp() {
  return useContext(AppCtx);
}

/** Resolve um valor traduzível ({en, pt}) para a língua atual. */
// eslint-disable-next-line react-refresh/only-export-components
export function useT() {
  const { lang } = useApp();
  return useCallback(
    (v) => (v && typeof v === "object" && !Array.isArray(v) && ("en" in v || "pt" in v) ? v[lang] ?? v.en : v),
    [lang]
  );
}
