import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { about, achievements, myProjects, navLinks, profile } from "../constants";
import { useApp, useT } from "../state/AppState";
import sfx from "../lib/sfx";

const COMMANDS = ["help", "whoami", "about", "projects", "open", "goto", "contact", "rebuild", "play", "theme", "lang", "sound", "achievements", "ls", "clear", "exit"];

const pad = (n) => String(n).padStart(2, "0");

function scrollToId(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

export default function Terminal() {
  const t = useT();
  const app = useApp();
  const { terminalOpen, openTerminal } = app;
  const [lines, setLines] = useState([]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([]);
  const [hIdx, setHIdx] = useState(-1);
  const inputRef = useRef(null);
  const bodyRef = useRef(null);

  const banner = () => [
    { kind: "sys", text: `PT_OS v${profile.version} — ${profile.name.toUpperCase()}` },
    { kind: "sys", text: t({ en: "Type 'help' to list commands. Esc to close.", pt: "Escreve 'help' para ver os comandos. Esc para fechar." }) },
  ];

  // Tecla ~ / ` abre e fecha (fora de campos de texto).
  useEffect(() => {
    const onKey = (e) => {
      const typing = e.target.closest?.("input, textarea, [contenteditable]") && e.target !== inputRef.current;
      if ((e.key === "`" || e.key === "~" || e.code === "Backquote") && !typing) {
        e.preventDefault();
        openTerminal(!terminalOpen);
      } else if (e.key === "Escape" && terminalOpen) {
        openTerminal(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [terminalOpen, openTerminal]);

  useEffect(() => {
    if (!terminalOpen) return;
    if (lines.length === 0) setLines(banner());
    setTimeout(() => inputRef.current?.focus(), 50);
    sfx.open();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [terminalOpen]);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight });
  }, [lines]);

  const run = (raw) => {
    const [cmd, ...args] = raw.trim().split(/\s+/);
    const arg = args.join(" ").toLowerCase();
    const out = [];
    const say = (text, kind = "out") => out.push({ kind, text });

    switch ((cmd || "").toLowerCase()) {
      case "":
        break;
      case "help":
        [
          ["whoami / about", { en: "who is behind this", pt: "quem está por trás disto" }],
          ["projects", { en: "list projects", pt: "listar projetos" }],
          ["open <n>", { en: "open project dossier n", pt: "abrir o dossier do projeto n" }],
          ["goto <section>", navLinks.map((l) => l.id).join(" | ")],
          ["contact", { en: "jump to the contact form", pt: "ir para o formulário de contacto" }],
          ["rebuild", { en: "rebuild the hero scene", pt: "reconstruir a cena do hero" }],
          ["play", { en: "run CUBE_RUNNER", pt: "correr o CUBE_RUNNER" }],
          ["theme [light|dark]", { en: "switch theme", pt: "mudar o tema" }],
          ["lang [en|pt]", { en: "switch language", pt: "mudar a língua" }],
          ["sound [on|off]", { en: "toggle sound", pt: "ligar/desligar som" }],
          ["achievements", { en: "list unlocked achievements", pt: "ver conquistas" }],
          ["clear / exit", { en: "clear screen / close", pt: "limpar / fechar" }],
        ].forEach(([c, d]) => say(`  ${c.padEnd(20)} ${t(d)}`));
        break;
      case "whoami":
      case "about":
        say(`${profile.name} — ${profile.role} @ ${profile.company}`, "hl");
        say(t(about.text));
        break;
      case "ls":
      case "projects":
        myProjects.forEach((p) => say(`  [${pad(p.id)}] ${p.title.padEnd(24)} ${t(p.category)}`));
        say(t({ en: "→ open <n>", pt: "→ open <n>" }), "sys");
        break;
      case "open": {
        const n = parseInt(args[0], 10);
        const p = myProjects.find((x) => x.id === n || x.slug === arg);
        if (!p) {
          say(t({ en: "usage: open <1-6>", pt: "uso: open <1-6>" }), "err");
          break;
        }
        say(`OPENING DOSSIER ${pad(p.id)} :: ${p.title.toUpperCase()}`, "hl");
        openTerminal(false);
        setTimeout(() => app.openDossier(p.slug, myProjects.length), 120);
        break;
      }
      case "goto":
      case "cd": {
        const target = navLinks.find((l) => l.id === arg || t(l.label).toLowerCase() === arg);
        if (!target) {
          say(`goto: ${navLinks.map((l) => l.id).join(" | ")}`, "err");
          break;
        }
        say(`→ #${target.id}`, "hl");
        openTerminal(false);
        setTimeout(() => scrollToId(target.id), 120);
        break;
      }
      case "contact":
        say(`→ ${profile.email}`, "hl");
        openTerminal(false);
        setTimeout(() => scrollToId("contact"), 120);
        break;
      case "rebuild":
        app.rebuild();
        say(`REBUILDING… LOOP:${pad(app.loop + 1)}`, "hl");
        if (window.scrollY > 200) setTimeout(() => scrollToId("home"), 120);
        break;
      case "play":
      case "game":
        say("LAUNCHING CUBE_RUNNER…", "hl");
        openTerminal(false);
        setTimeout(() => app.openGame(true), 120);
        break;
      case "theme": {
        const next = arg === "light" || arg === "dark" ? arg : app.theme === "dark" ? "light" : "dark";
        app.setTheme(next);
        say(`THEME=${next.toUpperCase()}`, "hl");
        break;
      }
      case "lang": {
        const next = arg === "pt" || arg === "en" ? arg : app.lang === "pt" ? "en" : "pt";
        app.setLang(next);
        say(`LANG=${next.toUpperCase()}`, "hl");
        break;
      }
      case "sound": {
        const on = arg ? arg === "on" : !app.sound;
        app.setSound(on);
        say(`SOUND=${on ? "ON" : "OFF"}`, "hl");
        break;
      }
      case "achievements": {
        const ids = Object.keys(achievements);
        ids.forEach((id) => {
          const got = app.unlocked.includes(id);
          say(`  [${got ? "✓" : " "}] ${got ? id : "???"}${got ? " — " + t(achievements[id]) : ""}`);
        });
        say(`${app.unlocked.length}/${ids.length}`, "sys");
        break;
      }
      case "sudo":
        say(t({ en: "Nice try. This incident will be reported.", pt: "Boa tentativa. Este incidente será reportado." }), "err");
        break;
      case "rm":
        say(t({ en: "Permission denied. The portfolio is load-bearing.", pt: "Permissão negada. O portfólio é estrutural." }), "err");
        break;
      case "clear":
        setLines([]);
        return;
      case "exit":
      case "quit":
        openTerminal(false);
        return;
      default:
        say(`${cmd}: ${t({ en: "command not found. Try 'help'.", pt: "comando não encontrado. Experimenta 'help'." })}`, "err");
    }
    setLines((prev) => [...prev, { kind: "cmd", text: raw }, ...out]);
  };

  const onKeyDown = (e) => {
    sfx.key();
    if (e.key === "Enter") {
      run(input);
      if (input.trim()) setHistory((h) => [input, ...h].slice(0, 30));
      setInput("");
      setHIdx(-1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const i = Math.min(history.length - 1, hIdx + 1);
      if (history[i] !== undefined) {
        setHIdx(i);
        setInput(history[i]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const i = hIdx - 1;
      setHIdx(Math.max(-1, i));
      setInput(i >= 0 ? history[i] : "");
    } else if (e.key === "Tab") {
      e.preventDefault();
      const m = COMMANDS.filter((c) => c.startsWith(input.trim().toLowerCase()));
      if (m.length === 1) setInput(m[0] + " ");
    }
  };

  const color = { cmd: "text-ink", out: "text-ink-2", sys: "text-mute", hl: "text-ink", err: "text-red-600" };

  return (
    <AnimatePresence>
      {terminalOpen && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Terminal"
          className="fixed inset-x-0 bottom-0 z-[85] border-t border-ink/60 bg-surface/97 backdrop-blur-md sm:inset-x-6 sm:bottom-6 sm:border"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "110%" }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          onClick={() => inputRef.current?.focus()}
        >
          <div className="flex items-center justify-between border-b border-line px-4 py-2">
            <span className="label">TERMINAL:// pt_os — {profile.handle.toLowerCase()}@portfolio</span>
            <button className="label hover:text-ink" onClick={() => openTerminal(false)}>
              [ESC]
            </button>
          </div>
          <div ref={bodyRef} className="h-[38svh] overflow-y-auto px-4 py-3 text-[12px] leading-5 sm:h-[300px]" aria-live="polite">
            {lines.map((l, i) => (
              <pre key={i} className={`whitespace-pre-wrap break-words font-mono ${color[l.kind]}`}>
                {l.kind === "cmd" ? <><span className="text-accent">❯</span> {l.text}</> : l.text}
              </pre>
            ))}
            <div className="flex items-center gap-2">
              <span className="text-accent" aria-hidden="true">
                ❯
              </span>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                className="flex-1 bg-transparent font-mono text-[12px] text-ink outline-none"
                aria-label="Command"
                autoCapitalize="off"
                autoComplete="off"
                spellCheck={false}
              />
            </div>
          </div>
          {/* Atalhos para toque (mobile) */}
          <div className="flex gap-1.5 overflow-x-auto border-t border-line px-4 py-2 sm:hidden">
            {["help", "projects", "play", "rebuild", "theme", "achievements"].map((c) => (
              <button key={c} className="btn-sys shrink-0 !py-1" onClick={() => run(c)}>
                {c}
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
