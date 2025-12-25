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

// ========== Contact Form ==========
const form = document.getElementById("contactForm");

if (!form) {
  console.error("Contact form not found!");
} else {
  const submitButton = form.querySelector('button[type="submit"]');
  const formNote = form.querySelector(".form-note");

  // API URL configuration - works for both local and production
  // In production, set this to your Render backend URL
  const API_BASE_URL =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
      ? "http://localhost:8000" // Local development
      : "https://my-portfolio-avxr.onrender.com";

  // Helper function to show form feedback
  function showFormFeedback(message, isError = false) {
    if (!formNote) return;

    formNote.textContent = message;
    formNote.style.color = isError ? "var(--danger)" : "var(--accent-strong)";
    formNote.style.display = "block";

    // Auto-hide success messages after 5 seconds
    if (!isError) {
      setTimeout(() => {
        formNote.style.display = "none";
      }, 5000);
    }
  }

  // Helper function to set form loading state
  function setFormLoading(isLoading) {
    submitButton.disabled = isLoading;
    submitButton.textContent = isLoading ? "Sending..." : "Send Message";
    submitButton.style.opacity = isLoading ? "0.7" : "1";
    submitButton.style.cursor = isLoading ? "not-allowed" : "pointer";

    // Disable all form fields while submitting
    const formFields = form.querySelectorAll("input, select, textarea");
    formFields.forEach((field) => {
      field.disabled = isLoading;
    });
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Hide previous feedback
    if (formNote) {
      formNote.style.display = "none";
    }

    // Set loading state
    setFormLoading(true);

    try {
      // Get form values directly from form elements
      const nameInput = form.querySelector('input[name="name"]');
      const emailInput = form.querySelector('input[name="email"]');
      const reasonSelect = form.querySelector('select[name="reason"]');
      const messageTextarea = form.querySelector('textarea[name="message"]');

      // Get values with null safety
      const name = nameInput ? nameInput.value : "";
      const email = emailInput ? emailInput.value : "";
      const reason = reasonSelect ? reasonSelect.value : "other";
      const message = messageTextarea ? messageTextarea.value : "";

      // Debug logging (remove in production)
      console.log("Form elements found:", {
        nameInput: !!nameInput,
        emailInput: !!emailInput,
        reasonSelect: !!reasonSelect,
        messageTextarea: !!messageTextarea,
      });
      console.log("Form values:", { name, email, reason, message });

      const payload = {
        name: name ? name.trim() : "",
        email: email ? email.trim() : "",
        reason: reason || "other",
        message: message ? message.trim() : "",
      };

      console.log("Payload after trim:", payload);

      // Basic client-side validation with specific error messages
      const missingFields = [];
      if (!payload.name || payload.name.length === 0) {
        missingFields.push("name");
      }
      if (!payload.email || payload.email.length === 0) {
        missingFields.push("email");
      }
      if (!payload.message || payload.message.length === 0) {
        missingFields.push("message");
      }

      if (missingFields.length > 0) {
        throw new Error(`Please fill in: ${missingFields.join(", ")}`);
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(payload.email)) {
        throw new Error("Please enter a valid email address.");
      }

      const response = await fetch(`${API_BASE_URL}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // Check if response is JSON
      const contentType = response.headers.get("content-type");
      let data = {};

      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        // If not JSON, get text response
        const text = await response.text();
        throw new Error(text || "Server returned an unexpected response.");
      }

      if (response.ok) {
        // Success
        showFormFeedback(
          data.message ||
            "Thanks! Your message was sent ✨ I'll get back to you soon.",
          false
        );
        form.reset();
      } else {
        // Server returned an error
        throw new Error(
          data.detail ||
            data.message ||
            "Something went wrong. Please try again."
        );
      }
    } catch (error) {
      // Network error or validation error
      let errorMessage = "Oops! Something went wrong. ";

      if (
        error.message.includes("Failed to fetch") ||
        error.message.includes("NetworkError")
      ) {
        errorMessage += "Please check your connection and try again.";
      } else {
        errorMessage += error.message;
      }

      showFormFeedback(errorMessage, true);
    } finally {
      // Reset loading state
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
