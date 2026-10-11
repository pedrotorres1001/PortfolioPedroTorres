import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { about, profile, ui } from "../constants";
import { useT } from "../state/AppState";
import Frame, { LogLine, Rule } from "../components/Frame";
import Reveal from "../components/Reveal";
import SectionHeader from "../components/SectionHeader";

/** Frase de posicionamento em tamanho grande, a ocupar a largura, com leve parallax. */
function Statement() {
  const t = useT();
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x1 = useTransform(scrollYProgress, [0, 1], ["3%", "-3%"]);
  const x2 = useTransform(scrollYProgress, [0, 1], ["-3%", "3%"]);
  const [day, night] = t(profile.tagline).split(/,\s*/);
  return (
    <div ref={ref} className="wrap overflow-hidden py-6 sm:py-10">
      <p className="sr-only">{t(profile.tagline)}</p>
      <motion.p
        style={reduce ? undefined : { x: x1 }}
        className="whitespace-nowrap text-[clamp(1rem,4.2vw,4.6rem)] font-light uppercase leading-none tracking-[0.06em] text-ink"
        aria-hidden="true"
      >
        {day}
        <span className="text-mute">,</span>
      </motion.p>
      <motion.p
        style={reduce ? undefined : { x: x2 }}
        className="mt-2 whitespace-nowrap text-right text-[clamp(1rem,4.2vw,4.6rem)] font-light uppercase leading-none tracking-[0.06em] text-mute"
        aria-hidden="true"
      >
        {night}
      </motion.p>
    </div>
  );
}

export default function About() {
  const t = useT();
  return (
    <section id="about" className="relative py-20 sm:py-28">
      <div className="wrap">
        <SectionHeader index="01" label={t(ui.aboutLabel)} title={ui.aboutTitle} aside="PID=0001" />
      </div>
      <Statement />
      <div className="wrap mt-10 grid gap-10 lg:grid-cols-12 lg:gap-8">
        <Reveal className="lg:col-span-7">
          <p className="label mb-4">$ cat ./profile.txt</p>
          <p className="text-base leading-8 text-ink-2 sm:text-lg sm:leading-9">{t(about.text)}</p>
        </Reveal>
        <Reveal className="lg:col-span-4 lg:col-start-9" delay={0.12}>
          <Frame node="PROFILE" title="SYSTEM_PROFILE">
            <Rule />
            {about.stats.map((s) => (
              <LogLine key={s.key} k={s.key}>
                {s.value}
              </LogLine>
            ))}
            <Rule />
            <LogLine k="STATUS">
              <span className="mr-1 inline-block size-1.5 animate-pulse-dot rounded-full bg-accent align-middle" aria-hidden="true" />
              ONLINE
            </LogLine>
          </Frame>
        </Reveal>
      </div>
    </section>
  );
}
