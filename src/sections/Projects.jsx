import { useMemo, useState } from "react";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "motion/react";
import { myProjects, projectFilters, ui } from "../constants";
import { useApp, useT } from "../state/AppState";
import Reveal from "../components/Reveal";
import Scramble from "../components/Scramble";
import SectionHeader from "../components/SectionHeader";
import sfx from "../lib/sfx";

const pad = (n) => String(n).padStart(2, "0");

function FilterBar({ value, onChange, counts }) {
  const t = useT();
  return (
    <div className="mb-6 flex flex-wrap gap-2" role="tablist" aria-label="Filter projects">
      {projectFilters.map((f) => {
        const active = value === f.id;
        return (
          <button
            key={f.id}
            role="tab"
            aria-selected={active}
            onClick={() => {
              onChange(f.id);
              sfx.click();
            }}
            className={`relative px-3 py-1.5 text-[11px] uppercase tracking-[0.15em] transition-colors ${
              active ? "text-bg" : "text-ink-2 hover:text-ink"
            }`}
          >
            {active && (
              <motion.span
                layoutId="filter-pill"
                className="absolute inset-0 bg-ink"
                transition={{ type: "spring", stiffness: 500, damping: 38 }}
              />
            )}
            <span className="relative">
              [{t(f.label)} <span className={active ? "text-bg/60" : "text-mute"}>{pad(counts[f.id] || 0)}</span>]
            </span>
          </button>
        );
      })}
    </div>
  );
}

function ArchiveRow({ project, onOpen, onHover, active }) {
  const t = useT();
  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8, transition: { duration: 0.15 } }}
      transition={{ type: "spring", stiffness: 420, damping: 40 }}
      className="border-b border-line"
    >
      <button
        type="button"
        data-cursor="OPEN"
        onClick={() => onOpen(project)}
        onMouseEnter={() => {
          onHover(project);
          sfx.hover();
        }}
        onFocus={() => onHover(project)}
        onMouseLeave={() => onHover(null)}
        className={`group relative grid w-full grid-cols-[2.5rem_1fr_auto] items-center gap-4 py-5 text-left transition-colors duration-300 sm:grid-cols-[4rem_1fr_12rem_14rem_2rem] sm:px-3 sm:py-7 ${
          active ? "bg-surface/80" : "hover:bg-surface/60"
        }`}
        aria-haspopup="dialog"
      >
        <span className="label tabular-nums">{pad(project.id)}</span>
        <span className="min-w-0">
          <Scramble
            text={project.title.toUpperCase()}
            className="block truncate text-[13px] tracking-[0.2em] text-ink transition-transform duration-300 group-hover:translate-x-2 sm:text-lg"
          />
          <span className="mt-1 block truncate text-xs text-mute sm:hidden">{t(project.category)}</span>
        </span>
        <span className="label hidden sm:block">{t(project.category)}</span>
        <span className="hidden truncate text-[11px] text-ink-2 sm:block">{project.tags.join(" · ")}</span>
        <span
          className="text-mute transition-all duration-300 group-hover:translate-x-1 group-hover:text-ink"
          aria-hidden="true"
        >
          →
        </span>
      </button>
    </motion.li>
  );
}

/** Fundo da secção: imagem do projeto em hover, em tons de cinza com scanlines. */
function ArchiveBackdrop({ project }) {
  const reduce = useReducedMotion();
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <AnimatePresence>
        {project && !reduce && (
          <motion.div
            key={project.slug}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <img src={project.image} alt="" className="dither h-full w-full object-cover opacity-[0.16]" />
            <div className="scanlines absolute inset-0 opacity-60" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,var(--color-bg)_80%)]" />
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {project && !reduce && (
          <motion.p
            key={`code-${project.slug}`}
            className="label absolute bottom-6 right-6 hidden text-right md:block"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            PREVIEW:// {pad(project.id)}
            <br />
            {project.slug.toUpperCase().replace(/-/g, "_")}.WEBP
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Projects() {
  const t = useT();
  const { openDossier } = useApp();
  const [filter, setFilter] = useState("all");
  const [hovered, setHovered] = useState(null);

  const counts = useMemo(() => {
    const c = { all: myProjects.length };
    myProjects.forEach((p) => (c[p.filter] = (c[p.filter] || 0) + 1));
    return c;
  }, []);
  const visible = filter === "all" ? myProjects : myProjects.filter((p) => p.filter === filter);

  return (
    <section id="projects" className="relative py-20 sm:py-28">
      <ArchiveBackdrop project={hovered} />
      <div className="wrap relative">
        <SectionHeader
          index="03"
          label={t(ui.projectsLabel)}
          title={ui.projectsTitle}
          aside={`${pad(myProjects.length)} ${t(ui.entries)}`}
        />
        <Reveal>
          <LayoutGroup>
            <FilterBar value={filter} onChange={setFilter} counts={counts} />
            <div className="hidden grid-cols-[4rem_1fr_12rem_14rem_2rem] gap-4 border-b border-ink/60 px-3 pb-3 sm:grid">
              {["NO.", "TITLE", "TYPE", "STACK", ""].map((h) => (
                <span key={h} className="label">
                  {h}
                </span>
              ))}
            </div>
            <motion.ul layout className="relative">
              <AnimatePresence mode="popLayout" initial={false}>
                {visible.map((p) => (
                  <ArchiveRow
                    key={p.slug}
                    project={p}
                    active={hovered?.slug === p.slug}
                    onHover={setHovered}
                    onOpen={(proj) => {
                      openDossier(proj.slug, myProjects.length);
                      sfx.open();
                    }}
                  />
                ))}
              </AnimatePresence>
              {visible.length === 0 && <li className="label py-8">{t(ui.noMatch)}</li>}
            </motion.ul>
          </LayoutGroup>
        </Reveal>
      </div>
    </section>
  );
}
