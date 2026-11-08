// Buffel grass — tussocks that grow up from the ground, sway, and glitch.
// Tweak the numbers in GRASS to change the look.

const GRASS = {
  spacing: 46,        // px between tussocks (smaller = denser)
  blades: [14, 26],   // blades per tussock (min, max)
  height: 0.3,        // tallest blade as a fraction of screen height
  growSeconds: 7,     // how long a tussock takes to grow
  groundOffset: 38,   // px above the bottom (sits on the earth layers)
  colors: ["#d9a066", "#e8c995", "#b8a26a", "#8f9a6a", "#8b5a3c"], // straw, sand, dry olive, sage, dune
  seedColors: ["#9c7aa0", "#c94f9b", "#b59a8a"], // purple-grey bottlebrush seed heads
};

(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const canvas = document.createElement("canvas");
  canvas.className = "grass";
  canvas.setAttribute("aria-hidden", "true");
  document.body.prepend(canvas);
  const ctx = canvas.getContext("2d");

  let W, H, dpr, tussocks = [];
  const rand = (a, b) => a + Math.random() * (b - a);
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

  function makeTussock(x, delay) {
    const blades = [];
    const n = Math.round(rand(...GRASS.blades));
    for (let i = 0; i < n; i++) {
      blades.push({
        dx: rand(-10, 10),
        len: rand(0.35, 1) * GRASS.height,
        lean: rand(-0.75, 0.75),          // radians from vertical
        bend: rand(0.2, 0.6),
        width: rand(1, 2.4),
        color: pick(GRASS.colors),
        seed: Math.random() < 0.28 ? pick(GRASS.seedColors) : null,
        phase: rand(0, Math.PI * 2),
      });
    }
    return { x, delay, blades };
  }

  function layout() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth; H = window.innerHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    tussocks = [];
    for (let x = rand(0, GRASS.spacing); x < W + 20; x += GRASS.spacing * rand(0.6, 1.4)) {
      tussocks.push(makeTussock(x, rand(0, 3.5)));
    }
  }

  const start = performance.now();
  let surge = 1;          // scales blade height; grows when leaving for the game
  let surgeTarget = 1;

  function draw(now) {
    const t = (now - start) / 1000;
    const ground = H - GRASS.groundOffset;
    surge += (surgeTarget - surge) * 0.04;
    ctx.clearRect(0, 0, W, H);

    for (const tu of tussocks) {
      const g = reduceMotion ? 1 : Math.min(1, Math.max(0, (t - tu.delay) / GRASS.growSeconds));
      if (g <= 0) continue;
      const grow = 1 - Math.pow(1 - g, 3); // ease out
      for (const b of tu.blades) {
        const len = b.len * H * grow * surge;
        const sway = reduceMotion ? 0 : Math.sin(t * 0.9 + tu.x * 0.012 + b.phase) * 0.08;
        const a = b.lean + sway;
        const bx = tu.x + b.dx;
        const tipX = bx + Math.sin(a) * len;
        const tipY = ground - Math.cos(a) * len;
        const cX = bx + Math.sin(a * b.bend) * len * 0.5;
        const cY = ground - Math.cos(a * b.bend) * len * 0.6;

        ctx.strokeStyle = b.color;
        ctx.lineWidth = b.width;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(bx, ground);
        ctx.quadraticCurveTo(cX, cY, tipX, tipY);
        ctx.stroke();

        // bottlebrush seed head near the tip
        if (b.seed && grow > 0.85) {
          const headX = cX + (tipX - cX) * 0.7;
          const headY = cY + (tipY - cY) * 0.7;
          ctx.strokeStyle = b.seed;
          ctx.lineWidth = b.width + 3.5;
          ctx.globalAlpha = 0.75;
          ctx.beginPath();
          ctx.moveTo(headX, headY);
          ctx.lineTo(tipX, tipY);
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }
    }

    // glitch: shift a few horizontal slices sideways while the page is glitching
    const glitching = !document.body.classList.contains("calm");
    const leaving = document.body.classList.contains("leaving");
    if (!reduceMotion && (leaving || (glitching && Math.random() < 0.06))) {
      const slices = leaving ? 6 : 2;
      for (let i = 0; i < slices; i++) {
        const sy = rand(H * 0.4, ground);
        const sh = rand(4, leaving ? 40 : 18);
        const shift = rand(-30, 30) * (leaving ? 2 : 1);
        ctx.drawImage(canvas, 0, sy * dpr, W * dpr, sh * dpr, shift, sy, W, sh);
      }
    }

    if (!reduceMotion) requestAnimationFrame(draw);
  }

  layout();
  window.addEventListener("resize", layout);
  requestAnimationFrame(draw);

  // called by script.js when heading to the game
  window.grassSurge = () => { surgeTarget = 1 / GRASS.height; };
})();
