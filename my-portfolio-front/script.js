// ===== Theme toggle =====
const root = document.documentElement;
const themeToggle = document.getElementById("themeToggle");
if (localStorage.getItem("theme") === "dark") root.classList.add("dark");
function syncThemeLabel() {
  themeToggle.textContent = root.classList.contains("dark") ? "light" : "dark";
}
syncThemeLabel();
themeToggle.addEventListener("click", () => {
  const dark = root.classList.toggle("dark");
  localStorage.setItem("theme", dark ? "dark" : "light");
  syncThemeLabel();
});

// ===== Mobile nav =====
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");
navToggle.addEventListener("click", () => navLinks.classList.toggle("open"));
navLinks.addEventListener("click", (e) => {
  if (e.target.tagName === "A") navLinks.classList.remove("open");
});

// ===== Footer year =====
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ===== Contact form (FormSubmit) =====
const form = document.getElementById("contactForm");
if (form) {
  const note = form.querySelector(".form-note");
  const submitBtn = form.querySelector('button[type="submit"]');
  const TOKEN = "e48e9bc3d858bd5614c84dc57f694977";
  const val = (sel) => form.querySelector(sel).value.trim();

  function feedback(msg, isError) {
    note.textContent = msg;
    note.style.color = isError ? "#c0392b" : "var(--accent)";
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending…";
    feedback("", false);
    const name = val('input[name="name"]');
    const reason = form.querySelector('select[name="reason"]').value;
    const payload = {
      name,
      email: val('input[name="email"]'),
      reason,
      message: val('textarea[name="message"]'),
      _subject: `Portfolio: ${name || "Someone"} — ${reason}`,
    };
    try {
      const res = await fetch(`https://formsubmit.co/ajax/${TOKEN}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        feedback("Thanks — your message was sent. I’ll get back to you.", false);
        form.reset();
      } else {
        feedback(data.message || "Something went wrong. Please try again.", true);
      }
    } catch (err) {
      feedback("Network error. Please try again, or email me directly.", true);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Send message";
    }
  });
}

// ===== Background music (YouTube IFrame API) =====
// Browsers block autoplay-with-sound until the user interacts with the page.
// So: attempt autoplay, but also start on the first user gesture anywhere, and
// keep the button label honest ("play music" / "pause music") as the cue.
let player;
let musicReady = false;
const musicBtn = document.getElementById("musicBtn");
const musicLabel = document.getElementById("musicLabel");

function startMusic() {
  if (!musicReady) return;
  player.unMute();
  player.setVolume(60);
  player.playVideo();
}

window.onYouTubeIframeAPIReady = function () {
  player = new YT.Player("yt", {
    height: "0",
    width: "0",
    videoId: "7YDdfIeeJTU",
    playerVars: {
      autoplay: 0, controls: 0, disablekb: 1, loop: 1,
      playlist: "7YDdfIeeJTU", modestbranding: 1, playsinline: 1, rel: 0,
    },
    events: {
      onReady: () => {
        musicReady = true;
        player.setVolume(60);
        try { player.playVideo(); } catch (e) {} // may be blocked; first gesture covers it
      },
      onStateChange: (e) => {
        const playing = e.data === YT.PlayerState.PLAYING;
        musicBtn.classList.toggle("playing", playing);
        if (musicLabel) musicLabel.textContent = playing ? "pause music" : "play music";
      },
    },
  });
};

// Start on the first interaction anywhere — unless that interaction is the
// music button itself, which has its own toggle handler below.
function startOnFirstGesture(e) {
  if (musicBtn && e.target instanceof Node && musicBtn.contains(e.target)) {
    removeGestureListeners();
    return;
  }
  if (musicReady && player.getPlayerState() !== YT.PlayerState.PLAYING) startMusic();
  removeGestureListeners();
}
function removeGestureListeners() {
  window.removeEventListener("pointerdown", startOnFirstGesture);
  window.removeEventListener("keydown", startOnFirstGesture);
}
window.addEventListener("pointerdown", startOnFirstGesture);
window.addEventListener("keydown", startOnFirstGesture);

if (musicBtn) {
  musicBtn.addEventListener("click", () => {
    if (!player) return;
    if (player.getPlayerState() === YT.PlayerState.PLAYING) player.pauseVideo();
    else startMusic();
  });
}
