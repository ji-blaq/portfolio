import { useEffect, useRef } from "react";
import { getIntroPhase, onIntroPhase } from "../utils/intro";
import { prefersReducedMotion } from "../utils/motion";

/*
  The living dot grid behind the hero (one <canvas>).

  During the intro the same dots:
    boot    -> float around like dust on the dark screen
    form    -> swarm together into the "OAA." logo
    granted -> hold the logo, shimmering
    exit    -> explode outwards and land in a neat grid

  After the intro the grid is alive:
    - it slowly breathes in a wave
    - dots run away from the mouse and glow amber, with thin "network" lines
    - clicking sends out a shockwave ring
    - an amber scan line sweeps down every few seconds (works on phones too)
*/

const INK = [26, 29, 35];
const PAPER = [247, 245, 240];
const AMBER = [201, 138, 59];

const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const mix = (a, b, t) => [
  a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t,
  a[2] + (b[2] - a[2]) * t,
];
const rgba = (c, alpha) =>
  `rgba(${c[0] | 0}, ${c[1] | 0}, ${c[2] | 0}, ${alpha.toFixed(3)})`;

function shuffle(list) {
  for (let i = list.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [list[i], list[j]] = [list[j], list[i]];
  }
  return list;
}

function HeroField() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const hero = canvas.parentElement;
    const ctx = canvas.getContext("2d");
    const reduced = prefersReducedMotion();

    let width = 0;
    let height = 0;
    let particles = [];
    let phase = getIntroPhase();
    let phaseAt = performance.now();
    let frame = 0;
    let running = false;
    let onScreen = true;

    const pointer = { x: -9999, y: -9999 };
    const waves = [];

    const isLive = () => phase === "done" || phase === "off";

    // ---------- building the grid and the logo ----------

    function gridPoints() {
      const gap = width < 700 ? 24 : 28;
      const cols = Math.max(1, Math.floor(width / gap));
      const rows = Math.max(1, Math.floor(height / gap));
      const startX = (width - (cols - 1) * gap) / 2;
      const startY = (height - (rows - 1) * gap) / 2;

      const points = [];
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          points.push({ x: startX + col * gap, y: startY + row * gap });
        }
      }
      return points;
    }

    function newParticle(home) {
      return {
        hx: home.x,
        hy: home.y,
        // start scattered across the screen (or already home if no intro)
        x: isLive() ? home.x : Math.random() * window.innerWidth,
        y: isLive() ? home.y : Math.random() * window.innerHeight,
        vx: 0,
        vy: 0,
        lx: home.x,
        ly: home.y,
        amber: Math.random() < 0.07,
        seed: Math.random() * Math.PI * 2,
        delay: Math.random(),
      };
    }

    // draw "OAA." on a hidden canvas and collect the pixels it covers
    function assignLogo() {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const size = Math.min(vw * 0.28, vh * 0.42);

      const off = document.createElement("canvas");
      off.width = Math.ceil(vw);
      off.height = Math.ceil(vh);

      const o = off.getContext("2d", { willReadFrequently: true });
      o.fillStyle = "#fff";
      o.font = `700 ${size}px "JetBrains Mono", monospace`;
      o.textAlign = "center";
      o.textBaseline = "middle";
      o.fillText("OAA.", vw / 2, vh / 2);

      const data = o.getImageData(0, 0, off.width, off.height).data;
      const step = Math.max(2, Math.round(size / 75));
      const found = [];

      for (let y = 0; y < off.height; y += step) {
        for (let x = 0; x < off.width; x += step) {
          if (data[(y * off.width + x) * 4 + 3] > 128) found.push({ x, y });
        }
      }

      shuffle(found);

      // the canvas sits at the top of the hero, so screen -> canvas offset
      const rect = canvas.getBoundingClientRect();

      particles.forEach((p, i) => {
        const point = found[i % Math.max(found.length, 1)] || { x: vw / 2, y: vh / 2 };
        p.lx = point.x - rect.left;
        p.ly = point.y - rect.top;
      });
    }

    function explode() {
      const rect = canvas.getBoundingClientRect();
      const cx = window.innerWidth / 2 - rect.left;
      const cy = window.innerHeight / 2 - rect.top;

      particles.forEach((p) => {
        const dx = p.x - cx;
        const dy = p.y - cy;
        const d = Math.hypot(dx, dy) || 1;
        const force = 12 + Math.random() * 20;

        p.vx += (dx / d) * force + (Math.random() - 0.5) * 8;
        p.vy += (dy / d) * force + (Math.random() - 0.5) * 8;
      });
    }

    function setup() {
      width = hero.clientWidth;
      height = hero.clientHeight;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // keep existing dots moving smoothly; only their home spot changes
      const old = particles;
      particles = gridPoints().map((home, i) => {
        const p = old[i];
        if (!p) return newParticle(home);
        p.hx = home.x;
        p.hy = home.y;
        return p;
      });

      if (phase === "form" || phase === "granted") assignLogo();
    }

    // ---------- physics ----------

    let lastTime = 0;

    function update(now) {
      // "dt" = how many 60fps frames passed since last time.
      // Multiplying movement by it keeps the speed the same on
      // a 30fps budget phone and a 120fps screen.
      const dt = lastTime ? clamp((now - lastTime) / 16.67, 0.25, 3) : 1;
      lastTime = now;

      const t = now / 1000;
      const since = now - phaseAt;

      // the shockwave rings grow and fade
      for (let i = waves.length - 1; i >= 0; i--) {
        const wave = waves[i];
        wave.r = (now - wave.start) * 0.75;
        wave.life = 1 - wave.r / 750;
        if (wave.life <= 0) waves.splice(i, 1);
      }

      // spring strength (k) and friction (damping) for this phase
      let k = 0.06;
      let damping = 0.82;

      if (phase === "form") {
        k = 0.045;
        damping = 0.84;
      } else if (phase === "granted") {
        k = 0.08;
        damping = 0.8;
      } else if (phase === "exit") {
        // weak pull at first so the explosion can fly, then it snaps home
        const ramp = clamp(since / 900);
        k = 0.004 + ramp * 0.056;
        damping = 0.9 - ramp * 0.08;
      }

      const friction = Math.pow(damping, dt);
      const drift = Math.pow(0.97, dt);
      const pushFromMouse = isLive() || (phase === "exit" && since > 500);

      for (const p of particles) {
        // floating dust (before the logo, or a dot that hasn't left yet)
        const floating = phase === "boot" || (phase === "form" && since < p.delay * 380);

        if (floating) {
          if (phase === "boot") {
            p.vx += Math.cos(t * 0.7 + p.seed) * 0.03 * dt;
            p.vy += Math.sin(t * 0.9 + p.seed) * 0.03 * dt;
          }
          p.vx *= drift;
          p.vy *= drift;
          p.x += p.vx * dt;
          p.y += p.vy * dt;
          continue;
        }

        let tx;
        let ty;

        if (phase === "form") {
          tx = p.lx;
          ty = p.ly;
        } else if (phase === "granted") {
          tx = p.lx + Math.sin(t * 3 + p.seed) * 0.7;
          ty = p.ly + Math.cos(t * 3 + p.seed) * 0.7;
        } else {
          // home in the grid, gently breathing
          tx = p.hx + Math.cos(p.hy * 0.01 + t * 1.1) * 1.2;
          ty = p.hy + Math.sin(p.hx * 0.012 + t * 1.4) * 2.2 + Math.cos(p.hy * 0.02 + t) * 1.2;
        }

        p.vx += (tx - p.x) * k * dt;
        p.vy += (ty - p.y) * k * dt;

        if (pushFromMouse) {
          const dx = p.x - pointer.x;
          const dy = p.y - pointer.y;
          const d = Math.hypot(dx, dy);
          const radius = 130;

          if (d < radius && d > 0.1) {
            const force = Math.pow(1 - d / radius, 2) * 4.2 * dt;
            p.vx += (dx / d) * force;
            p.vy += (dy / d) * force;
          }

          for (const wave of waves) {
            const wx = p.x - wave.x;
            const wy = p.y - wave.y;
            const wd = Math.hypot(wx, wy) || 1;
            const gap = Math.abs(wd - wave.r);

            if (gap < 46) {
              const push = (1 - gap / 46) * 2.8 * wave.life * dt;
              p.vx += (wx / wd) * push;
              p.vy += (wy / wd) * push;
            }
          }
        }

        p.vx *= friction;
        p.vy *= friction;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
      }
    }

    // ---------- drawing ----------

    function draw(now) {
      ctx.clearRect(0, 0, width, height);

      const t = now / 1000;
      const since = now - phaseAt;
      const live = isLive();

      // 0 = light dots (on the dark intro), 1 = dark dots (on the site)
      let siteMix = 1;
      if (phase === "boot" || phase === "form" || phase === "granted") siteMix = 0;
      if (phase === "exit") siteMix = clamp((since - 250) / 700);

      const base = mix(PAPER, INK, siteMix);
      const scanY = ((t % 7) / 7) * (height + 260) - 130;

      const plain = [];
      const special = [];

      for (const p of particles) {
        // how strongly this dot is lit up (mouse, scan line, shockwave)
        let glow = 0;

        if (live || phase === "exit") {
          const d = Math.hypot(p.x - pointer.x, p.y - pointer.y);
          if (d < 150) glow = Math.max(glow, 1 - d / 150);

          if (live && !reduced) {
            const s = Math.abs(p.y - scanY);
            if (s < 30) glow = Math.max(glow, (1 - s / 30) * 0.85);
          }

          for (const wave of waves) {
            const gap = Math.abs(Math.hypot(p.x - wave.x, p.y - wave.y) - wave.r);
            if (gap < 40) glow = Math.max(glow, (1 - gap / 40) * wave.life);
          }
        }

        let alpha;
        let size;

        if (phase === "boot") {
          alpha = 0.28;
          size = 1.6;
        } else if (phase === "form" || phase === "granted") {
          alpha = 0.95;
          size = 2.1;
        } else {
          // fade the grid out towards the bottom of the hero
          const fade = clamp((height - p.hy) / (height * 0.38));
          const resting = 0.95 - siteMix * 0.8; // 0.95 -> 0.15
          alpha = (p.amber ? Math.max(resting, 0.42) : resting) * (siteMix < 1 ? 1 : fade);
          alpha = alpha + glow * (0.9 - alpha);
          size = 2 + glow * 1.6;
        }

        if (glow < 0.02 && !p.amber) {
          plain.push(p, alpha, size);
        } else {
          special.push(p, alpha, size, glow);
        }
      }

      // most dots share one colour: draw them in a single pass
      ctx.fillStyle = rgba(base, 1);
      for (let i = 0; i < plain.length; i += 3) {
        const p = plain[i];
        const size = plain[i + 2];
        ctx.globalAlpha = plain[i + 1];
        ctx.fillRect(p.x - size / 2, p.y - size / 2, size, size);
      }
      ctx.globalAlpha = 1;

      // amber and glowing dots
      for (let i = 0; i < special.length; i += 4) {
        const p = special[i];
        const alpha = special[i + 1];
        const size = special[i + 2];
        const glow = special[i + 3];
        const colour = p.amber ? AMBER : mix(base, AMBER, glow);
        ctx.fillStyle = rgba(colour, alpha);
        ctx.fillRect(p.x - size / 2, p.y - size / 2, size, size);
      }

      if (live) {
        // thin "network" lines from the mouse to nearby dots
        ctx.beginPath();
        let lines = 0;
        for (const p of particles) {
          if (lines > 36) break;
          const d = Math.hypot(p.x - pointer.x, p.y - pointer.y);
          if (d < 105) {
            ctx.moveTo(pointer.x, pointer.y);
            ctx.lineTo(p.x, p.y);
            lines++;
          }
        }
        ctx.strokeStyle = rgba(AMBER, 0.22);
        ctx.lineWidth = 0.6;
        ctx.stroke();

        // shockwave rings
        for (const wave of waves) {
          ctx.beginPath();
          ctx.arc(wave.x, wave.y, wave.r, 0, Math.PI * 2);
          ctx.strokeStyle = rgba(AMBER, wave.life * 0.45);
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    // ---------- loop ----------

    function loop(now) {
      update(now);
      draw(now);
      frame = requestAnimationFrame(loop);
    }

    function start() {
      if (running || reduced) return;
      running = true;
      lastTime = 0;
      frame = requestAnimationFrame(loop);
    }

    function stop() {
      running = false;
      cancelAnimationFrame(frame);
    }

    // ---------- events ----------

    const toCanvas = (event) => {
      const rect = canvas.getBoundingClientRect();
      return { x: event.clientX - rect.left, y: event.clientY - rect.top };
    };

    const onMove = (event) => {
      const point = toCanvas(event);
      pointer.x = point.x;
      pointer.y = point.y;
    };

    const onLeave = () => {
      pointer.x = -9999;
      pointer.y = -9999;
    };

    const onDown = (event) => {
      if (!isLive() || event.target.closest("a, button")) return;
      const point = toCanvas(event);
      waves.push({ x: point.x, y: point.y, start: performance.now(), r: 0, life: 1 });
      if (waves.length > 4) waves.shift();
    };

    hero.addEventListener("pointermove", onMove);
    hero.addEventListener("pointerleave", onLeave);
    hero.addEventListener("pointerdown", onDown);

    const stopListening = onIntroPhase((next) => {
      phase = next;
      phaseAt = performance.now();
      if (next === "form") assignLogo();
      if (next === "exit") explode();
      if (next === "done" && !onScreen) stop();
    });

    // only animate while the hero is on screen
    const visibility = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      if (onScreen) start();
      else if (isLive()) stop();
    });
    visibility.observe(canvas);

    // rebuild the grid when the hero changes size
    let resizeFrame = 0;
    const resize = new ResizeObserver(() => {
      cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(() => {
        setup();
        if (reduced) draw(performance.now());
      });
    });
    resize.observe(hero);

    setup();
    if (reduced) draw(performance.now());
    else start();

    return () => {
      stop();
      cancelAnimationFrame(resizeFrame);
      stopListening();
      visibility.disconnect();
      resize.disconnect();
      hero.removeEventListener("pointermove", onMove);
      hero.removeEventListener("pointerleave", onLeave);
      hero.removeEventListener("pointerdown", onDown);
    };
  }, []);

  return <canvas ref={canvasRef} className="hero-field" aria-hidden="true" />;
}

export default HeroField;
