# Portfolio Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the front-end portfolio (`my-portfolio-front/`) as a calm, content-first, "uncodixfied" single page driven by the resume, replacing the navy/purple AI-template look while keeping the background music and light/dark toggle.

**Architecture:** Vanilla HTML/CSS/JS, no framework. One reading-column page. A CSS custom-property design system (light default + `html.dark`) is installed first; page sections are then filled in top-to-bottom against that system; behaviors (theme, mobile nav, contact form, music) live in a trimmed `script.js`.

**Tech Stack:** HTML5, CSS (custom properties), vanilla JS, IBM Plex Sans/Mono (Google Fonts), FormSubmit (contact), YouTube IFrame API (music). Branch: `redesign-portfolio`.

---

## Conventions

- **Dev server (run once, keep running):** from repo root,
  `python -m http.server 8753 --directory my-portfolio-front --bind 127.0.0.1`
  then open `http://127.0.0.1:8753/index.html`.
- **Visual verification:** use the Playwright MCP (`browser_navigate`, `browser_snapshot`, `browser_take_screenshot`). Note: in a sandbox without internet, Google Fonts and YouTube won't load — verify **layout/structure/toggle** there; verify **fonts + music** in the user's real browser.
- **uncodixfy check (run mentally each task):** no eyebrow/uppercase labels, no serif-display+sans combo, no pills/badges, no gradients/glows, no shadows >8px, radius ≤6–8px, one calm accent, hairline borders, normal components.
- **Decisions locked for this plan (user may veto at review):** Projects curated to **4** (no filter buttons); **no decorative cultural ornament** (culture via content + the song); contact keeps a **plain form + email link**.

---

## File Structure

- `my-portfolio-front/index.html` — full rewrite. Header, `<main>` with sections (intro, experience, skills, projects, beyond, contact), footer, fixed music control, hidden YT mount, script tags.
- `my-portfolio-front/style.css` — full rewrite. Design tokens (light + dark), reset, base typography, and all component styles.
- `my-portfolio-front/script.js` — full rewrite. Theme toggle (localStorage), mobile nav, footer year, contact form (FormSubmit), background music (YouTube).
- Backend (`my-portfolio-backend/`) untouched.

---

### Task 1: Design system + page skeleton + base behaviors

**Files:**
- Modify (replace): `my-portfolio-front/style.css`
- Modify (replace): `my-portfolio-front/index.html`
- Modify (replace): `my-portfolio-front/script.js`

- [ ] **Step 1: Replace `style.css` with the full design system**

