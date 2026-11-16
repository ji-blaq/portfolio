/*
  The intro "conductor".
  One shared timeline that the intro screen, the hero particles,
  the hero text and the decrypt effect all follow.

  Phases, in order:
    off      -> no intro (reduced motion)
    boot     -> dark screen, boot lines typing, counter running
    form     -> particles fly in and build the "OAA." logo
    granted  -> "ACCESS GRANTED"
    exit     -> the screen breaks into tiles and the site is revealed
    done     -> intro finished, normal site
*/

const ORDER = ["off", "boot", "form", "granted", "exit", "done"];

// when each phase starts (milliseconds after the page opens)
export const INTRO_TIMES = {
  form: 1350,
  granted: 2650,
  exit: 3350,
};

// how long the tile break-up lasts before the intro is fully gone
export const EXIT_DURATION = 1300;

const state = {
  phase: "off",
  startedAt: 0,
};

export function getIntroPhase() {
  return state.phase;
}

export function getIntroElapsed() {
  return performance.now() - state.startedAt;
}

// true while the dark intro screen still covers the site
export function isIntroCovering() {
  return ["boot", "form", "granted"].includes(state.phase);
}

export function startIntro() {
  state.phase = "boot";
  state.startedAt = performance.now();

  const root = document.documentElement;
  root.classList.add("intro-playing", "intro-cover");

  // always open the intro at the top of the page
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  window.scrollTo(0, 0);
}

// Phases only ever move forward, so a late timer can't rewind the intro.
export function setIntroPhase(phase) {
  if (ORDER.indexOf(phase) <= ORDER.indexOf(state.phase)) return;

  state.phase = phase;

  const root = document.documentElement;

  if (phase === "exit") {
    root.classList.remove("intro-cover");
    setTimeout(() => setIntroPhase("done"), EXIT_DURATION);
  }

  if (phase === "done") {
    root.classList.remove("intro-playing", "intro-cover");
  }

  window.dispatchEvent(new CustomEvent("intro:phase", { detail: phase }));
}

// Listen to every phase change. Returns a function that stops listening.
export function onIntroPhase(callback) {
  const handler = (event) => callback(event.detail);
  window.addEventListener("intro:phase", handler);
  return () => window.removeEventListener("intro:phase", handler);
}

// Run something once the site starts being revealed
// (straight away if there is no intro or it already ended).
export function whenIntroRevealing(callback) {
  if (!isIntroCovering()) {
    callback();
    return () => {};
  }

  const stop = onIntroPhase((phase) => {
    if (phase === "exit" || phase === "done") {
      stop();
      callback();
    }
  });

  return stop;
}
