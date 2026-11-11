// Fills in content.js and draws the glitching cursor.
// You usually only need to edit content.js.

const $ = (id) => document.getElementById(id);
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(pointer: fine)").matches;

// The cursor's glitch: red and teal copies slip off the arrow while the mouse moves.
const CURSOR = {
  maxShift: 3,     // px the copies slip at most (keep it subtle)
  perPixel: 0.15,  // px of slip per px the mouse moved since the last frame
  settleMs: 120,   // how soon after the mouse stops the copies settle back
};

document.title = SITE.name;
$("name").textContent = SITE.name;
$("play").href = SITE.game.url;
$("play-label").textContent = SITE.game.label;

// Only on a mouse or trackpad, and not when the visitor asks for less motion:
// everyone else keeps their normal cursor.
if (finePointer && !reduceMotion) {
  const cursor = $("cursor");
  document.documentElement.classList.add("custom-cursor");
  let lastX = null, lastY = null, settle = 0;
  const slice = () => {
    const a = Math.floor(Math.random() * 60);
    return `inset(${a}% 0 ${Math.max(0, 70 - a)}% 0)`;
  };

  window.addEventListener("pointermove", (e) => {
    if (e.pointerType !== "mouse") return;
    cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    cursor.classList.add("on");
    if (lastX !== null) {
      const dx = e.clientX - lastX, dy = e.clientY - lastY;
      const clamp = (v) => Math.max(-CURSOR.maxShift, Math.min(CURSOR.maxShift, v * CURSOR.perPixel));
      if (dx || dy) {
        cursor.style.setProperty("--gx", `${clamp(dx) || 1}px`);
        cursor.style.setProperty("--gy", `${clamp(dy)}px`);
        cursor.style.setProperty("--clip-a", slice());
        cursor.style.setProperty("--clip-b", slice());
        cursor.classList.add("moving");
        clearTimeout(settle);
        settle = setTimeout(() => cursor.classList.remove("moving"), CURSOR.settleMs);
      }
    }
    lastX = e.clientX; lastY = e.clientY;
  });
  // hide it when the mouse leaves the window, so it doesn't sit stuck at the edge
  document.addEventListener("mouseleave", () => cursor.classList.remove("on"));
}
