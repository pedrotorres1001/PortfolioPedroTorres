import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring } from "motion/react";
import { bootSequence, education, ui } from "../constants";
import { useT } from "../state/AppState";
import Frame, { LogLine, Rule } from "../components/Frame";
import Reveal from "../components/Reveal";
import SectionHeader from "../components/SectionHeader";

const slug = (s) => s.toUpperCase().replace(/[^A-Z0-9'+]+/g, "_").replace(/^_|_$/g, "");

/** Boot sequence: a barra enche com o scroll e cada etapa "arranca" quando é alcançada. */
function BootSequence() {
  const t = useT();
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 45%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  const [reached, setReached] = useState(reduce ? bootSequence.length : 0);
  const [pct, setPct] = useState(reduce ? 100 : 0);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (reduce) return;
    setPct(Math.round(v * 100));
    setReached(Math.min(bootSequence.length, Math.floor(v * (bootSequence.length - 1) + 1.0001)));
  });

  return (
    <div ref={ref} className="relative mb-16">
      <div className="mb-6 flex items-center justify-between">
        <span className="label">BOOT_SEQUENCE.LOG</span>
        <span className="label tabular-nums">{String(pct).padStart(3, "0")}%</span>
      </div>

      {/* Desktop: horizontal */}
      <div className="relative hidden md:block">
        <div className="absolute inset-x-0 top-[7px] h-px bg-line" />
        <motion.div
          className="absolute inset-x-0 top-[7px] h-px origin-left bg-ink"
          style={{ scaleX: reduce ? 1 : progress }}
        />
        <ol className="relative grid" style={{ gridTemplateColumns: `repeat(${bootSequence.length}, minmax(0, 1fr))` }}>
          {bootSequence.map((s, i) => {
            const on = i < reached;
            const last = i === bootSequence.length - 1;
            return (
              <li key={s.code} className={`pr-4 transition-opacity duration-500 ${on ? "opacity-100" : "opacity-35"}`}>
                <span
                  className={`block size-[15px] border transition-colors duration-300 ${
                    on ? (last ? "border-accent bg-accent" : "border-ink bg-ink") : "border-line bg-bg"
                  }`}
                  aria-hidden="true"
                />
                <p className="label mt-4 tabular-nums">{s.date}</p>
                <p className="mt-1 text-[12px] tracking-[0.18em] text-ink">{s.code}</p>
                <p className="mt-1 text-[12px] leading-5 text-ink-2">{t(s.label)}</p>
                <p className="label mt-2">{on ? "[ OK ]" : "[ .. ]"}</p>
              </li>
            );
          })}
        </ol>
      </div>

      {/* Mobile: vertical, estilo log de arranque */}
      <ol className="relative space-y-4 border-l border-line pl-5 md:hidden">
        <motion.span
          className="absolute -left-px top-0 w-px origin-top bg-ink"
          style={{ height: "100%", scaleY: reduce ? 1 : progress }}
          aria-hidden="true"
        />
        {bootSequence.map((s, i) => {
          const on = i < reached;
          return (
            <li key={s.code} className={`relative transition-opacity duration-500 ${on ? "opacity-100" : "opacity-40"}`}>
              <span
                className={`absolute -left-[25px] top-1 block size-[9px] ${on ? "bg-ink" : "border border-line bg-bg"}`}
                aria-hidden="true"
              />
              <p className="text-[12px] text-ink">
                <span className="text-mute">{on ? "[ OK ]" : "[ .. ]"}</span> {s.date} · {s.code}
              </p>
              <p className="text-[12px] text-ink-2">{t(s.label)}</p>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export default function Education() {
  const t = useT();
  return (
    <section id="education" className="relative py-20 sm:py-28">
      <div className="wrap">
        <SectionHeader index="04" label={t(ui.eduLabel)} title={ui.eduTitle} aside="UNIVERSITY OF AVEIRO" />
        <BootSequence />
        <div className="grid gap-6 md:grid-cols-2">
          {education.map((e, i) => (
            <Reveal key={e.degree.en} delay={i * 0.12}>
              <Frame node={`EDU_${String(education.length - i).padStart(2, "0")}`} title={t(e.degree)} className="h-full">
                <Rule />
                <LogLine k="INSTITUTION">{slug(e.institution)}</LogLine>
                <LogLine k="PERIOD">{e.period}</LogLine>
                <LogLine k="STATUS">{e.status}</LogLine>
                <Rule />
                <div className="space-y-2">
                  {t(e.contents).map((c) => (
                    <p key={c} className="flex gap-3 text-[13px] leading-6 text-ink-2">
                      <span className="text-mute" aria-hidden="true">
                        ›
                      </span>
                      {c}
                    </p>
                  ))}
                </div>
              </Frame>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