```css
/* ===== Design tokens ===== */
:root{
  --bg:#f7f4ef; --surface:#ffffff; --text:#1b1a18; --muted:#6b6660;
  --border:#e4ded4; --accent:#9a3328; --accent-weak:#9a332814;
}
html.dark{
  --bg:#141310; --surface:#1b1916; --text:#ece7dd; --muted:#928b7e;
  --border:#2a2620; --accent:#c4634f; --accent-weak:#c4634f1a;
}

/* ===== Reset ===== */
*,*::before,*::after{ box-sizing:border-box; }
*{ margin:0; padding:0; }
html{ scroll-behavior:smooth; }

/* ===== Base ===== */
body{
  background:var(--bg); color:var(--text);
  font-family:'IBM Plex Sans',system-ui,sans-serif; font-size:16px; line-height:1.6;
  -webkit-font-smoothing:antialiased;
  transition:background-color .2s ease,color .2s ease;
}
.mono{ font-family:'IBM Plex Mono',ui-monospace,monospace; }
a{ color:var(--accent); text-decoration:none; }
a:hover{ text-decoration:underline; text-underline-offset:3px; }
.page{ max-width:680px; margin:0 auto; padding:0 24px 80px; }

/* ===== Header ===== */
header.site{ display:flex; justify-content:space-between; align-items:center;
  padding:26px 0; border-bottom:1px solid var(--border); }
header.site .name{ font-weight:600; font-size:15px; }
.nav{ display:flex; align-items:center; }
.nav .links a{ color:var(--text); font-size:14px; margin-left:20px; }
.nav .links a:hover{ color:var(--accent); text-decoration:none; }
.toggle{ background:none; border:1px solid var(--border); color:var(--muted);
  font-family:'IBM Plex Mono',monospace; font-size:12px; padding:5px 9px;
  border-radius:6px; cursor:pointer; margin-left:20px; }
.toggle:hover{ color:var(--text); border-color:var(--muted); }
.nav-toggle{ display:none; }

/* ===== Intro ===== */
.intro{ padding:48px 0 8px; }
.intro h1{ font-size:30px; font-weight:600; letter-spacing:-.01em; margin-bottom:6px; }
.intro .role{ color:var(--muted); font-size:16px; margin-bottom:20px; }
.intro p{ margin-bottom:16px; max-width:62ch; }
.intro .links{ font-size:14px; color:var(--muted); margin-top:22px; }
.intro .links a{ margin-right:14px; }
.intro .links .avail{ margin-top:8px; }

/* ===== Sections ===== */
section{ padding:34px 0; border-top:1px solid var(--border); }
section h2{ font-size:15px; font-weight:600; margin-bottom:20px; }

/* ===== Experience ===== */
.job{ margin-bottom:26px; }
.job:last-child{ margin-bottom:0; }
.job .line{ display:flex; justify-content:space-between; align-items:baseline; gap:16px; }
.job .title{ font-weight:600; font-size:15px; }
.job .when{ color:var(--muted); font-size:12.5px; white-space:nowrap; }
.job .co{ color:var(--accent); font-size:14px; margin:1px 0 8px; }
.job p{ color:var(--muted); font-size:14.5px; }
.job.sub{ margin-left:18px; padding-left:16px; border-left:1px solid var(--border); }

/* ===== Skills ===== */
.skills .row{ display:grid; grid-template-columns:120px 1fr; gap:8px 18px;
  padding:9px 0; border-bottom:1px solid var(--border); font-size:14.5px; }
.skills .row:last-child{ border-bottom:none; }
.skills .k{ color:var(--muted); }

/* ===== Projects ===== */
.proj{ display:flex; justify-content:space-between; align-items:baseline; gap:16px;
  padding:11px 0; border-bottom:1px solid var(--border); }
.proj:last-child{ border-bottom:none; }
.proj .pn{ font-weight:500; font-size:15px; color:var(--text); }
.proj .pd{ color:var(--muted); font-size:14px; }
.proj a{ font-size:13px; white-space:nowrap; }

/* ===== Beyond work ===== */
.facts p{ font-size:14.5px; color:var(--muted); margin-bottom:10px; }
.facts p:last-child{ margin-bottom:0; }
.facts b{ color:var(--text); font-weight:500; }

/* ===== Contact form ===== */
.contact-lead{ color:var(--muted); font-size:14.5px; max-width:58ch; margin-bottom:18px; }
.field{ margin-bottom:14px; }
.field label{ display:block; font-size:13px; margin-bottom:5px; }
.field input,.field select,.field textarea{
  width:100%; background:var(--surface); color:var(--text);
  border:1px solid var(--border); border-radius:6px; padding:9px 11px;
  font-family:inherit; font-size:14px; }
.field textarea{ resize:vertical; min-height:96px; }
.field input:focus,.field select:focus,.field textarea:focus{
  outline:none; border-color:var(--accent); box-shadow:0 0 0 2px var(--accent-weak); }
.btn{ background:var(--accent); color:#fff; border:none; border-radius:6px;
  padding:10px 18px; font-family:inherit; font-size:14px; font-weight:500; cursor:pointer; }
.btn:hover{ opacity:.92; }
.btn:disabled{ opacity:.6; cursor:not-allowed; }
.form-note{ font-size:13px; margin-top:10px; min-height:18px; }
.email-line{ margin-top:16px; font-size:14px; color:var(--muted); }

/* ===== Footer ===== */
footer.site{ padding:34px 0 0; border-top:1px solid var(--border); color:var(--muted); font-size:13px; }
footer.site .row{ display:flex; justify-content:space-between; flex-wrap:wrap; gap:10px; }
.nar{ color:var(--accent); }

/* ===== Music control ===== */
.music{ position:fixed; right:18px; bottom:18px; z-index:20;
  background:var(--surface); border:1px solid var(--border); color:var(--muted);
  font-family:'IBM Plex Mono',monospace; font-size:12px; padding:7px 11px;
  border-radius:6px; cursor:pointer; display:flex; align-items:center; gap:7px; }
.music:hover{ color:var(--text); border-color:var(--muted); }
.music .dot{ width:6px; height:6px; border-radius:50%; background:var(--muted); }
.music.playing .dot{ background:var(--accent); }

/* ===== Responsive ===== */
@media (max-width:640px){
  .nav .links{ display:none; position:absolute; top:62px; right:24px; left:24px;
    flex-direction:column; background:var(--surface); border:1px solid var(--border);
    border-radius:8px; padding:8px; z-index:30; }
  .nav .links.open{ display:flex; }
  .nav .links a{ margin:0; padding:8px; }
  .nav-toggle{ display:inline-block; background:none; border:1px solid var(--border);
    color:var(--text); border-radius:6px; padding:5px 10px; cursor:pointer; margin-left:14px;
    font-size:14px; line-height:1; }
  .intro h1{ font-size:26px; }
  .job .line{ flex-direction:column; gap:2px; }
  .skills .row{ grid-template-columns:1fr; gap:2px; }
}
```

