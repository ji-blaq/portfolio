import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "../utils/motion";
import { isIntroCovering, whenIntroRevealing } from "../utils/intro";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+/<>=$@";

const randomGlyph = () =>
  GLYPHS[Math.floor(Math.random() * GLYPHS.length)];

/*
  "Decrypts" a line of text: characters cycle through random glyphs
  and lock in one by one, left to right.

  - onLoad: start as soon as the page loads (used in the hero)
  - otherwise: start when the text scrolls into view
  - Screen readers always get the real text (sr-only copy).
*/
function Scramble({ text, delay = 0, duration = 900, onLoad = false }) {
  const ref = useRef(null);

  const [display, setDisplay] = useState(text);
  const [started, setStarted] = useState(() => prefersReducedMotion());

  useEffect(() => {
    if (prefersReducedMotion()) return;

    let timeout;
    let interval;

    const run = () => {
      const chars = [...text];

      // each character locks in at its own moment
      const lockAt = chars.map(
        (_, i) => (i / chars.length) * duration + Math.random() * 160
      );

      timeout = setTimeout(() => {
        const start = performance.now();

        setStarted(true);

        interval = setInterval(() => {
          const elapsed = performance.now() - start;
          let done = true;

          const next = chars
            .map((ch, i) => {
              if (ch === " " || elapsed >= lockAt[i]) return ch;

              done = false;
              return randomGlyph();
            })
            .join("");

          setDisplay(next);

          if (done) clearInterval(interval);
        }, 45);
      }, delay);
    };

    const cleanup = () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };

    if (onLoad) {
      // on first load, wait for the intro to reveal the page
      // (plus half a second, so the tiles have cleared away first)
      const waited = isIntroCovering();
      const stopWaiting = whenIntroRevealing(() => {
        if (waited) timeout = setTimeout(run, 500);
        else run();
      });

      return () => {
        stopWaiting();
        cleanup();
      };
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          observer.disconnect();
          run();
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(ref.current);

    return () => {
      observer.disconnect();
      cleanup();
    };
  }, [text, delay, duration, onLoad]);

  return (
    <span ref={ref} className="scramble">
      <span className="sr-only">{text}</span>

      <span
        aria-hidden="true"
        className={started ? "scramble-text is-live" : "scramble-text"}
      >
        {display}
      </span>
    </span>
  );
}

export default Scramble;
