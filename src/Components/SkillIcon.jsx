/*
  Small animated icons for the Journey cards.
  All motion is CSS (see "Journey: animated icons" in App.css),
  so it switches off for visitors who prefer reduced motion.
*/

const common = {
  viewBox: "0 0 40 40",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
};

function SkillIcon({ type }) {
  // HTML: tag brackets breathe in and out, the slash redraws
  if (type === "html") {
    return (
      <svg className="si si-html" {...common}>
        <polyline className="si-left" points="14,12 6,20 14,28" />
        <polyline className="si-right" points="26,12 34,20 26,28" />
        <line className="si-slash" x1="23" y1="10" x2="17" y2="30" />
      </svg>
    );
  }

  // CSS: three overlapping colour circles turning like a palette
  if (type === "css") {
    return (
      <svg className="si si-css" {...common}>
        <g className="si-spin">
          <circle cx="20" cy="13" r="7" fill="currentColor" fillOpacity="0.85" stroke="none" />
          <circle cx="26.1" cy="23.5" r="7" fill="currentColor" fillOpacity="0.5" stroke="none" />
          <circle cx="13.9" cy="23.5" r="7" fill="currentColor" fillOpacity="0.25" stroke="none" />
        </g>
      </svg>
    );
  }

  // JavaScript: braces with a blinking cursor between them
  if (type === "js") {
    return (
      <svg className="si si-js" {...common}>
        <path d="M15 9 C11 9 12 13 12 16 C12 18 10.5 20 8 20 C10.5 20 12 22 12 24 C12 27 11 31 15 31" />
        <path d="M25 9 C29 9 28 13 28 16 C28 18 29.5 20 32 20 C29.5 20 28 22 28 24 C28 27 29 31 25 31" />
        <line className="si-cursor" x1="20" y1="15" x2="20" y2="25" />
      </svg>
    );
  }

  // React: an atom whose orbits keep turning
  if (type === "react") {
    return (
      <svg className="si si-react" {...common}>
        <g className="si-spin">
          <ellipse cx="20" cy="20" rx="15" ry="6" />
          <ellipse cx="20" cy="20" rx="15" ry="6" transform="rotate(60 20 20)" />
          <ellipse cx="20" cy="20" rx="15" ry="6" transform="rotate(120 20 20)" />
        </g>
        <circle cx="20" cy="20" r="2.4" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  // Security: a shield with a scan line passing through, then a tick
  return (
    <svg className="si si-security" {...common}>
      <defs>
        <clipPath id="si-shield-clip">
          <path d="M20 5 L32 9.5 V19 C32 26.5 27 31.5 20 35 C13 31.5 8 26.5 8 19 V9.5 Z" />
        </clipPath>
      </defs>

      <path d="M20 5 L32 9.5 V19 C32 26.5 27 31.5 20 35 C13 31.5 8 26.5 8 19 V9.5 Z" />

      <g clipPath="url(#si-shield-clip)">
        <line className="si-scan" x1="6" y1="6" x2="34" y2="6" strokeWidth="1.4" />
      </g>

      <path className="si-tick" d="M14.5 20 L18.5 24 L25.5 16.5" />
    </svg>
  );
}

export default SkillIcon;
