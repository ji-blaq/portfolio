import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "../utils/motion";

/*
  Custom cursor + magnetic buttons (mouse only, never on phones).
  - a small dot sticks to the mouse, a ring follows with a soft delay
  - both invert the colours under them (mix-blend-mode: difference)
  - over links and buttons the ring swells into a solid circle
  - over project screenshots and the portrait it becomes a big "lens"
  - buttons and links gently pull towards the mouse (magnetic)
*/

const MAGNETIC = [
  ".primary-button",
  ".text-button",
  ".logo",
  ".desktop-nav button",
  ".slider-buttons button",
  ".project-bottom a",
  ".email-link",
  ".socials a",
].join(", ");

const LINKS = "a, button, [role='button'], label, select";
const TYPING = "input, textarea, [contenteditable='true']";
const LENS = ".project-image, .browser-screen, .gallery-wall, .portrait-frame";

function Cursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    const fineMouse = window.matchMedia("(pointer: fine)").matches;
    if (!fineMouse || prefersReducedMotion()) return;

    const root = document.documentElement;
    const dot = dotRef.current;
    const ring = ringRef.current;

    root.classList.add("has-cursor");

    let mouseX = -100;
    let mouseY = -100;
    let ringX = mouseX;
    let ringY = mouseY;
    let shown = false;
    let frame;

    // every magnetic element currently pulled (or settling back)
    const pulled = new Map(); // element -> { x, y, tx, ty }
    let activeMagnet = null;

    const setMode = (mode) => {
      ring.dataset.mode = mode;
      dot.dataset.mode = mode;
    };

    const onMove = (event) => {
      mouseX = event.clientX;
      mouseY = event.clientY;

      if (!shown) {
        shown = true;
        ringX = mouseX;
        ringY = mouseY;
        dot.classList.add("is-shown");
        ring.classList.add("is-shown");
      }

      const target = event.target instanceof Element ? event.target : null;

      // cursor style for what's underneath
      if (target?.closest(TYPING)) setMode("text");
      else if (target?.closest(LINKS)) setMode("link");
      else if (target?.closest(LENS)) setMode("lens");
      else setMode("default");

      // magnetic pull
      const magnet = target?.closest(MAGNETIC) || null;

      if (activeMagnet && activeMagnet !== magnet) {
        const state = pulled.get(activeMagnet);
        if (state) {
          state.tx = 0;
          state.ty = 0;
        }
      }

      activeMagnet = magnet;

      if (magnet) {
        const rect = magnet.getBoundingClientRect();
        const state = pulled.get(magnet) || { x: 0, y: 0, tx: 0, ty: 0 };
        // measure from the button's resting spot, not its pulled spot
        const centreX = rect.left + rect.width / 2 - state.x;
        const centreY = rect.top + rect.height / 2 - state.y;

        state.tx = (mouseX - centreX) * 0.32;
        state.ty = (mouseY - centreY) * 0.4;
        pulled.set(magnet, state);
      }
    };

    const onLeaveWindow = (event) => {
      if (event.relatedTarget) return;
      shown = false;
      dot.classList.remove("is-shown");
      ring.classList.remove("is-shown");
    };

    const onDown = () => ring.classList.add("is-down");
    const onUp = () => ring.classList.remove("is-down");

    const loop = () => {
      // the ring trails behind the dot
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;

      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;

      // move magnetic elements towards their target (or back home)
      pulled.forEach((state, element) => {
        state.x += (state.tx - state.x) * 0.2;
        state.y += (state.ty - state.y) * 0.2;

        const settled =
          element !== activeMagnet &&
          Math.abs(state.x) < 0.1 &&
          Math.abs(state.y) < 0.1;

        if (settled) {
          element.style.translate = "";
          pulled.delete(element);
        } else {
          element.style.translate = `${state.x.toFixed(2)}px ${state.y.toFixed(2)}px`;
        }
      });

      frame = requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.addEventListener("mouseout", onLeaveWindow);
    frame = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("mouseout", onLeaveWindow);
      pulled.forEach((_, element) => {
        element.style.translate = "";
      });
      root.classList.remove("has-cursor");
    };
  }, []);

  return (
    <>
      <div ref={ringRef} className="cursor-ring" data-mode="default" aria-hidden="true" />
      <div ref={dotRef} className="cursor-dot" data-mode="default" aria-hidden="true" />
    </>
  );
}

export default Cursor;
