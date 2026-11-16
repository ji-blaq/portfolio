import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import profileImage from "../assets/profile.jpg";
import Scramble from "./Scramble";
import HeroField from "./HeroField";
import { prefersReducedMotion } from "../utils/motion";
import { whenIntroRevealing } from "../utils/intro";

function Hero() {
  const frameRef = useRef(null);

  // the scan starts when the photo is on screen (matters on phones,
  // where the photo sits below the first screen)
  const [scanStarted, setScanStarted] = useState(false);

  // the label reads "SCANNING..." until the scan line finishes
  const [scanned, setScanned] = useState(() => prefersReducedMotion());

  useEffect(() => {
    if (scanned) return;

    let observer;

    // wait until the intro starts revealing the page
    const stopWaiting = whenIntroRevealing(() => {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            observer.disconnect();
            setScanStarted(true);
          }
        },
        { threshold: 0.5 }
      );

      observer.observe(frameRef.current);
    });

    return () => {
      stopWaiting();
      observer?.disconnect();
    };
  }, [scanned]);

  // 3D tilt: the photo leans towards the mouse, with a light glare
  const tilt = (event) => {
    if (prefersReducedMotion() || event.pointerType !== "mouse") return;

    const frame = frameRef.current;
    const rect = frame.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width; // 0 (left) to 1 (right)
    const y = (event.clientY - rect.top) / rect.height; // 0 (top) to 1 (bottom)

    frame.style.setProperty("--ry", `${(x - 0.5) * 14}deg`);
    frame.style.setProperty("--rx", `${(0.5 - y) * 12}deg`);
    frame.style.setProperty("--gx", `${x * 100}%`);
    frame.style.setProperty("--gy", `${y * 100}%`);
    frame.classList.add("is-tilting");
  };

  const untilt = () => {
    const frame = frameRef.current;
    frame.style.setProperty("--rx", "0deg");
    frame.style.setProperty("--ry", "0deg");
    frame.classList.remove("is-tilting");
  };

  useEffect(() => {
    if (!scanStarted) return;

    const timer = setTimeout(() => setScanned(true), 2400);

    return () => clearTimeout(timer);
  }, [scanStarted]);

  return (
    <section className="hero" id="hero">
      {/* living dot grid (also plays the intro's logo animation) */}
      <HeroField />

      <div className="hero-text">
        <div className="eyebrow" data-reveal>
          FRONTEND <span>×</span> COMMUNICATION <span>×</span> SECURITY
        </div>

        <h1>
          <Scramble text="Oluwatimilehin" onLoad delay={150} duration={1000} />
          <br />
          <span>
            <Scramble text="Azeez Ajimati" onLoad delay={450} duration={900} />
          </span>
        </h1>

        <p
          className="hero-copy"
          data-reveal
          style={{ "--reveal-delay": "0.7s" }}
        >
          I build digital experiences with the mindset of a
          communicator — combining frontend engineering,
          storytelling, and a growing security mindset to make
          interfaces feel clear, useful, and safe to trust.
        </p>

        <div
          className="hero-actions"
          data-reveal
          style={{ "--reveal-delay": "0.85s" }}
        >
          <button
            className="primary-button"
            onClick={() =>
              document
                .getElementById("projects")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            See my work
            <ArrowUpRight size={16} />
          </button>

          <button
            className="text-button"
            onClick={() =>
              document
                .getElementById("contact")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Get in touch
          </button>
        </div>
      </div>

      <div
        className="hero-portrait"
        onPointerMove={tilt}
        onPointerLeave={untilt}
      >
        <div
          ref={frameRef}
          className={
            scanStarted ? "portrait-frame is-scanning" : "portrait-frame"
          }
        >
          <img src={profileImage} alt="Oluwatimilehin Ajimati" />

          {/* colour copy revealed by the scan line, then fades back to grey */}
          <img
            src={profileImage}
            alt=""
            aria-hidden="true"
            className="portrait-color"
          />

          <div className="portrait-scan" aria-hidden="true" />

          {/* light glare that follows the mouse */}
          <div className="portrait-glare" aria-hidden="true" />

          {/* rotating badge, appears once the scan is done */}
          <div
            className={scanned ? "portrait-badge is-on" : "portrait-badge"}
            aria-hidden="true"
          >
            <svg viewBox="0 0 100 100">
              <defs>
                <path
                  id="badge-circle"
                  d="M50,50 m-37,0 a37,37 0 1,1 74,0 a37,37 0 1,1 -74,0"
                />
              </defs>

              <circle className="badge-bg" cx="50" cy="50" r="49" />

              <g className="badge-ring">
                <text>
                  <textPath
                    href="#badge-circle"
                    textLength="232"
                    lengthAdjust="spacing"
                  >
                    FRONTEND • COMMUNICATION • SECURITY •
                  </textPath>
                </text>
              </g>

              <path
                className="badge-shield"
                d="M50 35 L61 39 V48 C61 55 56.5 59.5 50 62 C43.5 59.5 39 55 39 48 V39 Z"
              />

              <path className="badge-check" d="M45 48.5 L48.8 52.3 L55.5 45.5" />
            </svg>
          </div>

          <div className="portrait-label">
            <span>01</span>

            <span>
              {scanned ? (
                <Scramble text="BUILDING WITH INTENT" onLoad duration={600} />
              ) : (
                "SCANNING..."
              )}
            </span>
          </div>
        </div>

        <div className="portrait-note">
          <span>SCROLL</span>
          <ArrowDown size={15} />
        </div>
      </div>
    </section>
  );
}

export default Hero;
