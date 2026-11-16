import { useEffect, useRef } from "react";

/*
  A thin amber line across the very top of the page that fills up
  as you scroll, plus a small "03 / 07 · EDUCATION" counter at the
  bottom-left showing which section you're in.
*/

const SECTIONS = [
  ["hero", "INTRO"],
  ["identity", "IDENTITY"],
  ["about", "ABOUT"],
  ["education", "EDUCATION"],
  ["journey", "JOURNEY"],
  ["projects", "PROJECTS"],
  ["contact", "CONTACT"],
];

function ScrollProgress() {
  const barRef = useRef(null);
  const counterRef = useRef(null);

  useEffect(() => {
    let frame = 0;
    let lastIndex = -1;

    const update = () => {
      frame = 0;

      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? window.scrollY / max : 0;
      barRef.current.style.transform = `scaleX(${progress})`;

      // the current section is the last one whose top has passed the middle of the screen
      let index = 0;
      SECTIONS.forEach(([id], i) => {
        const element = document.getElementById(id);
        if (element && element.getBoundingClientRect().top < window.innerHeight * 0.5) index = i;
      });

      if (index !== lastIndex) {
        lastIndex = index;
        const counter = counterRef.current;
        counter.querySelector("b").textContent = String(index + 1).padStart(2, "0");
        counter.querySelector("em").textContent = SECTIONS[index][1];
        // replay the little flip animation
        counter.classList.remove("is-flipping");
        void counter.offsetWidth;
        counter.classList.add("is-flipping");
      }

      // hidden at the very top so it doesn't distract from the hero
      counterRef.current.classList.toggle("is-shown", progress > 0.02);
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <>
      <div className="scroll-progress" aria-hidden="true">
        <span ref={barRef} />
      </div>

      <p ref={counterRef} className="section-counter" aria-hidden="true">
        <b>01</b> / {String(SECTIONS.length).padStart(2, "0")} · <em>INTRO</em>
      </p>
    </>
  );
}

export default ScrollProgress;
