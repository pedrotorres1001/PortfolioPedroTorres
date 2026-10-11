import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_/#[]<>*+-=";

/**
 * Texto com efeito "scramble": os caracteres baralham-se e vão-se
 * fixando da esquerda para a direita. Corre ao montar (se `onMount`)
 * e sempre que o elemento pai recebe hover (via `trigger`).
 */
export default function Scramble({
  text,
  as: Tag = "span",
  className = "",
  onMount = false,
  duration = 450,
  hover = true,
  ...rest
}) {
  const reduce = useReducedMotion();
  const [out, setOut] = useState(text);
  const raf = useRef(0);

  const run = useCallback(() => {
    if (reduce) return;
    cancelAnimationFrame(raf.current);
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - start) / duration);
      const fixed = Math.floor(p * text.length);
      let s = "";
      for (let i = 0; i < text.length; i++) {
        const c = text[i];
        s += i < fixed || c === " " ? c : GLYPHS[(Math.random() * GLYPHS.length) | 0];
      }
      setOut(s);
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
  }, [text, duration, reduce]);

  useEffect(() => {
    setOut(text);
    if (onMount) run();
    return () => cancelAnimationFrame(raf.current);
  }, [text, onMount, run]);

  return (
    <Tag
      className={className}
      onMouseEnter={hover ? run : undefined}
      onFocus={hover ? run : undefined}
      aria-label={text}
      {...rest}
    >
      <span aria-hidden="true">{out}</span>
    </Tag>
  );
}
