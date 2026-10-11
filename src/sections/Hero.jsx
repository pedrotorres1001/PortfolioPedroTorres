import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { navLinks, profile, ui, work } from "../constants";
import { useApp, useT } from "../state/AppState";
import Scramble from "../components/Scramble";
import useActiveSection from "../components/useActiveSection";
import useNow, { dotted, elapsedSince } from "../components/useNow";

const HeroScene = lazy(() => import("../components/HeroScene"));

/** Versão estática do cristal, para reduced-motion e enquanto o 3D carrega. */
function StaticCrystal() {
  return (
    <svg viewBox="0 0 400 400" className="absolute left-1/2 top-1/2 w-[min(70vw,520px)] -translate-x-1/2 -translate-y-1/2 opacity-80" aria-hidden="true">
      <g fill="none" style={{ stroke: "var(--color-mute)" }} strokeWidth="0.8">
        <circle cx="200" cy="200" r="175" strokeDasharray="6 10" />
        <circle cx="200" cy="200" r="130" strokeDasharray="4 12" />
      </g>
      <g style={{ stroke: "var(--color-mute)" }} strokeWidth="0.8">
        <polygon points="200,70 300,160 270,300 140,320 95,180" style={{ fill: "var(--color-surface)" }} />
        <polygon points="200,70 210,200 300,160" style={{ fill: "var(--color-line-soft)" }} />
        <polygon points="210,200 270,300 300,160" style={{ fill: "var(--color-line)" }} />
        <polygon points="95,180 210,200 140,320" style={{ fill: "var(--color-line-soft)" }} />
        <polygon points="200,70 95,180 210,200" style={{ fill: "var(--color-bg)" }} />
      </g>
    </svg>
  );
}

function useDeferred(ms = 600) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const id =
      "requestIdleCallback" in window
        ? window.requestIdleCallback(() => setReady(true), { timeout: ms * 2 })
        : setTimeout(() => setReady(true), ms);
    return () => ("cancelIdleCallback" in window ? window.cancelIdleCallback(id) : clearTimeout(id));
  }, [ms]);
  return ready;
}

