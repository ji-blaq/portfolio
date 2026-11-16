import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "../utils/motion";

/*
  Two tapes crossing each other like a big "×" between the hero and the
  next section. They scroll on their own, and when you scroll the page
  they speed up, lean (skew) with the speed, and flip direction when you
  scroll back up.
*/

const FRONT = ["FRONTEND", "COMMUNICATION", "SECURITY"];
const BACK = ["BUILDING WITH INTENT", "CLEAR", "USEFUL", "SAFE TO TRUST"];

function TapeText({ words, mark }) {
  // the words twice in a row, so the loop has no visible seam
  return [0, 1].map((copy) => (
    <span className="marquee-copy" key={copy}>
      {[...words, ...words].map((word, index) => (
        <span key={index}>
          {word}
          <i>{mark}</i>
        </span>
      ))}
    </span>
  ));
}

function Marquee() {
  const sectionRef = useRef(null);
  const frontRef = useRef(null);
  const backRef = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const front = frontRef.current;
    const back = backRef.current;

    let frontX = 0;
    let backX = 0;
    let lastScroll = window.scrollY;
    let velocity = 0;
    let direction = 1;
    let frame;
    let running = false;

    // wrap the position so the tape loops forever
    const wrap = (x, width) => {
      if (width <= 0) return x;
      if (x <= -width) return x + width;
      if (x > 0) return x - width;
      return x;
    };

    const loop = () => {
      const scroll = window.scrollY;
      const delta = scroll - lastScroll;
      lastScroll = scroll;

      velocity += (delta - velocity) * 0.12;
      if (velocity > 0.6) direction = 1;
      if (velocity < -0.6) direction = -1;

      const boost = Math.min(Math.abs(velocity) * 0.35, 18);
      const skew = Math.max(-14, Math.min(14, velocity * -0.45));

      frontX = wrap(frontX - (1.1 + boost) * direction, front.firstChild.offsetWidth);
      backX = wrap(backX + (0.8 + boost * 0.8) * direction, back.firstChild.offsetWidth);

      front.style.transform = `translate3d(${frontX}px, 0, 0) skewX(${skew}deg)`;
      back.style.transform = `translate3d(${backX}px, 0, 0) skewX(${-skew}deg)`;

      frame = requestAnimationFrame(loop);
    };

    // only run while the tapes are on screen
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !running) {
        running = true;
        lastScroll = window.scrollY;
        frame = requestAnimationFrame(loop);
      } else if (!entry.isIntersecting && running) {
        running = false;
        cancelAnimationFrame(frame);
      }
    });

    observer.observe(sectionRef.current);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section ref={sectionRef} className="marquee" aria-hidden="true">
      <div className="marquee-tape tape-back">
        <div ref={backRef} className="marquee-track">
          <TapeText words={BACK} mark="✦" />
        </div>
      </div>

      <div className="marquee-tape tape-front">
        <div ref={frontRef} className="marquee-track">
          <TapeText words={FRONT} mark="×" />
        </div>
      </div>
    </section>
  );
}

export default Marquee;
