import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Lock, MousePointer2 } from "lucide-react";

// Turns 1 into "01", 2 into "02", and so on
const pad = (number) => String(number).padStart(2, "0");

/*
  A small browser window that "uses" the website by itself:
  1. the cursor glides to the next tab and clicks it
  2. the address bar types the new page's URL
  3. a loading line runs across, then the new page wipes in
  Hovering pauses it. Visitors can also click any tab themselves.
*/
function BrowserDemo({ name, domain, pages, interval = 4500 }) {
  const [current, setCurrent] = useState(0);
  const [previous, setPrevious] = useState(null);
  const [paused, setPaused] = useState(false);
  const [chars, setChars] = useState(pages[0].path.length);

  const tabRefs = useRef([]);
  const cursorRef = useRef(null);

  const path = pages[current].path;

  // Switch to a page (used by the autoplay and by clicks)
  const goTo = (index) => {
    if (index === current) return;
    setPrevious(current);
    setCurrent(index);
    setChars(0); // start typing the new URL from scratch
  };

  // Autoplay: go to the next page after "interval" milliseconds.
  // Stops while the visitor is hovering.
  useEffect(() => {
    if (paused) return;

    const timer = setTimeout(() => {
      setPrevious(current);
      setCurrent((current + 1) % pages.length);
      setChars(0);
    }, interval);

    return () => clearTimeout(timer);
  }, [current, paused, interval, pages.length]);

  // Typing effect: add one letter of the URL at a time
  useEffect(() => {
    if (chars >= path.length) return;

    // wait for the cursor to "click" before typing the first letter
    const delay = chars === 0 ? 450 : 40;
    const timer = setTimeout(() => setChars((count) => count + 1), delay);

    return () => clearTimeout(timer);
  }, [chars, path]);

  // Move the fake cursor to the middle of the active tab
  useLayoutEffect(() => {
    const moveCursor = () => {
      const tab = tabRefs.current[current];
      const cursor = cursorRef.current;
      if (!tab || !cursor) return;

      const x = tab.offsetLeft + tab.offsetWidth / 2;
      const y = tab.offsetTop + tab.offsetHeight / 2;
      cursor.style.transform = `translate(${x}px, ${y}px)`;
    };

    moveCursor();
    window.addEventListener("resize", moveCursor);
    document.fonts?.ready.then(moveCursor); // re-measure once fonts load

    return () => window.removeEventListener("resize", moveCursor);
  }, [current]);

  return (
    <div
      className="project-showcase browser-demo"
      data-reveal
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="browser">
        {/* Top row: window dots + one tab per page */}
        <div className="browser-top">
          <div className="browser-dots" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>

          <div className="browser-tabs">
            {pages.map((page, index) => (
              <button
                key={page.path}
                ref={(element) => {
                  tabRefs.current[index] = element;
                }}
                className={`browser-tab ${index === current ? "is-active" : ""}`}
                onClick={() => goTo(index)}
              >
                {page.label}
              </button>
            ))}

            {/* The fake cursor */}
            <span className="browser-cursor" ref={cursorRef} aria-hidden="true">
              <MousePointer2 size={16} fill="#1a1d23" color="#ffffff" strokeWidth={1.5} />
              <span key={current} className="browser-click" />
            </span>
          </div>
        </div>

        {/* Address bar */}
        <div className="browser-bar">
          <Lock size={11} />
          <span className="browser-url">
            {domain}
            <span className="browser-path">{path.slice(0, chars)}</span>
          </span>
          <span className="browser-caret" />
          <span key={current} className="browser-loading" />
        </div>

        {/* The page screenshots, stacked on top of each other */}
        <div className="browser-screen">
          {pages.map((page, index) => {
            let state = "";
            if (index === current) state = "is-current";
            else if (index === previous) state = "is-previous";

            return (
              <img
                key={page.path}
                src={page.image}
                alt={`${name} ${page.label} page`}
                className={`browser-page ${state}`}
              />
            );
          })}
        </div>
      </div>

      {/* Thin line that fills up until the next page */}
      <div className="browser-timeline">
        <span
          key={`${current}-${paused}`}
          className={paused ? "" : "is-running"}
          style={{ "--duration": `${interval}ms` }}
        />
      </div>

      <div className="project-controls">
        <span>
          {pad(current + 1)} / {pages[current].label.toUpperCase()}
        </span>

        <span className={`browser-status ${paused ? "is-paused" : ""}`}>
          <span className="browser-status-dot" />
          {paused ? "PAUSED" : "AUTO-PLAYING"}
        </span>
      </div>
    </div>
  );
}

export default BrowserDemo;
