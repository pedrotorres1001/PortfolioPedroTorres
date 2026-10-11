import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { navLinks, profile } from "../constants";
import Scramble from "../components/Scramble";

function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [ids]);
  return active;
}

const ids = navLinks.map((l) => l.id);

export default function Navbar() {
  const active = useActiveSection(ids);
  const [open, setOpen] = useState(false);

  const links = (onClick) =>
    navLinks.map((l) => (
      <a
        key={l.id}
        href={`#${l.id}`}
        onClick={onClick}
        className={active === l.id ? "btn-sys-solid" : "btn-sys"}
        aria-current={active === l.id ? "true" : undefined}
      >
        <Scramble text={`[${l.label}]`} />
      </a>
    ));

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-8">
        <a href="#home" className="flex items-center gap-4 text-[10px] uppercase tracking-[0.22em] text-ink-2">
          <span className="hidden h-px w-6 bg-mute sm:block" aria-hidden="true" />
          <span>{profile.handle}</span>
          <span className="hidden items-center gap-2 md:flex">
            <span className="size-1.5 animate-pulse-dot rounded-full bg-accent" aria-hidden="true" />
            LINK STABLE
          </span>
          <span className="hidden text-mute lg:inline">[V{profile.version}]</span>
        </a>

        <nav className="hidden gap-2 md:flex" aria-label="Primary">
          {links()}
        </nav>

        <button
          className="btn-sys md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
        >
          {open ? "[CLOSE]" : "[MENU]"}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-nav"
            aria-label="Mobile"
            className="mx-4 flex flex-col gap-2 border border-line bg-surface/95 p-3 backdrop-blur md:hidden"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {links(() => setOpen(false))}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
