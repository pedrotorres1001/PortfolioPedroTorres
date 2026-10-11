import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { myProjects } from "../constants";
import Frame, { LogLine, Rule } from "../components/Frame";
import Reveal from "../components/Reveal";
import Scramble from "../components/Scramble";
import SectionHeader from "../components/SectionHeader";

const pad = (n) => String(n).padStart(2, "0");

function ProjectRow({ project, index, onOpen, onHover }) {
  return (
    <li className="border-b border-line">
      <button
        type="button"
        onClick={() => onOpen(project)}
        onMouseEnter={() => onHover(project)}
        onMouseLeave={() => onHover(null)}
        onFocus={() => onHover(null)}
        className="group grid w-full grid-cols-[2.5rem_1fr_auto] items-center gap-4 py-5 text-left transition-colors duration-300 hover:bg-surface/70 sm:grid-cols-[4rem_1fr_12rem_14rem_2rem] sm:px-3 sm:py-6"
        aria-haspopup="dialog"
      >
        <span className="label tabular-nums">{pad(index + 1)}</span>
        <span className="min-w-0">
          <Scramble
            text={project.title.toUpperCase()}
            className="block truncate text-[13px] tracking-[0.2em] text-ink transition-transform duration-300 group-hover:translate-x-2 sm:text-base"
          />
          <span className="mt-1 block truncate text-xs text-mute sm:hidden">{project.category}</span>
        </span>
        <span className="label hidden sm:block">{project.category}</span>
        <span className="hidden truncate text-[11px] text-ink-2 sm:block">{project.tags.join(" · ")}</span>
        <span className="text-mute transition-all duration-300 group-hover:translate-x-1 group-hover:text-ink" aria-hidden="true">
          →
        </span>
      </button>
    </li>
  );
}

function ProjectPanel({ project, onClose }) {
  const closeRef = useRef(null);
  useEffect(() => {
    if (!project) return;
    const prev = document.activeElement;
    closeRef.current?.focus();
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      prev?.focus?.();
    };
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-end justify-center bg-ink/20 p-3 backdrop-blur-sm sm:items-center sm:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-title"
            className="max-h-[92svh] w-full max-w-2xl overflow-y-auto"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <Frame node={project.category.replace(/ /g, "_")} archive={`PROJECT:// ${pad(project.id)}`}>
              <div className="flex items-start justify-between gap-4">
                <h3 id="project-title" className="title-spaced text-sm sm:text-base">
                  {project.title}
                </h3>
                <button ref={closeRef} onClick={onClose} className="btn-sys shrink-0">
                  [ESC]
                </button>
              </div>
              <img
                src={project.image}
                alt={`${project.title} screenshot`}
                className="mt-5 aspect-[16/9] w-full border border-line object-cover grayscale-[35%]"
                loading="lazy"
              />
              <Rule />
              <p className="text-[13px] leading-6 text-ink">{project.description}</p>
              <div className="mt-3 space-y-2">
                {project.subDescription.map((d) => (
                  <p key={d} className="flex gap-3 text-[13px] leading-6 text-ink-2">
                    <span className="text-mute" aria-hidden="true">›</span>
                    {d}
                  </p>
                ))}
              </div>
              <Rule />
              <LogLine k="STACK">{project.tags.join(" · ")}</LogLine>
              {project.href && (
                <a href={project.href} target="_blank" rel="noreferrer" className="btn-sys-solid mt-5">
                  <Scramble text="[OPEN PROJECT ↗]" />
                </a>
              )}
            </Frame>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function Projects() {
  const reduce = useReducedMotion();
  const [hovered, setHovered] = useState(null);
  const [open, setOpen] = useState(null);
  const close = useCallback(() => setOpen(null), []);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { damping: 22, stiffness: 180 });
  const sy = useSpring(y, { damping: 22, stiffness: 180 });

  const onMove = (e) => {
    x.set(e.clientX + 24);
    y.set(e.clientY - 90);
  };

  return (
    <section id="projects" className="relative py-28 sm:py-36" onMouseMove={onMove}>
      <div className="wrap">
        <SectionHeader index="02" label="SELECTED WORK" title="PROJECT_INDEX" aside={`${pad(myProjects.length)} ENTRIES`} />
        <Reveal>
          <div className="hidden grid-cols-[4rem_1fr_12rem_14rem_2rem] gap-4 border-b border-ink/60 px-3 pb-3 sm:grid">
            {["NO.", "TITLE", "TYPE", "STACK", ""].map((h) => (
              <span key={h} className="label">{h}</span>
            ))}
          </div>
          <ul>
            {myProjects.map((p, i) => (
              <ProjectRow key={p.id} project={p} index={i} onOpen={setOpen} onHover={setHovered} />
            ))}
          </ul>
        </Reveal>
      </div>

      {/* Pré-visualização a seguir o cursor (só em desktop) */}
      <AnimatePresence>
        {hovered && !reduce && (
          <motion.div
            key={hovered.id}
            className="pointer-events-none fixed left-0 top-0 z-40 hidden w-72 border border-ink/60 bg-surface p-1.5 md:block"
            style={{ x: sx, y: sy }}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.18 }}
          >
            <img src={hovered.image} alt="" className="aspect-[16/10] w-full object-cover" />
            <p className="label mt-1.5 flex justify-between px-1">
              <span>PREVIEW://</span>
              <span>{pad(hovered.id)}</span>
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <ProjectPanel project={open} onClose={close} />
    </section>
  );
}
