import { useEffect, useState } from "react";
import { navLinks } from "../constants";

const ids = navLinks.map((l) => l.id);

/** Secção atualmente a meio do ecrã. */
export default function useActiveSection() {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    const observeAll = () =>
      ids.forEach((id) => {
        const el = document.getElementById(id);
        if (el) obs.observe(el);
      });
    observeAll();
    const t = setTimeout(observeAll, 500); // secções carregadas depois
    return () => {
      clearTimeout(t);
      obs.disconnect();
    };
  }, []);
  return active;
}