- [ ] **Step 2: Replace `index.html` with the skeleton (sections empty for now)**

```html
<!DOCTYPE html>
<html lang="en" class="light">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Shabnam Nazarli — AI-Oriented Software Engineer</title>
  <meta name="description" content="Shabnam Nazarli — AI-Oriented Software Engineer based in Baku, Azerbaijan. Backend systems in Go, Python, and TypeScript." />
  <link rel="stylesheet" href="style.css" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;500;600&display=swap" rel="stylesheet" />
</head>
<body>
  <div class="page">
    <header class="site">
      <span class="name">Shabnam Nazarli</span>
      <nav class="nav">
        <span class="links" id="navLinks">
          <a href="#experience">Experience</a>
          <a href="#projects">Projects</a>
          <a href="#contact">Contact</a>
        </span>
        <button class="toggle mono" id="themeToggle" aria-label="Toggle theme">dark</button>
        <button class="nav-toggle" id="navToggle" aria-label="Menu">≡</button>
      </nav>
    </header>

    <main>
      <!-- intro: Task 2 -->
      <!-- experience: Task 3 -->
      <!-- skills: Task 4 -->
      <!-- projects: Task 5 -->
      <!-- beyond: Task 6 -->
      <!-- contact: Task 7 -->
    </main>

    <footer class="site">
      <div class="row">
        <span>© <span id="year"></span> Shabnam Nazarli · Baku</span>
        <span>Playing: <span class="nar">Bu Qala Daşlı Qala</span> ♪</span>
      </div>
    </footer>
  </div>

  <button class="music mono" id="musicBtn" aria-label="Toggle background music">
    <span class="dot"></span> music
  </button>
  <div id="yt" style="display:none"></div>

  <script src="https://www.youtube.com/iframe_api"></script>
  <script src="script.js"></script>
</body>
</html>
```

- [ ] **Step 3: Replace `script.js` with base behaviors (theme, mobile nav, year)**

```js
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
```

- [ ] **Step 4: Serve and verify the shell**

Run (keep running): `python -m http.server 8753 --directory my-portfolio-front --bind 127.0.0.1`
Then via Playwright MCP: `browser_navigate` to `http://127.0.0.1:8753/index.html`, then `browser_take_screenshot`.
Expected: warm off-white page; header shows "Shabnam Nazarli" left, "Experience / Projects / Contact / dark" right; empty body; footer with year + "Bu Qala Daşlı Qala ♪"; a "● music" control bottom-right. Click `#themeToggle` (`browser_click`) → page flips to warm near-black, label reads "light". No purple/navy anywhere.

