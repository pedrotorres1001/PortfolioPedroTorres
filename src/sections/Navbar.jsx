import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { navLinks, profile, ui } from "../constants";
import Scramble from "../components/Scramble";
import useActiveSection from "../components/useActiveSection";
import { useApp, useT } from "../state/AppState";

/** Interruptores do sistema: som, tema, idioma, terminal. */
export function SystemToggles({ className = "", withTerminal = true }) {
  const { sound, setSound, theme, setTheme, lang, setLang, openTerminal } = useApp();
  const chip = "border border-line px-2 py-1 text-[10px] uppercase tracking-[0.15em] text-ink-2 transition-colors hover:border-ink hover:text-ink";
  return (
    <div className={`flex flex-wrap items-center gap-1.5 ${className}`}>
      <button className={chip} onClick={() => setSound(!sound)} aria-pressed={sound} title="Sound">
        {sound ? (
          <>
            <span className="mr-1 inline-block size-1.5 rounded-full bg-accent align-middle" aria-hidden="true" />
            {ui.sndOn.slice(1, -1)}
          </>
        ) : (
          ui.sndOff.slice(1, -1)
        )}
      </button>
      <button
        className={chip}
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
      >
        {theme === "dark" ? "DARK" : "LIGHT"}
      </button>
      <button className={chip} onClick={() => setLang(lang === "pt" ? "en" : "pt")} aria-label="Switch language">
        <span className={lang === "en" ? "text-ink" : "text-mute"}>EN</span>
        <span className="text-mute">|</span>
        <span className={lang === "pt" ? "text-ink" : "text-mute"}>PT</span>
      </button>
      {withTerminal && (
        <button className={chip} onClick={() => openTerminal(true)} title="Terminal (~)">
          &gt;_
        </button>
      )}
    </div>
  );
}

export default function Navbar() {
  const t = useT();
  const active = useActiveSection();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = (onClick) =>
    navLinks.map((l) => (
      <a
        key={l.id}
        href={`#${l.id}`}
        onClick={onClick}
        className={active === l.id ? "btn-sys-solid" : "btn-sys"}
        aria-current={active === l.id ? "true" : undefined}
      >
        <Scramble text={`[${t(l.label)}]`} />
      </a>
    ));

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color] duration-300 ${
        scrolled ? "border-b border-line-soft bg-bg/75 backdrop-blur-md" : "border-b border-transparent"
      }`}
    >
      <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-8 sm:py-4">
        <div className="flex items-center gap-4">
          <a href="#home" className="flex items-center gap-4 text-[10px] uppercase tracking-[0.22em] text-ink-2">
            <span className="hidden h-px w-6 bg-mute sm:block" aria-hidden="true" />
            <span>{profile.handle}</span>
            <span className="hidden items-center gap-2 lg:flex">
              <span className="size-1.5 animate-pulse-dot rounded-full bg-accent" aria-hidden="true" />
              {ui.linkStable}
            </span>
          </a>
          <SystemToggles className="hidden md:flex" />
        </div>

        <nav className="hidden gap-2 xl:flex" aria-label="Primary">
          {links()}
        </nav>

        <button className="btn-sys xl:hidden" onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-controls="mobile-nav">
          {open ? ui.close : ui.menu}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-nav"
            aria-label="Mobile"
            className="mx-4 flex flex-col gap-2 border border-line bg-surface/95 p-3 backdrop-blur xl:hidden"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {links(() => setOpen(false))}
            <SystemToggles className="mt-2 md:hidden" />
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
