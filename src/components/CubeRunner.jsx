import { useEffect, useRef, useState } from "react";
import { useApp } from "../state/AppState";
import sfx from "../lib/sfx";

/**
 * CUBE_RUNNER — mini-jogo escondido. Saltar por cima dos cubos.
 * Espaço / ↑ / toque para saltar. Esc para sair.
 */
const W = 720;
const H = 240;
const GROUND = 196;

function cssVar(name, fallback) {
  try {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
  } catch {
    return fallback;
  }
}

function bestScore(set) {
  try {
    if (set !== undefined) localStorage.setItem("pt:runner-best", String(set));
    return Number(localStorage.getItem("pt:runner-best") || 0);
  } catch {
    return 0;
  }
}

export default function CubeRunner() {
  const { openGame, unlock } = useApp();
  const canvasRef = useRef(null);
  const state = useRef(null);
  const [hud, setHud] = useState({ score: 0, best: bestScore(), over: false, started: false });

  const reset = () => {
    state.current = {
      y: GROUND, vy: 0, t: 0, speed: 300, score: 0, spawn: 0.9, obstacles: [], particles: [], over: false, started: true,
    };
    setHud((h) => ({ ...h, score: 0, over: false, started: true }));
  };

  const jump = () => {
    const s = state.current;
    if (!s || s.over) {
      reset();
      return;
    }
    if (s.y >= GROUND - 0.5) {
      s.vy = -620;
      sfx.jump();
    }
  };

  useEffect(() => {
    const cvs = canvasRef.current;
    const ctx = cvs.getContext("2d");
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    cvs.width = W * dpr;
    cvs.height = H * dpr;
    ctx.scale(dpr, dpr);
    const ink = cssVar("--color-ink", "#1c1c1e");
    const mute = cssVar("--color-mute", "#8a8c91");
    const line = cssVar("--color-line", "#b9bbc0");
    const accent = cssVar("--color-accent", "#22c55e");

    let raf;
    let last = performance.now();
    const loop = (now) => {
      const d = Math.min(0.05, (now - last) / 1000);
      last = now;
      const s = state.current;
      ctx.clearRect(0, 0, W, H);

      // chão e grelha a passar
      ctx.strokeStyle = line;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, GROUND + 18);
      ctx.lineTo(W, GROUND + 18);
      ctx.stroke();
      const off = s ? (s.t * s.speed) % 40 : 0;
      ctx.fillStyle = line;
      for (let x = -off; x < W; x += 40) ctx.fillRect(x, GROUND + 24, 12, 1);

      if (s && s.started) {
        if (!s.over) {
          s.t += d;
          s.speed += d * 9;
          s.vy += 1800 * d;
          s.y = Math.min(GROUND, s.y + s.vy * d);
          if (s.y >= GROUND) s.vy = 0;
          s.spawn -= d;
          if (s.spawn <= 0) {
            const h = 16 + Math.random() * 28;
            const stack = Math.random() < 0.25 ? 2 : 1;
            s.obstacles.push({ x: W + 20, w: 18 + Math.random() * 10, h: h * stack });
            s.spawn = Math.max(0.55, 1.3 - s.t * 0.02) + Math.random() * 0.6;
          }
          s.obstacles.forEach((o) => (o.x -= s.speed * d));
          const before = s.obstacles.length;
          s.obstacles = s.obstacles.filter((o) => o.x + o.w > -10);
          s.score += before - s.obstacles.length;

          // colisão (jogador 18×18 em x=80)
          const px = 80, py = s.y, ps = 18;
          for (const o of s.obstacles) {
            if (px + ps - 3 > o.x && px + 3 < o.x + o.w && py + 18 > GROUND + 18 - o.h) {
              s.over = true;
              sfx.hit();
              for (let i = 0; i < 18; i++)
                s.particles.push({ x: px + 9, y: py + 9, vx: (Math.random() - 0.5) * 400, vy: -Math.random() * 400, life: 1 });
              const best = Math.max(bestScore(), s.score);
              bestScore(best);
              if (s.score >= 20) unlock("HIGH_SCORE");
              setHud({ score: s.score, best, over: true, started: true });
              break;
            }
          }
          if (!s.over && Math.floor(s.t * 10) % 3 === 0) setHud((h) => (h.score === s.score ? h : { ...h, score: s.score }));
        }

        // obstáculos (cubos com face superior)
        s.obstacles.forEach((o) => {
          const top = GROUND + 18 - o.h;
          ctx.fillStyle = mute;
          ctx.fillRect(o.x, top, o.w, o.h);
          ctx.fillStyle = line;
          ctx.beginPath();
          ctx.moveTo(o.x, top);
          ctx.lineTo(o.x + 6, top - 6);
          ctx.lineTo(o.x + o.w + 6, top - 6);
          ctx.lineTo(o.x + o.w, top);
          ctx.fill();
        });

        // jogador
        if (!s.over) {
          ctx.save();
          ctx.translate(89, s.y + 9);
          ctx.rotate(s.y < GROUND ? s.t * 10 : 0);
          ctx.fillStyle = ink;
          ctx.fillRect(-9, -9, 18, 18);
          ctx.fillStyle = accent;
          ctx.fillRect(-3, -3, 6, 6);
          ctx.restore();
        }
        s.particles.forEach((p) => {
          p.vy += 900 * d;
          p.x += p.vx * d;
          p.y += p.vy * d;
          p.life -= d;
          ctx.fillStyle = ink;
          ctx.globalAlpha = Math.max(0, p.life);
          ctx.fillRect(p.x, p.y, 4, 4);
          ctx.globalAlpha = 1;
        });
        s.particles = s.particles.filter((p) => p.life > 0);
      } else {
        ctx.fillStyle = ink;
        ctx.fillRect(80, GROUND, 18, 18);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const onKey = (e) => {
      if (e.key === "Escape") openGame(false);
      if (e.code === "Space" || e.key === "ArrowUp" || e.key === "w") {
        e.preventDefault();
        jump();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="fixed inset-0 z-[88] flex items-center justify-center bg-bg p-3" onClick={() => openGame(false)}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="CUBE_RUNNER mini game"
        className="w-full max-w-3xl animate-glitch border border-ink/60 bg-surface p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between gap-4">
          <span className="label">GAME:// CUBE_RUNNER</span>
          <span className="label tabular-nums">
            SCORE {String(hud.score).padStart(3, "0")} · BEST {String(hud.best).padStart(3, "0")}
          </span>
          <button className="btn-sys" onClick={() => openGame(false)}>
            [ESC]
          </button>
        </div>
        <div className="relative">
          <canvas
            ref={canvasRef}
            onPointerDown={jump}
            className="block aspect-[3/1] w-full touch-none border border-line bg-bg"
            aria-label="Press space or tap to jump"
          />
          {(!hud.started || hud.over) && (
            <button onClick={jump} className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center">
              <span className="title-spaced text-sm">{hud.over ? "SYSTEM_CRASH" : "CUBE_RUNNER"}</span>
              <span className="label">{hud.over ? "SPACE / TAP TO RETRY" : "SPACE / ↑ / TAP TO JUMP"}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
