import Boot from "./components/Boot";
import Cursor from "./components/Cursor";
import Navbar from "./sections/Navbar";
import Hero from "./sections/Hero";
import About from "./sections/About";
import Work from "./sections/Work";
import Projects from "./sections/Projects";
import Education from "./sections/Education";
import Contact from "./sections/Contact";
import Footer from "./sections/Footer";
import ProjectDossier from "./components/ProjectDossier";
import Overlays from "./components/Overlays";
import SideIndex from "./components/SideIndex";
import Connector from "./components/Connector";
import { useEffect } from "react";
import sfx from "./lib/sfx";

/** Clique curto em qualquer botão ou link (só se o som estiver ligado). */
function useClickSound() {
  useEffect(() => {
    const onClick = (e) => {
      if (e.target.closest?.("a, button")) sfx.click();
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);
}

const App = () => {
  useClickSound();
  return (
  <>
    <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[95] btn-sys-solid">
      Skip to content
    </a>
    <Boot />
    <Cursor />
    <div className="grain animate-grain" aria-hidden="true" />
    <SideIndex />
    <Navbar />
    <main id="main">
      <Hero />
      <About />
      <Connector variant={0} code="BUS_01 → WORK" />
      <Work />
      <Connector variant={1} code="BUS_02 → ARCHIVE" />
      <Projects />
      <Connector variant={2} code="BUS_03 → BOOT_SEQ" />
      <Education />
      <Connector variant={3} code="BUS_04 → CHANNEL" />
      <Contact />
    </main>
    <Footer />
    <ProjectDossier />
    <Overlays />
  </>
  );
};

export default App;
