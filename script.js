// Fills in content.js and runs the glitch effects.
// You usually only need to edit content.js.

const $ = (id) => document.getElementById(id);
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Glitch: it rests until you move the mouse, touch the screen or press a key.
// Harder movement means more glitch; it settles again soon after you stop.
const GLITCH = {
  mouse: 1 / 350,    // glitch energy per pixel of mouse movement
  key: 0.45,         // glitch energy per key press
  decay: 0.86,       // energy kept every tenth of a second (lower = settles faster)
  wake: 0.08,        // energy above which the glitch shows
  ambient: [14, 28], // seconds between the rare bursts that happen on their own
  transition: 1.8,   // length of the glitch-out when heading to the game
};

document.title = SITE.name;
$("name").textContent = SITE.name;
$("name").dataset.text = SITE.name;
$("play").href = SITE.game.url;
$("play-label").textContent = SITE.game.label;

const between = ([a, b]) => (a + Math.random() * (b - a)) * 1000;

if (!reduceMotion) {
  const body = document.body;
  const name = $("name");

  // glitch energy, fed by the mouse, touch and keys, draining over time
  let energy = 0;
  const feed = (amount) => { energy = Math.min(1.5, energy + amount); };
  let lastX = null, lastY = null;
  window.addEventListener("pointermove", (e) => {
    if (lastX !== null) feed(Math.hypot(e.clientX - lastX, e.clientY - lastY) * GLITCH.mouse);
    lastX = e.clientX; lastY = e.clientY;
  });
  window.addEventListener("pointerdown", () => feed(0.3));
  window.addEventListener("keydown", () => feed(GLITCH.key));

  const burst = () => {
    name.classList.remove("burst");
    void name.offsetWidth; // restart animation
    name.classList.add("burst");
  };
  body.classList.add("calm");
  setInterval(() => {
    if (body.classList.contains("leaving")) return;
    body.classList.toggle("calm", energy < GLITCH.wake);
    if (Math.random() < energy * 0.3) burst();
    energy *= GLITCH.decay;
  }, 100);

  // the odd burst on its own, so the page never looks frozen
  const ambient = () => { burst(); setTimeout(ambient, between(GLITCH.ambient)); };
  setTimeout(ambient, between(GLITCH.ambient));
  name.addEventListener("mouseenter", burst);

  // glitch-out transition into the game
  $("play").addEventListener("click", (e) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return; // let new-tab clicks through
    e.preventDefault();
    body.classList.remove("calm");
    body.classList.add("leaving");
    window.grassSurge?.();
    const rapid = setInterval(burst, 140);
    setTimeout(() => { clearInterval(rapid); location.href = SITE.game.url; }, GLITCH.transition * 1000);
  });

  // coming back with the browser's back button: reset
  window.addEventListener("pageshow", (e) => { if (e.persisted) location.reload(); });
}
