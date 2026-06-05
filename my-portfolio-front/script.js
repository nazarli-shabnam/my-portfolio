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
