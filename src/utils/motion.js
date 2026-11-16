// True when the visitor has asked their device for less motion.
// Every animation on the site checks this and shows the final state instead.
export function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}
