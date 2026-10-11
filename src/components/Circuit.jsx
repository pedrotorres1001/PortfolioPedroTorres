import { motion, useReducedMotion } from "motion/react";

/**
 * Linhas de circuito com nós, desenhadas quando entram no ecrã.
 * `paths`: strings "d" num viewBox 0 0 1000 600; `nodes`: [x, y, tipo].
 */
export default function Circuit({ paths, nodes = [], className = "" }) {
  const reduce = useReducedMotion();
  const draw = reduce
    ? {}
    : {
        initial: { pathLength: 0 },
        whileInView: { pathLength: 1 },
        viewport: { once: true, margin: "-100px" },
      };
  return (
    <svg
      viewBox="0 0 1000 600"
      preserveAspectRatio="none"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      aria-hidden="true"
    >
      {paths.map((d, i) => (
        <motion.path
          key={d}
          d={d}
          fill="none"
          stroke={i % 2 ? "#b9bbc0" : "#8a8c91"}
          strokeWidth="1.2"
          vectorEffect="non-scaling-stroke"
          {...draw}
          transition={{ duration: 1.4, delay: i * 0.15, ease: "easeInOut" }}
        />
      ))}
      {nodes.map(([x, y, type], i) => (
        <motion.circle
          key={i}
          cx={x}
          cy={y}
          r={type === "ring" ? 9 : 7}
          fill={type === "ring" ? "none" : type === "dim" ? "#2b2b2e" : "#111113"}
          stroke={type === "ring" ? "#b9bbc0" : "none"}
          strokeWidth="1.2"
          vectorEffect="non-scaling-stroke"
          initial={reduce ? false : { scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.9 + i * 0.1 }}
          style={{ transformOrigin: `${x}px ${y}px`, transformBox: "fill-box" }}
        />
      ))}
    </svg>
  );
}
