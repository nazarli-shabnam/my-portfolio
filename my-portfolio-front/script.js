// ========== Theme Toggle ==========
const body = document.body;
const themeToggle = document.getElementById("themeToggle");
const themeIcon = themeToggle.querySelector(".theme-icon");

const storedTheme = localStorage.getItem("theme");
if (storedTheme === "light") {
  body.classList.add("light");
  themeIcon.textContent = "☀️";
}

themeToggle.addEventListener("click", () => {
  body.classList.toggle("light");
  const isLight = body.classList.contains("light");
  localStorage.setItem("theme", isLight ? "light" : "dark");
  themeIcon.textContent = isLight ? "☀️" : "🌙";
});

// ========== Mobile Nav ==========
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");

navToggle.addEventListener("click", () => {
  navLinks.classList.toggle("open");
});

navLinks.addEventListener("click", (e) => {
  if (e.target.tagName === "A") {
    navLinks.classList.remove("open");
  }
});

// ========== Typed Text ==========
const typedTextElement = document.getElementById("typedText");
const phrases = [
  "building reliable backend APIs.",
  "learning more about cloud & DevOps.",
  "improving system design skills.",
  "writing tests (even when it’s not glamorous).",
  "balancing university and real projects.",
];

let currentPhraseIndex = 0;
let currentCharIndex = 0;
let isDeleting = false;
const typingSpeed = 70;
const deletingSpeed = 40;
const pauseBetween = 1200;

function typeLoop() {
  const currentPhrase = phrases[currentPhraseIndex];

  if (!isDeleting) {
    // typing
    typedTextElement.textContent = currentPhrase.slice(0, currentCharIndex + 1);
    currentCharIndex++;

    if (currentCharIndex === currentPhrase.length) {
      isDeleting = true;
      setTimeout(typeLoop, pauseBetween);
      return;
    }
  } else {
    // deleting
    typedTextElement.textContent = currentPhrase.slice(0, currentCharIndex - 1);
    currentCharIndex--;

    if (currentCharIndex === 0) {
      isDeleting = false;
      currentPhraseIndex = (currentPhraseIndex + 1) % phrases.length;
    }
  }

  const delay = isDeleting ? deletingSpeed : typingSpeed;
  setTimeout(typeLoop, delay);
}

typeLoop();

// ========== Scroll Reveal ==========
const revealElements = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.1,
  }
);

revealElements.forEach((el) => observer.observe(el));

// ========== Project Filters ==========
const filterButtons = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.getAttribute("data-filter");

    filterButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    projectCards.forEach((card) => {
      const category = card.getAttribute("data-category");
      if (filter === "all" || category.includes(filter)) {
        card.classList.remove("hidden");
      } else {
        card.classList.add("hidden");
      }
    });
  });
});

// ========== Scroll to Top ==========
const scrollTopBtn = document.getElementById("scrollTopBtn");

window.addEventListener("scroll", () => {
  if (window.scrollY > 280) {
    scrollTopBtn.classList.add("visible");
  } else {
    scrollTopBtn.classList.remove("visible");
  }
});

scrollTopBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// ========== Footer Year ==========
const yearSpan = document.getElementById("year");
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

// ========== Contact Form (Web3Forms) ==========
const form = document.getElementById("contactForm");

