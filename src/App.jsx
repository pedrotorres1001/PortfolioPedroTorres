import Boot from "./components/Boot";
import Cursor from "./components/Cursor";
import Navbar from "./sections/Navbar";
import Hero from "./sections/Hero";

const App = () => (
  <>
    <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[95] btn-sys-solid">
      Skip to content
    </a>
    <Boot />
    <Cursor />
    <Navbar />
    <main id="main">
      <Hero />
    </main>
  </>
);

export default App;
