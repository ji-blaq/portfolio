import { useEffect } from "react";

/*
  Scroll reveals.
  Any element with data-reveal (or data-reveal-group for staggered children)
  gets the class "is-visible" the first time it scrolls into view.
  The hiding/showing itself lives in App.css.
*/
function useReveal() {
  useEffect(() => {
    const items = document.querySelectorAll(
      "[data-reveal], [data-reveal-group]"
    );

    // reduced motion: main.jsx never adds .reveal-ready, so nothing is hidden
    if (!document.documentElement.classList.contains("reveal-ready")) {
      items.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );

    items.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);
}

export default useReveal;
