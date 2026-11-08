// Fills in content.js and runs the glitch effects.
// You usually only need to edit content.js.

const $ = (id) => document.getElementById(id);
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Glitch rhythm: bursts of glitching, then calm pauses. Times in seconds.
const GLITCH = {
  active: [6, 13],   // how long glitching lasts
  calm: [3, 8],      // how long the pause lasts
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

  // alternate between glitching and calm
  const cycle = (calm) => {
    body.classList.toggle("calm", calm);
    setTimeout(() => cycle(!calm), between(calm ? GLITCH.calm : GLITCH.active));
  };
  cycle(false);

  // occasional big bursts on the name (skipped while calm)
  const burst = (force) => {
    if (force === true || !body.classList.contains("calm")) {
      name.classList.remove("burst");
      void name.offsetWidth; // restart animation
      name.classList.add("burst");
    }
  };
  const loop = () => { burst(); setTimeout(loop, 1800 + Math.random() * 4000); };
  setTimeout(loop, 1800);
  name.addEventListener("mouseenter", () => burst(true));

  // glitch-out transition into the game
  $("play").addEventListener("click", (e) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return; // let new-tab clicks through
    e.preventDefault();
    body.classList.remove("calm");
    body.classList.add("leaving");
    window.grassSurge?.();
    const rapid = setInterval(() => burst(true), 140);
    setTimeout(() => { clearInterval(rapid); location.href = SITE.game.url; }, GLITCH.transition * 1000);
  });

  // coming back with the browser's back button: reset
  window.addEventListener("pageshow", (e) => { if (e.persisted) location.reload(); });
}
