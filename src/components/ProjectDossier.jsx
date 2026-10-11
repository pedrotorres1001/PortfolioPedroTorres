import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { myProjects, ui } from "../constants";
import { useApp, useT } from "../state/AppState";
import Frame, { LogLine, Rule } from "./Frame";
import Scramble from "./Scramble";
import sfx from "../lib/sfx";

const pad = (n) => String(n).padStart(2, "0");

function Bullets({ items }) {
  return (
    <div className="space-y-2">
      {items.map((d) => (
        <p key={d} className="flex gap-3 text-[13px] leading-6 text-ink-2">
          <span className="text-mute" aria-hidden="true">
            ›
          </span>
          {d}
        </p>
      ))}
    </div>
  );
}

/** Widget do itch.io — só é carregado quando o visitante pede. */
function RunBuild({ url }) {
  const t = useT();
  const [run, setRun] = useState(false);
  if (!run) {
    return (
      <div className="border border-dashed border-line p-4">
        <p className="text-[12px] leading-5 text-mute">{t(ui.runBuildNote)}</p>
        <button
          className="btn-sys mt-3"
          onClick={() => {
            setRun(true);
            sfx.open();
          }}
        >
          <Scramble text={ui.runBuild} />
        </button>
      </div>
    );
  }
  return (
    <iframe
      src={url}
      title="itch.io"
      width="552"
      height="167"
      loading="lazy"
      className="block w-full max-w-[552px] border border-line bg-surface"
    />
  );
}

export default function ProjectDossier() {
  const t = useT();
  const { openProject, openDossier } = useApp();
  const project = myProjects.find((p) => p.slug === openProject) || null;
  const closeRef = useRef(null);
  const [img, setImg] = useState(0);

  const close = () => {
    openDossier(null);
    sfx.close();
  };

  // Abrir via URL (#project/slug) e manter o hash sincronizado.
  useEffect(() => {
    const fromHash = () => {
      const m = location.hash.match(/^#project\/([\w-]+)/);
      if (m && myProjects.some((p) => p.slug === m[1])) openDossier(m[1], myProjects.length);
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, [openDossier]);

  useEffect(() => {
    setImg(0);
    if (!project) {
      if (location.hash.startsWith("#project/")) history.replaceState(null, "", "#projects");
      return;
    }
    history.replaceState(null, "", `#project/${project.slug}`);
    const prev = document.activeElement;
    closeRef.current?.focus();
    const onKey = (e) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      prev?.focus?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project?.slug]);

  const images = project ? [project.image, ...project.gallery] : [];
  const idx = project ? myProjects.findIndex((p) => p.slug === project.slug) : -1;
  const go = (d) => {
    const next = myProjects[(idx + d + myProjects.length) % myProjects.length];
    openDossier(next.slug, myProjects.length);
    sfx.click();
  };

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-end justify-center bg-ink/25 p-3 backdrop-blur-sm sm:items-center sm:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={close}
        >
          <motion.div
            key={project.slug}
            role="dialog"
            aria-modal="true"
            aria-labelledby="dossier-title"
            className="max-h-[92svh] w-full max-w-3xl animate-glitch overflow-y-auto"
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 16, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <Frame node={t(project.category).replace(/ /g, "_")} archive={`DOSSIER:// ${pad(project.id)}`}>
              <div className="flex items-start justify-between gap-4">
                <h3 id="dossier-title" className="title-spaced text-sm sm:text-lg">
                  <Scramble text={project.title.toUpperCase()} onMount duration={500} hover={false} />
                </h3>
                <div className="flex shrink-0 gap-2">
                  <button onClick={() => go(-1)} className="btn-sys" aria-label="Previous project">
                    ←
                  </button>
                  <button onClick={() => go(1)} className="btn-sys" aria-label="Next project">
                    →
                  </button>
                  <button ref={closeRef} onClick={close} className="btn-sys">
                    [ESC]
                  </button>
                </div>
              </div>

              <div className="relative mt-5 overflow-hidden border border-line">
                {project.video ? (
                  <video src={project.video} className="aspect-video w-full object-cover" autoPlay muted loop playsInline />
                ) : (
                  <img
                    src={images[img]}
                    alt={`${project.title} — image ${img + 1}`}
                    className="aspect-video w-full object-cover"
                    loading="lazy"
                  />
                )}
                <span className="label absolute left-2 top-2 bg-surface/90 px-2 py-0.5">
                  IMG {pad(img + 1)}/{pad(images.length)}
                </span>
              </div>
              {images.length > 1 && (
                <div className="mt-2 flex gap-2" aria-label={t(ui.gallery)}>
                  {images.map((src, i) => (
                    <button
                      key={src}
                      onClick={() => setImg(i)}
                      className={`h-12 w-20 overflow-hidden border ${i === img ? "border-ink" : "border-line opacity-60"}`}
                      aria-label={`Image ${i + 1}`}
                    >
                      <img src={src} alt="" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              <Rule />
              <p className="label mb-2">{t(ui.overview)}</p>
              <p className="mb-3 text-[13px] leading-6 text-ink">{t(project.description)}</p>
              <Bullets items={t(project.subDescription)} />

              <Rule />
              {project.role && <LogLine k={t(ui.role)}>{t(project.role)}</LogLine>}
              {project.team && (
                <LogLine k={t(ui.team)}>
                  {pad(project.team)} {t(ui.members)}
                </LogLine>
              )}
              <LogLine k={ui.stack}>{project.tags.join(" · ")}</LogLine>

              {project.highlights && (
                <>
                  <Rule />
                  <p className="label mb-2">{t(ui.highlights)}</p>
                  <Bullets items={t(project.highlights)} />
                </>
              )}

              {(project.href || project.embedUrl) && <Rule />}
              {project.embedUrl && (
                <div className="mb-4">
                  <RunBuild key={project.slug} url={project.embedUrl} />
                </div>
              )}
              {project.href && (
                <a href={project.href} target="_blank" rel="noreferrer" className="btn-sys-solid">
                  <Scramble text={project.embedUrl ? t(ui.playItch) : t(ui.openProject)} />
                </a>
              )}
            </Frame>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