- [ ] **Step 5: Commit**

```bash
git add my-portfolio-front/style.css my-portfolio-front/index.html my-portfolio-front/script.js
git commit -m "feat(ui): install uncodixfied design system + page shell"
```

---

### Task 2: Intro block

**Files:**
- Modify: `my-portfolio-front/index.html` (replace `<!-- intro: Task 2 -->`)

- [ ] **Step 1: Insert the intro markup**

```html
<section class="intro" id="top">
  <h1>Shabnam Nazarli</h1>
  <div class="role">AI-Oriented Software Engineer — Baku, Azerbaijan</div>
  <p>I build backend systems that hold up in production: high-throughput APIs, transaction-safe workflows, and the boring-on-purpose reliability that keeps payments and orders correct under load. Three years across fintech, healthcare, and enterprise — mostly Go, Python, and TypeScript.</p>
  <p>I like owning a problem end to end, finding where the real constraints are, and making the pragmatic call between shipping fast and getting it right.</p>
  <div class="links mono">
    <a href="https://github.com/nazarli-shabnam" target="_blank" rel="noreferrer">GitHub</a>
    <a href="https://www.linkedin.com/in/shabnamnazarli/" target="_blank" rel="noreferrer">LinkedIn</a>
    <a href="mailto:shabnamnezerli@gmail.com">Email</a>
    <div class="avail">Open to remote roles.</div>
  </div>
</section>
```

- [ ] **Step 2: Verify**

Reload `http://127.0.0.1:8753/index.html` and `browser_take_screenshot`.
Expected: large "Shabnam Nazarli" heading, muted role line, two paragraphs (≤62ch wide), a row of monospace links (GitHub/LinkedIn/Email) in pomegranate, "Open to remote roles." beneath. Links are accent-colored; no pills, no eyebrow label.

- [ ] **Step 3: Commit**

```bash
git add my-portfolio-front/index.html
git commit -m "feat(ui): add intro block"
```

---

### Task 3: Experience section

**Files:**
- Modify: `my-portfolio-front/index.html` (replace `<!-- experience: Task 3 -->`)

- [ ] **Step 1: Insert the experience markup**

```html
<section id="experience">
  <h2>Experience</h2>

  <div class="job">
    <div class="line"><span class="title">Golang Backend Developer</span><span class="when mono">2026 — Present</span></div>
    <div class="co">Alievs Space LLC</div>
    <p>High-throughput Go services for e-commerce — catalog, orders, payments, inventory. Idempotent, retry-safe pipelines; PostgreSQL tuned with EXPLAIN, partial indexes, and N+1 elimination; Redis caching under peak traffic.</p>
  </div>

  <div class="job">
    <div class="line"><span class="title">Backend Developer</span><span class="when mono">2024 — 2025</span></div>
    <div class="co">Andersen</div>
    <p>Three client projects across enterprise, healthcare, and fintech — TypeScript/Node.js and Python/FastAPI.</p>
  </div>

  <div class="job sub">
    <div class="line"><span class="title">Python Backend — PRetty (Banking)</span><span class="when mono">2025</span></div>
    <p>Async FastAPI with idempotency guarantees and distributed locking to prevent race conditions in financial operations. Domain-driven structure for long-term maintainability.</p>
  </div>

  <div class="job sub">
    <div class="line"><span class="title">Node.js — NoDaNorm MedCare</span><span class="when mono">2024 — 2025</span></div>
    <p>Modular NestJS services for healthcare workflows, with validation, guards, audit logging, and tuned PostgreSQL access.</p>
  </div>

  <div class="job sub">
    <div class="line"><span class="title">Node.js — Digital Giant Support</span><span class="when mono">2024</span></div>
    <p>Backend APIs for a high-volume digital-asset platform: centralized error handling, review workflows, and DynamoDB/AuroraDB integration on AWS ECS.</p>
  </div>

  <div class="job">
    <div class="line"><span class="title">IT Specialist, Software &amp; Infrastructure</span><span class="when mono">2024 — 2026</span></div>
    <div class="co">Texno Construction LLC</div>
    <p>Owned uptime of internal systems. Automated operational work with Python and shell, ran incident response, and introduced monitoring and logging across Linux/Windows environments.</p>
  </div>
</section>
```

