import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { prefersReducedMotion } from "./utils/motion";
import { startIntro } from "./utils/intro";

// Turn on scroll-reveal styles before the first paint (skipped for reduced motion).
// The intro (dark boot screen + particle logo) also starts here.
if (!prefersReducedMotion()) {
  document.documentElement.classList.add("reveal-ready");
  startIntro();
}

// A small hello for anyone curious enough to open DevTools.
console.log(
  "%cOAA.%c\nYou opened DevTools. Respect.\nFound a bug or a security issue on this site? Tell me: ajimatioluwatimilehinazeez@gmail.com",
  "font: 700 22px 'JetBrains Mono', monospace; color: #c98a3b;",
  "font: 12px 'JetBrains Mono', monospace; color: inherit;"
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
