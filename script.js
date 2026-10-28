// Fills in content.js and runs the glitch effects.
// You usually only need to edit content.js.

const $ = (id) => document.getElementById(id);
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

document.title = SITE.name;
$("name").textContent = SITE.name;
$("name").dataset.text = SITE.name;
$("play").href = SITE.game.url;
$("play-label").textContent = SITE.game.label;

// occasional glitch bursts on the name
if (!reduceMotion) {
  const name = $("name");
  const burst = () => {
    name.classList.remove("burst");
    void name.offsetWidth; // restart animation
    name.classList.add("burst");
    setTimeout(burst, 2500 + Math.random() * 5000);
  };
  setTimeout(burst, 1800);
  name.addEventListener("mouseenter", burst);
}
