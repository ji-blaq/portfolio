import { prefersReducedMotion } from "../utils/motion";

/*
  About section illustration:
  a message (speech bubble) travels into an interface (browser window)
  and is passed on to security (shield). Loops every 4 seconds.
*/

const CYCLE = "4s";

const PATH_A = "M104 100 C128 80 158 80 182 100";
const PATH_B = "M278 100 C302 120 336 120 364 100";

const ORANGE = "#c98a3b";
const LINE = "rgba(247, 245, 240, 0.4)";

function Packet({ path, keyTimes, keyPoints, fadeTimes, fadeValues }) {
  return (
    <g opacity="0">
      <circle r="9" fill={ORANGE} opacity="0.22" />
      <circle r="4" fill={ORANGE} />

      <animateMotion
        dur={CYCLE}
        repeatCount="indefinite"
        path={path}
        calcMode="linear"
        keyTimes={keyTimes}
        keyPoints={keyPoints}
      />

      <animate
        attributeName="opacity"
        dur={CYCLE}
        repeatCount="indefinite"
        keyTimes={fadeTimes}
        values={fadeValues}
      />
    </g>
  );
}

function SignalFlow() {
  const animate = !prefersReducedMotion();

  return (
    <div className="signal-flow" aria-hidden="true">
      <svg viewBox="0 0 460 190">
        {/* dashed connections */}
        <path className="flow-line" d={PATH_A} />
        <path className="flow-line" d={PATH_B} />

        {/* 1 — MESSAGE: speech bubble with typing dots */}
        <path
          d="M30 70 h60 a8 8 0 0 1 8 8 v36 a8 8 0 0 1 -8 8 h-36 l-13 12 v-12 h-11 a8 8 0 0 1 -8 -8 v-36 a8 8 0 0 1 8 -8 z"
          fill="none"
          stroke={LINE}
          strokeWidth="1.5"
        />
        <circle className="flow-dot" cx="48" cy="96" r="3.2" fill={ORANGE} />
        <circle className="flow-dot" style={{ animationDelay: "0.15s" }} cx="60" cy="96" r="3.2" fill={ORANGE} />
        <circle className="flow-dot" style={{ animationDelay: "0.3s" }} cx="72" cy="96" r="3.2" fill={ORANGE} />

        {/* 2 — INTERFACE: browser window that builds itself */}
        <rect
          x="184"
          y="64"
          width="92"
          height="72"
          rx="6"
          fill="none"
          stroke={LINE}
          strokeWidth="1.5"
        />
        <line x1="184" y1="78" x2="276" y2="78" stroke={LINE} strokeWidth="1.2" />
        <circle cx="192" cy="71" r="2" fill={LINE} />
        <circle cx="199" cy="71" r="2" fill={LINE} />
        <circle cx="206" cy="71" r="2" fill={LINE} />

        <rect className="flow-build" x="194" y="88" width="56" height="4" rx="2" fill="rgba(247, 245, 240, 0.55)" />
        <rect className="flow-build" style={{ animationDelay: "0.08s" }} x="194" y="98" width="72" height="4" rx="2" fill="rgba(247, 245, 240, 0.3)" />
        <rect className="flow-build" style={{ animationDelay: "0.16s" }} x="194" y="108" width="44" height="4" rx="2" fill="rgba(247, 245, 240, 0.3)" />
        <rect className="flow-build" style={{ animationDelay: "0.24s" }} x="194" y="119" width="26" height="9" rx="2" fill={ORANGE} />

        {/* 3 — SECURITY: shield that checks what arrives */}
        <circle cx="400" cy="100" r="30" fill="none" stroke={ORANGE} strokeWidth="1.2" opacity="0">
          {animate && (
            <>
              <animate attributeName="r" dur={CYCLE} repeatCount="indefinite" keyTimes="0;0.7;0.92;1" values="30;30;54;54" />
              <animate attributeName="opacity" dur={CYCLE} repeatCount="indefinite" keyTimes="0;0.69;0.71;0.92;1" values="0;0;0.8;0;0" />
            </>
          )}
        </circle>

        <path
          d="M400 62 L428 72 V97 C428 115 416 127 400 136 C384 127 372 115 372 97 V72 Z"
          fill="none"
          stroke={LINE}
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        <path
          d="M388 99 L396.5 107.5 L412 91"
          fill="none"
          stroke={ORANGE}
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="34 40"
          strokeDashoffset="0"
        >
          {animate && (
            <animate
              attributeName="stroke-dashoffset"
              dur={CYCLE}
              repeatCount="indefinite"
              keyTimes="0;0.7;0.82;0.95;1"
              values="36;36;0;0;36"
            />
          )}
        </path>

        {/* travelling packets */}
        {animate && (
          <>
            <Packet
              path={PATH_A}
              keyTimes="0;0.3;1"
              keyPoints="0;1;1"
              fadeTimes="0;0.04;0.27;0.31;1"
              fadeValues="0;1;1;0;0"
            />

            <Packet
              path={PATH_B}
              keyTimes="0;0.4;0.7;1"
              keyPoints="0;0;1;1"
              fadeTimes="0;0.4;0.44;0.67;0.71;1"
              fadeValues="0;0;1;1;0;0"
            />
          </>
        )}

        {/* labels */}
        <text className="flow-label" x="60" y="170">MESSAGE</text>
        <text className="flow-label" x="230" y="170">INTERFACE</text>
        <text className="flow-label" x="400" y="170">SECURITY</text>
      </svg>
    </div>
  );
}

export default SignalFlow;
