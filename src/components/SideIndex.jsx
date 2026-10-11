import { motion, useScroll, useSpring } from "motion/react";
import { navLinks } from "../constants";
import { useT } from "../state/AppState";
import useActiveSection from "./useActiveSection";

/** Índice lateral fixo [00]–[05] com progresso de scroll (só em ecrãs largos). */
export default function SideIndex() {
  const t = useT();
  const active = useActiveSection();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30 });
  const current = navLinks.find((l) => l.id === active);

  return (
    <nav
      aria-label="Section index"
      className="fixed left-3 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-center gap-4 lg:flex xl:left-5"
    >
      <div className="relative h-24 w-px bg-line" aria-hidden="true">
        <motion.div className="absolute inset-x-0 top-0 h-full origin-top bg-ink" style={{ scaleY: progress }} />
      </div>
      <ul className="flex flex-col items-center gap-2">
        {navLinks.map((l, i) => {
          const on = l.id === active;
          return (
            <li key={l.id}>
              <a
                href={`#${l.id}`}
                aria-current={on ? "true" : undefined}
                className={`block px-1 text-[10px] tabular-nums tracking-[0.1em] transition-colors ${
                  on ? "text-ink" : "text-mute hover:text-ink"
                }`}
              >
                {on ? `[${String(i).padStart(2, "0")}]` : String(i).padStart(2, "0")}
                <span className="sr-only"> {t(l.label)}</span>
              </a>
            </li>
          );
        })}
      </ul>
      <p className="label mt-2 [writing-mode:vertical-rl]" aria-hidden="true">
        {"// "}
        {t(current?.label || "")}
      </p>
    </nav>
  );
}
