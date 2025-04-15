let focusTimer = null;
let breakTimer = null;

let pokeInterval = 20 * 1000; // 20s for focus
let breakInterval = 5 * 1000; // 5s for break

let focusStart = null;
let breakStart = null;
let lastPoke = 0;
let lastBreakPoke = 0;
let mode = null;

function format (ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const mins = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
  const secs = String(totalSeconds % 60).padStart(2, '0');
  return `${mins}:${secs}`;
}

function clearAllTimers () {
  if (focusTimer) cancelAnimationFrame(focusTimer);
  if (breakTimer) clearInterval(breakTimer);
}

function playBeep (url) {
  const sound = new Audio(url);
  sound.play().catch(() => { });
}

function showNonBlockingMessage (msg) {
  const div = document.createElement("div");
  div.textContent = msg;
  div.className = "toast";
  document.body.appendChild(div);
  setTimeout(() => div.remove(), 3000);
}

function startFocus () {
  clearAllTimers();
  mode = "focus";
  focusStart = Date.now();
  lastPoke = 0;
  document.getElementById("breakTime").textContent = "";

  function tick () {
    if (mode !== "focus") return;
    const elapsed = Date.now() - focusStart;
    document.getElementById("time").textContent = `Work: ${format(elapsed)}`;

    if (elapsed - lastPoke >= pokeInterval) {
      lastPoke = elapsed;
      playBeep("https://www.soundjay.com/switch/switch-2.mp3");
      showNonBlockingMessage("⏰ Focus poke!");
    }
    // https://www.soundjay.com/switch-sounds-1.html good sounds
    focusTimer = requestAnimationFrame(tick);
  }

  tick();
}

function startBreak () {
  clearAllTimers();
  mode = "break";
  breakStart = Date.now();
  lastBreakPoke = 0;
  document.getElementById("time").textContent = "Work: 00:00";

  breakTimer = setInterval(() => {
    if (mode !== "break") return;
    const elapsed = Date.now() - breakStart;
    document.getElementById("breakTime").textContent = `Break: ${format(elapsed)}`;

    if (elapsed - lastBreakPoke >= breakInterval) {
      lastBreakPoke = elapsed;
      playBeep("https://www.soundjay.com/buttons/sounds/beep-08b.mp3");
      showNonBlockingMessage("🔔 Break poke!");
    }
  }, 1000);
}
