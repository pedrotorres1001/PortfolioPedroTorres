import Reveal from "./Reveal";
import Scramble from "./Scramble";

export default function SectionHeader({ index, label, title, aside }) {
  return (
    <Reveal className="mb-12 sm:mb-16">
      <div className="flex items-center gap-4">
        <span className="label">[{index}]</span>
        <span className="label">// {label}</span>
        <span className="h-px flex-1 bg-line" aria-hidden="true" />
        {aside && <span className="label hidden sm:inline">{aside}</span>}
      </div>
      <h2 className="title-spaced mt-6 text-lg sm:text-2xl">
        <Scramble text={title} />
      </h2>
    </Reveal>
  );
}
