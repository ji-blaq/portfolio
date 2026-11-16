import { memo, useEffect, useState } from "react";
import {
  INTRO_TIMES,
  getIntroElapsed,
  getIntroPhase,
  isIntroCovering,
  onIntroPhase,
  setIntroPhase,
} from "../utils/intro";

/*
  The first thing visitors see.
  1. A dark "secure terminal" boots up: lines type out, a big counter runs to 100
  2. Particles (drawn by HeroField) swarm in and build the "OAA." logo
  3. "ACCESS GRANTED"
  4. The dark screen shatters into tiles from the centre outwards,
     the logo explodes, and the particles land as the hero's dot grid.
  Click, tap or press any key to skip.
*/

const BOOT_LINES = [
  { at: 120, text: "establishing secure connection", status: "OK" },
  { at: 420, text: "loading frontend.module", status: "OK" },
  { at: 700, text: "loading communication.module", status: "OK" },
  { at: 980, text: "loading security.module", status: "OK" },
  { at: 1260, text: "encrypting interface", status: "OK" },
  { at: 1650, text: "verifying visitor", status: "..." },
  { at: INTRO_TIMES.granted, text: "visitor verified", status: "✓" },
];

const GRANTED = "ACCESS GRANTED";

// a random-looking session code, e.g. 0x7F3A-91C2
const makeSessionId = () => {
  const part = () =>
    Math.floor(Math.random() * 0xffff)
      .toString(16)
      .toUpperCase()
      .padStart(4, "0");
  return `0x${part()}-${part()}`;
};

// the dark screen is made of square tiles; each gets a delay based on
// how far it is from the centre, so they break away in a wave
function buildTiles() {
  const size = window.innerWidth < 700 ? 64 : 92;
  const cols = Math.ceil(window.innerWidth / size);
  const rows = Math.ceil(window.innerHeight / size);

  const centreX = (cols - 1) / 2;
  const centreY = (rows - 1) / 2;
  const furthest = Math.hypot(centreX, centreY) || 1;

  const tiles = [];

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const distance = Math.hypot(col - centreX, row - centreY) / furthest;
      tiles.push({
        id: `${row}-${col}`,
        delay: Math.round(distance * 560 + Math.random() * 110),
      });
    }
  }

  return { cols, rows, tiles };
}

const easeInOut = (x) => (x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2);

// The tiles never change, so "memo" stops React redrawing all of them
// every time the counter ticks (keeps the intro smooth on cheap phones).
const IntroTiles = memo(function IntroTiles({ grid }) {
  return (
    <div
      className="intro-tiles"
      style={{
        gridTemplateColumns: `repeat(${grid.cols}, 1fr)`,
        gridTemplateRows: `repeat(${grid.rows}, 1fr)`,
      }}
    >
      {grid.tiles.map((tile) => (
        <span key={tile.id} style={{ "--d": `${tile.delay}ms` }} />
      ))}
    </div>
  );
});

function Intro() {
  const [phase, setPhase] = useState(getIntroPhase);
  const [elapsed, setElapsed] = useState(0);
  const [grid] = useState(buildTiles);
  const [session] = useState(makeSessionId);

  // keep this component in sync with the shared intro timeline
  useEffect(() => onIntroPhase(setPhase), []);

  // schedule each phase
  useEffect(() => {
    if (getIntroPhase() === "off") return;

    const at = (time, phaseName) =>
      setTimeout(() => setIntroPhase(phaseName), time - getIntroElapsed());

    const timers = [
      at(INTRO_TIMES.form, "form"),
      at(INTRO_TIMES.granted, "granted"),
      at(INTRO_TIMES.exit, "exit"),
    ];

    return () => timers.forEach(clearTimeout);
  }, []);

  // one animation loop drives the counter and the typing
  useEffect(() => {
    if (!isIntroCovering()) return;

    let frame;

    const tick = () => {
      setElapsed(getIntroElapsed());
      if (isIntroCovering()) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frame);
  }, []);

  // click, tap or any key skips straight to the reveal
  useEffect(() => {
    const skip = () => {
      if (isIntroCovering()) setIntroPhase("exit");
    };

    window.addEventListener("pointerdown", skip);
    window.addEventListener("keydown", skip);

    return () => {
      window.removeEventListener("pointerdown", skip);
      window.removeEventListener("keydown", skip);
    };
  }, []);

  if (phase === "off" || phase === "done") return null;

  const progress = Math.min(elapsed / INTRO_TIMES.granted, 1);
  const count = phase === "boot" || phase === "form" ? Math.round(easeInOut(progress) * 100) : 100;

  return (
    <div className={`intro is-${phase}`} aria-hidden="true">
      {/* the dark screen, as tiles */}
      <IntroTiles grid={grid} />

      <div className="intro-ui">
        <div className="intro-top">
          <div className="intro-boot">
            <p className="intro-title">
              OAA.SYS <span>v2026</span>
            </p>

            {BOOT_LINES.filter((line) => elapsed >= line.at).map((line) => {
              // type each line out, one letter every 16ms
              const typed = Math.floor((elapsed - line.at) / 16);
              const done = typed >= line.text.length;

              return (
                <p key={line.text}>
                  <span className="intro-prompt">&gt;</span> {line.text.slice(0, typed)}
                  {done ? <span className="intro-ok">{line.status}</span> : <span className="intro-caret" />}
                </p>
              );
            })}
          </div>

          <p className="intro-session">
            <span className="intro-dot" />
            SECURE SESSION
            <br />
            <span>{session}</span>
          </p>
        </div>

        <p className="intro-granted">
          {[...GRANTED].map((letter, index) => (
            <span key={index} style={{ "--i": index }}>
              {letter === " " ? " " : letter}
            </span>
          ))}
        </p>

        <div className="intro-bottom">
          <p className="intro-skip">CLICK ANYWHERE TO SKIP</p>

          <p className="intro-count">
            {String(count).padStart(3, "0")}
            <span>%</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Intro;
