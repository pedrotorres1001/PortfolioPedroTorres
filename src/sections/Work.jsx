import { principles, ui, work } from "../constants";
import { useT } from "../state/AppState";
import Circuit from "../components/Circuit";
import Frame, { LogLine, Rule } from "../components/Frame";
import Reveal from "../components/Reveal";
import SectionHeader from "../components/SectionHeader";
import useNow, { elapsedSince, formatMonth } from "../components/useNow";

const slug = (s) => s.toUpperCase().replace(/[^A-Z0-9+]+/g, "_").replace(/^_|_$/g, "");

function RecordLog({ job, now }) {
  const t = useT();
  const { years, months, totalMonths } = elapsedSince(job.startDate, now);
  const tenure = years ? `${years}Y${months ? ` ${months}MO` : ""}` : `${totalMonths}MO`;
  return (
    <Frame node={job.endDate ? "ARCHIVED" : job.node} title="RECORD_LOG">
      <Rule />
      <LogLine k="COMPANY">{slug(job.company)}</LogLine>
      <LogLine k="ROLE">{slug(job.role)}</LogLine>
      <LogLine k="PERIOD">
        {formatMonth(job.startDate)} → {job.endDate ? formatMonth(job.endDate) : "PRESENT"} · TENURE≈{tenure}
      </LogLine>
      <LogLine k="LOCATION">{slug(job.location)}</LogLine>
      <Rule />
      <ul className="space-y-2">
        {t(job.contents).map((c) => (
          <li key={c} className="flex gap-3 text-[13px] leading-6 text-ink-2">
            <span className="text-mute" aria-hidden="true">›</span>
            <span>{c}</span>
          </li>
        ))}
      </ul>
      {job.stack?.length > 0 && (
        <>
          <Rule />
          <LogLine k="STACK">{job.stack.join(" · ")}</LogLine>
        </>
      )}
      <Rule />
      <LogLine k="STATUS">
        {job.endDate ? "CLOSED" : (
          <>
            <span className="mr-1 inline-block size-1.5 animate-pulse-dot rounded-full bg-accent align-middle" aria-hidden="true" />
            ACTIVE
          </>
        )}{" "}
        · {slug(job.role)}
      </LogLine>
    </Frame>
  );
}

export default function Work() {
  const t = useT();
  const now = useNow(60_000);
  return (
    <section id="work" className="relative py-28 sm:py-36">
      <div className="wrap">
        <SectionHeader index="02" label={t(ui.workLabel)} title={ui.workTitle} aside="NODE: PIVOT" />

        <div className="relative grid gap-10 lg:grid-cols-12 lg:gap-6">
          <Circuit
            className="hidden lg:block"
            paths={[
              "M60 0 V260 H330",
              "M0 120 H260 V600",
              "M720 0 V90 H1000",
              "M780 600 V420 H540",
            ]}
            nodes={[
              [330, 260, "solid"],
              [260, 560, "ring"],
              [540, 420, "dim"],
            ]}
          />
          <Reveal className="relative lg:col-span-7 lg:col-start-3">
            {work.map((job) => (
              <RecordLog key={job.company} job={job} now={now} />
            ))}
          </Reveal>

          <Reveal className="relative lg:col-span-4 lg:col-start-8 lg:-mt-6" delay={0.15}>
            <Frame node="VOW" title="VOW">
              <Rule />
              {principles.map((p) => (
                <LogLine key={p.key} k={p.key}>
                  {p.value}
                </LogLine>
              ))}
              <Rule />
            </Frame>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
