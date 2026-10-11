import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";

/**
 * Ligação de circuito entre duas secções: desenha-se à medida que se faz scroll.
 * `variant` muda o traçado para não ser sempre igual.
 */
const PATHS = [
  { d: "M120 0 V40 H560 V120", node: [560, 120], label: [580, 70] },
  { d: "M880 0 V30 H300 V120", node: [300, 120], label: [320, 70] },
  { d: "M500 0 V60 H760 V120", node: [760, 120], label: [520, 50] },
  { d: "M240 0 V70 H640 V120", node: [640, 120], label: [260, 50] },
];

export default function Connector({ variant = 0, code = "BUS" }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 90%", "end 55%"] });
  const len = useSpring(scrollYProgress, { stiffness: 100, damping: 25 });
  const nodeScale = useTransform(len, [0.85, 1], [0, 1]);
  const p = PATHS[variant % PATHS.length];

  return (
    <div ref={ref} className="wrap relative h-20 sm:h-28" aria-hidden="true">
      <svg viewBox="0 0 1000 120" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        <path d={p.d} fill="none" style={{ stroke: "var(--color-line-soft)" }} strokeWidth="1.2" vectorEffect="non-scaling-stroke" />
        <motion.path
          d={p.d}
          fill="none"
          style={{ stroke: "var(--color-mute)", pathLength: reduce ? 1 : len }}
          strokeWidth="1.2"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <motion.span
        className="absolute size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink"
        style={{ left: `${p.node[0] / 10}%`, top: "100%", scale: reduce ? 1 : nodeScale }}
      />
      <span className="label absolute hidden sm:block" style={{ left: `${p.label[0] / 10}%`, top: `${(p.label[1] / 120) * 100}%` }}>
        {code}
      </span>
    </div>
  );
}