- [ ] **Step 2: Verify**

Reload and `browser_take_screenshot`.
Expected: "Experience" heading; six entries; Andersen's three sub-roles indented with a thin left rule; dates right-aligned in monospace/muted; company names in pomegranate. No cards/badges/shadows.

- [ ] **Step 3: Commit**

```bash
git add my-portfolio-front/index.html
git commit -m "feat(ui): add experience section"
```

---

### Task 4: Skills section

**Files:**
- Modify: `my-portfolio-front/index.html` (replace `<!-- skills: Task 4 -->`)

- [ ] **Step 1: Insert the skills markup**

```html
<section id="skills">
  <h2>Skills</h2>
  <div class="skills">
    <div class="row"><span class="k">Languages</span><span>Go, Python, TypeScript, JavaScript, SQL, PHP, C/C++</span></div>
    <div class="row"><span class="k">Backend</span><span>FastAPI, Django, NestJS, async I/O, background jobs, event-driven patterns</span></div>
    <div class="row"><span class="k">Data</span><span>PostgreSQL, MongoDB, MySQL, DynamoDB, Redis</span></div>
    <div class="row"><span class="k">Infra</span><span>Docker, AWS ECS (Fargate), CI/CD, monitoring &amp; observability</span></div>
    <div class="row"><span class="k">Focus</span><span>Idempotency, concurrency control, performance tuning, microservices</span></div>
  </div>
</section>
```

- [ ] **Step 2: Verify**

Reload and `browser_take_screenshot`.
Expected: five rows, left column muted label (~120px), right column plain comma-separated text. No pills/tags. No `%` bars.

- [ ] **Step 3: Commit**

```bash
git add my-portfolio-front/index.html
git commit -m "feat(ui): add skills section"
```

---

### Task 5: Projects section (curated, no filters)

**Files:**
- Modify: `my-portfolio-front/index.html` (replace `<!-- projects: Task 5 -->`)

- [ ] **Step 1: Insert the projects markup**

```html
<section id="projects">
  <h2>Projects</h2>
  <div class="proj">
    <div><div class="pn">Order Processing System</div><div class="pd">Event-driven microservices — Redis pub/sub, idempotency, async order handling.</div></div>
    <a href="https://github.com/nazarli-shabnam/order-processing" target="_blank" rel="noreferrer">Code →</a>
  </div>
  <div class="proj">
    <div><div class="pn">Subscription Tracker</div><div class="pd">FastAPI service for renewals, costs, and usage analytics. Clean architecture.</div></div>
    <a href="https://github.com/nazarli-shabnam/subscription-tracker" target="_blank" rel="noreferrer">Code →</a>
  </div>
  <div class="proj">
    <div><div class="pn">Medical Chatbot</div><div class="pd">RAG assistant on Gemini with vector retrieval and guarded prompts.</div></div>
    <a href="https://github.com/nazarli-shabnam/medical-chatbot" target="_blank" rel="noreferrer">Code →</a>
  </div>
  <div class="proj">
    <div><div class="pn">The9Books</div><div class="pd">Cataloguing API with search, filtering, and recommendations.</div></div>
    <a href="https://github.com/nazarli-shabnam/The9Books" target="_blank" rel="noreferrer">Code →</a>
  </div>
</section>
```

- [ ] **Step 2: Verify**

Reload and `browser_take_screenshot`.
Expected: four project rows, name + one-line description on the left, "Code →" link (accent) right-aligned; hairline separators; **no filter buttons**.