if (!form) {
  console.error("Contact form not found!");
} else {
  const submitButton = form.querySelector('button[type="submit"]');
  const formNote = form.querySelector(".form-note");
  const WEB3FORMS_ACCESS_KEY = "762b120c-03f5-485c-a6d9-366774cfe053";

  function showFormFeedback(message, isError = false) {
    if (!formNote) return;
    formNote.textContent = message;
    formNote.style.color = isError ? "var(--danger)" : "var(--accent-strong)";
    formNote.style.display = "block";
    if (!isError) {
      setTimeout(() => {
        formNote.style.display = "none";
      }, 5000);
    }
  }

  function setFormLoading(isLoading) {
    submitButton.disabled = isLoading;
    submitButton.textContent = isLoading ? "Sending..." : "Send Message";
    submitButton.style.opacity = isLoading ? "0.7" : "1";
    submitButton.style.cursor = isLoading ? "not-allowed" : "pointer";
    form.querySelectorAll("input, select, textarea").forEach((field) => {
      field.disabled = isLoading;
    });
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (formNote) formNote.style.display = "none";
    setFormLoading(true);

    try {
      const formData = new FormData(form);
      formData.append("access_key", WEB3FORMS_ACCESS_KEY);

      const name = formData.get("name") || "Someone";
      const reasonSelect = form.querySelector('select[name="reason"]');
      const reasonLabel = reasonSelect?.selectedOptions?.[0]?.textContent || "Contact";
      formData.set("subject", `Portfolio: ${name} – ${reasonLabel}`);

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        showFormFeedback(
          data.message || "Thanks! Your message was sent ✨ I'll get back to you soon.",
          false
        );
        form.reset();
      } else {
        showFormFeedback(
          data.message || "Something went wrong. Please try again.",
          true
        );
      }
    } catch (error) {
      const msg =
        error.message.includes("Failed to fetch") ||
        error.message.includes("NetworkError")
          ? "Please check your connection and try again."
          : error.message;
      showFormFeedback("Oops! " + msg, true);
    } finally {
      setFormLoading(false);
    }
  });
}

let youtubePlayer;
let musicStarted = false;
let musicPaused = false;
const musicToggle = document.getElementById("musicToggle");
const musicIcon = musicToggle.querySelector(".music-icon");
const musicHint = document.getElementById("musicHint");

function onYouTubeIframeAPIReady() {
  youtubePlayer = new YT.Player("youtube-player", {
    height: "0",
    width: "0",
    videoId: "7YDdfIeeJTU",
    playerVars: {
      autoplay: 0,
      controls: 0,
      disablekb: 1,
      enablejsapi: 1,
      fs: 0,
      iv_load_policy: 3,
      loop: 1,
      modestbranding: 1,
      playsinline: 1,
      rel: 0,
      showinfo: 0,
      mute: 0,
    },
    events: {
      onReady: onPlayerReady,
      onStateChange: onPlayerStateChange,
    },
  });
}

function onPlayerReady(event) {
  event.target.setVolume(100);


  setTimeout(() => {
    if (!musicPaused) {
      try {
        event.target.setVolume(100);
        event.target.playVideo();
        musicStarted = true;

        musicToggle.classList.add("playing");

        setTimeout(() => {
          musicHint.classList.add("show");
          musicHint.setAttribute("aria-hidden", "false");

          setTimeout(() => {
            if (
              event.target.getPlayerState() === YT.PlayerState.PLAYING &&
              !event.target.isMuted()
            ) {
              musicHint.classList.remove("show");
              musicHint.setAttribute("aria-hidden", "true");
            }
          }, 5000);
        }, 500);
      } catch (e) {
        console.log("Autoplay blocked by browser");
        musicHint.classList.add("show");
        musicHint.setAttribute("aria-hidden", "false");
      }
    }
  }, 10000);
}

function onPlayerStateChange(event) {
  if (event.data === YT.PlayerState.PLAYING) {
    musicToggle.classList.add("playing");
    musicPaused = false;

    if (youtubePlayer && !youtubePlayer.isMuted()) {
      musicHint.classList.remove("show");
      musicHint.setAttribute("aria-hidden", "true");
    }
  } else if (event.data === YT.PlayerState.PAUSED) {
    musicToggle.classList.remove("playing");
    musicPaused = true;
  }
}

musicToggle.addEventListener("click", () => {
  if (!youtubePlayer) return;

  musicHint.classList.remove("show");
  musicHint.setAttribute("aria-hidden", "true");

  youtubePlayer.unMute();
  youtubePlayer.setVolume(100);

  const currentState = youtubePlayer.getPlayerState();
  const isMuted = youtubePlayer.isMuted();

  if (currentState === YT.PlayerState.PLAYING && !isMuted) {
    youtubePlayer.pauseVideo();
    musicPaused = true;
    musicToggle.classList.remove("playing");
  } else {
    if (isMuted) {
      youtubePlayer.unMute();
    }
    youtubePlayer.playVideo();
    musicPaused = false;
    musicStarted = true;
    musicToggle.classList.add("playing");
  }
});
