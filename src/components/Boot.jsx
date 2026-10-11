import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

const LINES = ["MOUNT /portfolio", "LOAD constants.records", "LINK node::stable", "RECONSTRUCTING"];
const TOTAL_MS = 1200;

/** Ecrã de arranque curto (≤ 1,2 s). Salta com clique ou tecla; não aparece com reduced-motion. */
export default function Boot() {
  const reduce = useReducedMotion();
  const [visible, setVisible] = useState(!reduce);
  const [pct, setPct] = useState(0);

  useEffect(() => {
    if (reduce) return setVisible(false);
    const start = performance.now();
    let raf;
    const tick = (now) => {
      const p = Math.min(1, (now - start) / TOTAL_MS);
      setPct(Math.round(p * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
      else setVisible(false);
    };
    raf = requestAnimationFrame(tick);
    const skip = () => setVisible(false);
    window.addEventListener("keydown", skip);
    window.addEventListener("pointerdown", skip);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", skip);
      window.removeEventListener("pointerdown", skip);
    };
  }, [reduce]);

  const shown = Math.min(LINES.length, Math.floor((pct / 100) * LINES.length) + 1);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="boot"
          className="fixed inset-0 z-[90] flex items-end bg-bg p-6 sm:p-12"
          exit={{ opacity: 0, filter: "blur(6px)" }}
          transition={{ duration: 0.35 }}
          role="status"
          aria-label="Loading portfolio"
        >
          <div className="w-full max-w-md">
            {LINES.slice(0, shown).map((l, i) => (
              <p key={l} className="text-xs text-ink-2">
                <span className="text-mute">{String(i).padStart(2, "0")} ›</span> {l}
                {i === shown - 1 && <span className="animate-blink">_</span>}
              </p>
            ))}
            <div className="mt-4 h-px w-full bg-line">
              <div className="h-px bg-ink" style={{ width: `${pct}%` }} />
            </div>
            <div className="mt-2 flex justify-between">
              <span className="label">{pct}%</span>
              <span className="label">PRESS ANY KEY TO SKIP</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
