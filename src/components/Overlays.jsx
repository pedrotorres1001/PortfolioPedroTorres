import { lazy, Suspense, useCallback, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { achievements, ui } from "../constants";
import { useApp, useT } from "../state/AppState";
import Terminal from "./Terminal";

const CubeRunner = lazy(() => import("./CubeRunner"));

const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];

function useKonami(onDone) {
  useEffect(() => {
    let i = 0;
    const onKey = (e) => {
      const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      i = k === KONAMI[i] ? i + 1 : k === KONAMI[0] ? 1 : 0;
      if (i === KONAMI.length) {
        i = 0;
        onDone();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onDone]);
}

function AchievementToast() {
  const t = useT();
  const { toast } = useApp();
  return (
    <div className="pointer-events-none fixed right-4 top-20 z-[95] sm:right-8" aria-live="polite">
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast}
            className="border border-ink/60 bg-surface px-4 py-3"
            initial={{ x: 40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 40, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <p className="label flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-accent" aria-hidden="true" />
              {t(ui.achievementUnlocked)}
            </p>
            <p className="mt-1 text-[12px] tracking-[0.15em] text-ink">{toast}</p>
            <p className="text-[11px] text-ink-2">{t(achievements[toast])}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Camadas por cima do site: terminal, jogo, conquistas. */
export default function Overlays() {
  const { gameOpen, openGame } = useApp();
  const launch = useCallback(() => openGame(true), [openGame]);
  useKonami(launch);
  return (
    <>
      <Terminal />
      {gameOpen && (
        <Suspense fallback={null}>
          <CubeRunner />
        </Suspense>
      )}
      <AchievementToast />
    </>
  );
}