function useFps() {
  const [fps, setFps] = useState(0);
  useEffect(() => {
    let frames = 0;
    let last = performance.now();
    let raf;
    const tick = (now) => {
      frames++;
      if (now - last >= 500) {
        setFps(Math.round((frames * 1000) / (now - last)));
        frames = 0;
        last = now;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  return fps;
}

const pad = (n) => String(n).padStart(2, "0");
const sign = (v) => (v >= 0 ? "+" : "−") + Math.abs(v).toFixed(2);

function MetaBlock({ loop }) {
  const now = useNow(1000);
  const session = useMemo(() => Math.floor(Math.random() * 0xffff).toString(16).toUpperCase().padStart(4, "0"), []);
  return (
    <div className="space-y-1 text-[10px] uppercase tracking-[0.18em] text-mute sm:text-[11px]">
      <p>
        [USER]: VISITOR_0X{session} · [LOOP{pad(loop)}]
      </p>
      <span className="block h-3 w-3 border-l border-t border-mute" aria-hidden="true" />
      <p className="pt-3 text-ink-2"># MODULE:// PORTFOLIO</p>
      <p>
        LOCATION={profile.location.toUpperCase().replace(", ", "/")} · TZ={profile.timezone.toUpperCase()}
      </p>
      <p className="text-sm normal-case tracking-normal text-ink-2 tabular-nums">{Math.floor(now / 1000)}</p>
      <p className="tabular-nums">
        <time dateTime={now.toISOString()}>{now.toISOString().slice(0, 19)}</time>
      </p>
    </div>
  );
}

function Telemetry({ pointer }) {
  const t = useT();
  const fps = useFps();
  const active = useActiveSection();
  const [cur, setCur] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const id = setInterval(() => setCur({ ...pointer.current }), 100);
    return () => clearInterval(id);
  }, [pointer]);
  const sec = navLinks.find((l) => l.id === active);
  return (
    <p className="label hidden tabular-nums sm:block" aria-hidden="true">
      FPS {pad(fps)} · CUR {sign(cur.x)} {sign(cur.y)} · SEC {t(sec?.label || "HOME")}
      <span className="animate-blink"> _</span>
    </p>
  );
}

function RebuildControl({ busy }) {
  const t = useT();
  const { loop, rebuild } = useApp();
  return (
    <div className="flex flex-col items-end gap-2 text-right">
      <p className="label">
        SCAN:// UNIT_ALPHA · STATUS: <span className={busy ? "text-ink" : ""}>{busy ? "REBUILDING" : "OK"}</span>
      </p>
      <div className="flex items-center gap-3">
        <span className="label tabular-nums">LOOP:{pad(loop)}</span>
        <button onClick={rebuild} className="btn-sys-solid" disabled={busy} aria-label="Rebuild the 3D scene">
          <span aria-hidden="true" className={busy ? "inline-block animate-spin" : "inline-block"}>
            ↻
          </span>
          {busy ? ui.rebuilding : <Scramble text={t(ui.rebuild)} />}
        </button>
      </div>
    </div>
  );
}

function Uptime() {
  const t = useT();
  const now = useNow(60_000);
  const current = work[0];
  const { years, months } = elapsedSince(current.startDate, now);
  const total = years * 12 + months;
  return (
    <div className="ml-auto text-right">
      <span className="ml-auto block h-3 w-3 border-r border-t border-mute" aria-hidden="true" />
      <p className="label mt-3">
        {t(ui.uptime)} @ {current.company.toUpperCase()}:
      </p>
      <p
        className="font-light leading-none text-mute/80 tabular-nums text-[22vw] sm:text-8xl lg:text-[9rem]"
        aria-label={`${total} months at ${current.company}`}
      >
        {pad(total)}
      </p>
      <p className="label">
        {t(ui.months)} · {t(ui.since)} {dotted(current.startDate)}
      </p>
    </div>
  );
}

export default function Hero() {
  const t = useT();
  const { loop, theme, gameOpen, openProject, terminalOpen } = useApp();
  const paused = gameOpen || !!openProject || terminalOpen;
  const reduce = useReducedMotion();
  const ready = useDeferred();
  const show3D = ready && !reduce;
  const sectionRef = useRef(null);
  const pointer = useRef({ x: 0, y: 0 });
  const drag = useRef({ vx: 0, active: false, lastX: 0 });
  const [busy, setBusy] = useState(false);

  // Cursor normalizado (−1…1) relativo ao hero.
  useEffect(() => {
    const move = (e) => {
      const r = sectionRef.current?.getBoundingClientRect();
      if (!r || e.clientY > r.bottom) return;
      pointer.current.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      pointer.current.y = -(((e.clientY - r.top) / r.height) * 2 - 1);
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, []);

  useEffect(() => {
    if (!loop) return;
    setBusy(true);
    const id = setTimeout(() => setBusy(false), 1200);
    return () => clearTimeout(id);
  }, [loop]);

  // Arrastar (rato ou toque) roda o cristal.
  const onDown = (e) => {
    if (e.target.closest("a, button")) return;
    drag.current.active = true;
    drag.current.lastX = e.clientX;
  };
  const onMove = (e) => {
    if (!drag.current.active) return;
    drag.current.vx += (e.clientX - drag.current.lastX) * 0.06;
    drag.current.lastX = e.clientX;
  };
  const onUp = () => (drag.current.active = false);

  return (
    <section
      id="home"
      ref={sectionRef}
      data-cursor="DRAG"
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerLeave={onUp}
      className="relative h-[100svh] min-h-[640px] touch-pan-y select-none overflow-hidden"
    >
      <div className="pointer-events-none absolute inset-0 opacity-55 sm:opacity-100 [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_85%)]">
        {show3D ? (
          <Suspense fallback={<StaticCrystal />}>
            <HeroScene loop={loop} pointer={pointer} drag={drag} theme={theme} paused={paused} />
          </Suspense>
        ) : (
          <StaticCrystal />
        )}
      </div>

      <div className="wrap relative flex h-full flex-col justify-between pb-8 pt-24 sm:pt-28">
        <div className="flex items-start justify-between gap-6">
          <MetaBlock loop={loop} />
          <div className="hidden pt-16 md:block">
            <RebuildControl busy={busy} />
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-xl"
        >
          <p className="label mb-4">[ PORTFOLIO : VER_ {profile.version} ]</p>
          <h1 className="title-spaced text-xl font-normal !tracking-[0.18em] sm:text-4xl sm:!tracking-[0.35em]">
            <Scramble text={`[ ${profile.name.toUpperCase()} ]`} onMount duration={900} />
          </h1>
          <p className="mt-4 text-[11px] uppercase tracking-[0.2em] text-ink-2 sm:text-xs">
            {profile.role} <span className="text-mute">@</span> {profile.company}
          </p>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-ink-2">{t(profile.tagline)}</p>
          <div className="mt-7 flex flex-wrap gap-2">
            <a href="#projects" className="btn-sys-solid">
              <Scramble text={t(ui.viewProjects)} />
            </a>
            <a href="#contact" className="btn-sys">
              <Scramble text={t(ui.getInTouch)} />
            </a>
            {profile.cvUrl && (
              <a href={profile.cvUrl} className="btn-sys" target="_blank" rel="noreferrer" data-cursor="CV">
                <Scramble text={ui.cv} />
              </a>
            )}
            <div className="md:hidden">
              <RebuildControl busy={busy} />
            </div>
          </div>
        </motion.div>

        <div className="flex items-end justify-between gap-6">
          <Telemetry pointer={pointer} />
          <Uptime />
        </div>
      </div>
    </section>
  );
}
