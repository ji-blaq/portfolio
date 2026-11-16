import "./App.css";
import "./effects.css";

import Navbar from "./Components/Navbar";
import Hero from "./Components/Hero";
import Identity from "./Components/Identity";
import About from "./Components/About";
import Education from "./Components/Education";
import Journey from "./Components/Journey";
import Work from "./Components/Work";
import Contact from "./Components/Contact";
import Intro from "./Components/Intro";
import Cursor from "./Components/Cursor";
import Marquee from "./Components/Marquee";
import ScrollProgress from "./Components/ScrollProgress";
import useReveal from "./hooks/useReveal";

function App() {
  useReveal();

  return (
    <div className="portfolio">
      <Intro />
      <Cursor />
      <ScrollProgress />
      <Navbar />

      <main>
        <Hero />
        <Marquee />
        <Identity />
        <About />
        <Education />
        <Journey />
        <Work />
        <Contact/>
      </main>
    </div>
  );
}

export default App;
