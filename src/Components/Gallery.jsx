import { useState } from "react";
import "./Gallery.css";

// Turns 1 into "01", 2 into "02", and so on
const pad = (number) => String(number).padStart(2, "0");

/*
  A gallery wall that moves by itself:
  the website's pages hang like framed paintings, each with a
  museum-style label, and slowly drift from right to left forever.
  Hovering pauses it and lifts the frame under the mouse.
*/
function Gallery({ name, pieces, speed = 45 }) {
  const [paused, setPaused] = useState(false);

  // The frames are drawn twice, one set after the other.
  // The strip slides left by exactly one set, then starts again,
  // so it looks like it never ends.
  const loop = [...pieces, ...pieces];

  return (
    <div
      className={`project-showcase gallery ${paused ? "is-paused" : ""}`}
      data-reveal
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="gallery-wall">
        <div className="gallery-track" style={{ "--speed": `${speed}s` }}>
          {loop.map((piece, index) => {
            const position = index % pieces.length; // 0 to 4, for both sets
            const isCopy = index >= pieces.length;

            return (
              <figure
                key={index}
                className={`gallery-frame ${position % 2 === 1 ? "is-low" : ""}`}
                aria-hidden={isCopy}
              >
                <div className="gallery-art">
                  <img
                    src={piece.image}
                    alt={isCopy ? "" : `${name} ${piece.title} page`}
                  />
                </div>

                {/* Museum-style label under each frame */}
                <figcaption className="gallery-plaque">
                  <span>NO. {pad(position + 1)}</span>
                  <strong>{piece.title}</strong>
                  <em>{piece.note}</em>
                </figcaption>
              </figure>
            );
          })}
        </div>
      </div>

      <div className="project-controls">
        <span>{pad(pieces.length)} PAGES ON VIEW</span>

        <span className={`browser-status ${paused ? "is-paused" : ""}`}>
          <span className="browser-status-dot" />
          {paused ? "PAUSED" : "NOW SHOWING"}
        </span>
      </div>
    </div>
  );
}

export default Gallery;