- [ ] **Step 3: Commit**

```bash
git add my-portfolio-front/index.html
git commit -m "feat(ui): add projects section"
```

---

### Task 6: Beyond work (languages, education, certifications)

**Files:**
- Modify: `my-portfolio-front/index.html` (replace `<!-- beyond: Task 6 -->`)

- [ ] **Step 1: Insert the markup**

```html
<section id="beyond">
  <h2>Beyond work</h2>
  <div class="facts">
    <p><b>Languages:</b> Azerbaijani (native), Turkish, English, Russian, French, Arabic.</p>
    <p><b>Education:</b> B.Sc. Computer Science, dual diploma — Université de Strasbourg &amp; UFAZ.</p>
    <p><b>Certifications:</b> ICPC Certificate of Achievement (2024), Constructor University, Harbour.Space.</p>
  </div>
</section>
```

- [ ] **Step 2: Verify**

Reload and `browser_take_screenshot`.
Expected: three plain lines, bold labels in full-strength text, the rest muted. No icons/flags/pills.

- [ ] **Step 3: Commit**

```bash
git add my-portfolio-front/index.html
git commit -m "feat(ui): add languages, education, certifications"
```

---

### Task 7: Contact (form + email) and behaviors (form + music)

**Files:**
- Modify: `my-portfolio-front/index.html` (replace `<!-- contact: Task 7 -->`)
- Modify: `my-portfolio-front/script.js` (append form + music handlers)

- [ ] **Step 1: Insert the contact markup**

```html
<section id="contact">
  <h2>Contact</h2>
  <p class="contact-lead">The quickest way to reach me is email, but the form works too — I read everything and reply to anything that isn't a recruiter blast.</p>
  <form id="contactForm">
    <div class="field">
      <label for="name">Name</label>
      <input id="name" name="name" type="text" required />
    </div>
    <div class="field">
      <label for="email">Email</label>
      <input id="email" name="email" type="email" required />
    </div>
    <div class="field">
      <label for="reason">Reason</label>
      <select id="reason" name="reason">
        <option value="Collaboration / Offer">Collaboration / Offer</option>
        <option value="Question">Question</option>
        <option value="Other">Other</option>
      </select>
    </div>
    <div class="field">
      <label for="message">Message</label>
      <textarea id="message" name="message" required></textarea>
    </div>
    <button class="btn" type="submit">Send message</button>
    <p class="form-note" aria-live="polite"></p>
  </form>
  <p class="email-line">Or just email <a href="mailto:shabnamnezerli@gmail.com">shabnamnezerli@gmail.com</a>.</p>
</section>
```

- [ ] **Step 2: Append form + music handlers to `script.js`**

```js
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
    const payload = {
      name,
      email: val('input[name="email"]'),
      reason: form.querySelector('select[name="reason"]').value,
      message: val('textarea[name="message"]'),
      _subject: `Portfolio: ${name || "Someone"} — ${form.querySelector('select[name="reason"]').value}`,
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
let player;
const musicBtn = document.getElementById("musicBtn");

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
      onReady: () => { player.setVolume(60); try { player.playVideo(); } catch (e) {} },
      onStateChange: (e) => {
        if (e.data === YT.PlayerState.PLAYING) musicBtn.classList.add("playing");
        else musicBtn.classList.remove("playing");
      },
    },
  });
};

if (musicBtn) {
  musicBtn.addEventListener("click", () => {
    if (!player) return;
    if (player.getPlayerState() === YT.PlayerState.PLAYING) {
      player.pauseVideo();
    } else {
      player.unMute();
      player.playVideo();
    }
  });
}
```

- [ ] **Step 3: Verify (real browser for music)**

Reload in the user's real browser (`http://127.0.0.1:8753/index.html`).
Expected: a plain form (labels above inputs, accent focus ring, "Send message" button in pomegranate) plus an email fallback line. Submitting a valid message shows "Sending…" then a success note and clears the form (a real email arrives via FormSubmit). The bottom-right "music" control's dot turns pomegranate when the track is playing; clicking pauses/resumes.
In the Playwright sandbox (no internet), at minimum confirm the form renders and `#musicBtn` exists; music/email can't be exercised offline.

