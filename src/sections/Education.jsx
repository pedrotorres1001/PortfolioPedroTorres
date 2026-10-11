import { education, work } from "../constants";
import Frame, { LogLine, Rule } from "../components/Frame";
import Reveal from "../components/Reveal";
import SectionHeader from "../components/SectionHeader";

const slug = (s) => s.toUpperCase().replace(/[^A-Z0-9'+]+/g, "_").replace(/^_|_$/g, "");

/** Linha temporal compacta: educação + entrada na empresa atual. */
function Timeline() {
  const marks = [
    ...education.map((e) => ({ year: Number(e.period.slice(0, 4)), label: slug(e.degree.split(" in ")[0]) })),
    { year: Number(work[0].startDate.slice(0, 4)), label: slug(work[0].company), accent: true },
  ].sort((a, b) => a.year - b.year);
  const min = marks[0].year - 0.6;
  const max = new Date().getFullYear() + 1;
  const pos = (y) => ((y - min) / (max - min)) * 100;

  return (
    <div className="relative mb-14 h-16" aria-hidden="true">
      <div className="absolute inset-x-0 top-6 h-px bg-line" />
      {marks.map((m) => (
        <div key={m.label} className="absolute top-0 -translate-x-1/2" style={{ left: `${pos(m.year)}%` }}>
          <span className="label block text-center">{m.year}</span>
          <span
            className={`mx-auto mt-2 block size-2.5 rounded-full ${m.accent ? "bg-accent" : "bg-ink"}`}
          />
          <span className="label mt-2 hidden whitespace-nowrap text-center sm:block">{m.label}</span>
        </div>
      ))}
      <span className="label absolute right-0 top-0">NOW</span>
    </div>
  );
}

export default function Education() {
  return (
    <section id="education" className="relative py-28 sm:py-36">
      <div className="wrap">
        <SectionHeader index="03" label="EDUCATION" title="TRAINING_LOG" aside="UNIVERSITY OF AVEIRO" />
        <Reveal>
          <Timeline />
        </Reveal>
        <div className="grid gap-6 md:grid-cols-2">
          {education.map((e, i) => (
            <Reveal key={e.degree} delay={i * 0.12}>
              <Frame node={`EDU_${String(education.length - i).padStart(2, "0")}`} title={e.degree} className="h-full">
                <Rule />
                <LogLine k="INSTITUTION">{slug(e.institution)}</LogLine>
                <LogLine k="PERIOD">{e.period}</LogLine>
                <LogLine k="STATUS">{e.status}</LogLine>
                <Rule />
                <div className="space-y-2">
                  {e.contents.map((c) => (
                    <p key={c} className="flex gap-3 text-[13px] leading-6 text-ink-2">
                      <span className="text-mute" aria-hidden="true">›</span>
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
