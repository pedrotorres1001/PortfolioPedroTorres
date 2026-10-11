import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { profile, work } from "../constants";
import Scramble from "../components/Scramble";
import useNow, { elapsedSince } from "../components/useNow";

const HeroScene = lazy(() => import("../components/HeroScene"));

/** Versão estática do cristal, usada com reduced-motion e enquanto o 3D carrega. */
function StaticCrystal() {
  return (
    <svg viewBox="0 0 400 400" className="absolute left-1/2 top-1/2 w-[min(70vw,520px)] -translate-x-1/2 -translate-y-1/2 opacity-80" aria-hidden="true">
      <g fill="none" stroke="#9a9ca1" strokeWidth="0.8">
        <circle cx="200" cy="200" r="175" strokeDasharray="6 10" />
        <circle cx="200" cy="200" r="130" strokeDasharray="4 12" />
      </g>
      <g stroke="#a3a5aa" strokeWidth="0.8">
        <polygon points="200,70 300,160 270,300 140,320 95,180" fill="#f3f4f6" />
        <polygon points="200,70 210,200 300,160" fill="#e6e8eb" />
        <polygon points="210,200 270,300 300,160" fill="#d9dbdf" />
        <polygon points="95,180 210,200 140,320" fill="#eceef1" />
        <polygon points="200,70 95,180 210,200" fill="#fafafa" />
      </g>
    </svg>
  );
}

/** Carrega a cena 3D só depois do primeiro paint (não atrasa o LCP). */
function useDeferred(ms = 600) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const id = "requestIdleCallback" in window
      ? window.requestIdleCallback(() => setReady(true), { timeout: ms * 2 })
      : setTimeout(() => setReady(true), ms);
    return () => ("cancelIdleCallback" in window ? window.cancelIdleCallback(id) : clearTimeout(id));
  }, [ms]);
  return ready;
}

function MetaBlock() {
  const now = useNow(1000);
  const session = useMemo(() => Math.floor(Math.random() * 0xffff).toString(16).toUpperCase().padStart(4, "0"), []);
  const iso = now.toISOString().slice(0, 19);
  return (
    <div className="space-y-1 text-[10px] uppercase tracking-[0.18em] text-mute sm:text-[11px]">
      <p>[USER]: VISITOR_0X{session}</p>
      <span className="block h-3 w-3 border-l border-t border-mute" aria-hidden="true" />
      <p className="pt-3 text-ink-2"># MODULE:// PORTFOLIO</p>
      <p>LOCATION={profile.location.toUpperCase().replace(", ", "/")} · TZ={profile.timezone.toUpperCase()}</p>
      <p className="text-sm normal-case tracking-normal text-ink-2 tabular-nums">{Math.floor(now / 1000)}</p>
      <p className="tabular-nums">
        <time dateTime={now.toISOString()}>{iso}</time>
      </p>
    </div>
  );
}

function Uptime() {
  const now = useNow(60_000);
  const current = work[0];
  const { years, months } = elapsedSince(current.startDate, now);
  const total = years * 12 + months;
  return (
    <div className="ml-auto text-right">
      <span className="ml-auto block h-3 w-3 border-r border-t border-mute" aria-hidden="true" />
      <p className="label mt-3">UPTIME @ {current.company.toUpperCase()}:</p>
      <p
        className="font-light leading-none text-mute/80 tabular-nums [font-feature-settings:'zero'] text-[22vw] sm:text-8xl lg:text-[9rem]"
        aria-label={`${total} months at ${current.company}`}
      >
        {String(total).padStart(2, "0")}
      </p>
      <p className="label">MONTHS · SINCE {current.startDate.replace("-", ".")}</p>
    </div>
  );
}

export default function Hero() {
  const reduce = useReducedMotion();
  const ready = useDeferred();
  const show3D = ready && !reduce;

  return (
    <section id="home" className="relative h-[100svh] min-h-[640px] overflow-hidden">
      <div className="pointer-events-none absolute inset-0 opacity-55 sm:opacity-100 [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_85%)]">
        {show3D ? (
          <Suspense fallback={<StaticCrystal />}>
            <HeroScene />
          </Suspense>
        ) : (
          <StaticCrystal />
        )}
      </div>

      <div className="wrap relative flex h-full flex-col justify-between pb-8 pt-24 sm:pt-28">
        <MetaBlock />

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
          <p className="mt-5 max-w-md text-sm leading-relaxed text-ink-2">{profile.tagline}</p>
          <div className="mt-7 flex flex-wrap gap-2">
            <a href="#projects" className="btn-sys-solid">
              <Scramble text="[VIEW PROJECTS]" />
            </a>
            <a href="#contact" className="btn-sys">
              <Scramble text="[GET IN TOUCH]" />
            </a>
          </div>
        </motion.div>

        <div className="flex items-end justify-between gap-6">
          <p className="label hidden sm:block">
            SCROLL ↓ <span className="animate-blink">_</span>
          </p>
          <Uptime />
        </div>
      </div>
    </section>
  );
}