- [ ] **Step 4: Commit**

```bash
git add my-portfolio-front/index.html my-portfolio-front/script.js
git commit -m "feat(ui): add contact form + restore music and form behaviors"
```

---

### Task 8: Responsive + cross-theme + uncodixfy final pass

**Files:**
- Verify only; small fixes to `my-portfolio-front/style.css` or `index.html` if issues found.

- [ ] **Step 1: Mobile check**

Via Playwright MCP: `browser_resize` to 390×844, navigate/reload, `browser_take_screenshot`.
Expected: header links collapse behind the `≡` button (theme toggle still visible); tapping `≡` opens a plain dropdown panel; intro/experience stack cleanly; skills rows go single-column; no horizontal scroll. Fix any overflow in the `@media (max-width:640px)` block if present.

- [ ] **Step 2: Both themes, full page**

Resize back to 1280×900. Screenshot full page in light, click `#themeToggle`, screenshot full page in dark.
Expected: both legible; dark is warm near-black (not navy/purple); single pomegranate accent in both; hairline borders; no gradients/glows/heavy shadows.

- [ ] **Step 3: uncodixfy self-check (read the rendered page against the skill)**

Confirm NONE present: eyebrow/uppercase labels; serif-display+sans combo; pills/badges; gradients/glows; shadows >8px; radius >8px; emoji bullets; `%` skill bars; reveal/typing animations. Confirm components are "normal" (plain header, list-based sections, standard form). Fix inline if any slip through.

- [ ] **Step 4: Final commit**

```bash
git add -A my-portfolio-front/
git commit -m "fix(ui): responsive + cross-theme polish; uncodixfy pass"
```

---

## Self-Review (completed by plan author)

**Spec coverage:**
- Layout / reading column / header+toggle → Task 1. ✓
- Typography (IBM Plex, no Inter/serif-combo) → Task 1 (fonts) + tokens. ✓
- Color tokens light+dark, single accent, warm dark → Task 1. ✓
- Components: experience list + Andersen sub-roles → Task 3; skills key/value → Task 4; projects list (curated 4, no filter) → Task 5; beyond (languages/education/certs) → Task 6; contact (form + email) → Task 7; footer song credit → Task 1 skeleton. ✓
- Content reconciliation (title, Alievs Space, Texno, Andersen umbrella, Go-led skills) → Tasks 2–4. ✓
- Removed AI tells (gradient/purple, emoji bullets, %bars, ornament, typing/reveal/pills) → not reintroduced anywhere; verified Task 8 step 3. ✓
- Kept features: music (Task 7), light/dark toggle (Task 1), contact form (Task 7), mobile nav (Task 1 + Task 8). ✓
- Minimal motion → only `.2s` color transition in Task 1; no transforms. ✓

**Placeholder scan:** No TBD/TODO; all code blocks complete; CV link intentionally omitted (resume is in gitignored `local/`, not deployed) — noted, not a placeholder.

**Type/selector consistency:** IDs/classes match across files — `#themeToggle`, `#navToggle`/`#navLinks`, `#year`, `#contactForm`/`.form-note`/`select[name="reason"]`, `#musicBtn`/`.music.playing .dot`, `#yt`. CSS classes used in HTML (`.job.sub`, `.skills .row`, `.proj`, `.facts`, `.field`, `.music`) are all defined in Task 1. ✓

## Open items for user (confirm at review, not blockers)
- Projects curated to 4 + filter buttons dropped — OK?
- No decorative cultural ornament (culture via content + song) — OK, or add one small mark?
- Contact: keep the form **and** email link — OK? (Demo showed email-only.)
- Optional: add a hosted CV/résumé link in the intro (currently omitted since the PDF lives in gitignored `local/`).
