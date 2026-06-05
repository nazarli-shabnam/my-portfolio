# Portfolio Redesign — Design Spec

**Date:** 2026-06-05
**Branch:** `redesign-portfolio`
**Status:** Approved direction, pending implementation plan

## Goal

Redesign Shabnam Nazarli's personal portfolio so it reads as **human-designed, not AI-generated**, is **more user-friendly**, and stands out to **remote/abroad recruiters** through cultural identity expressed with restraint. The current site looks like a generic AI portfolio (deep-navy + purple gradients, emoji bullets, skill % bars, decorative glow). We replace the entire visual language while keeping the content honest to the resume.

The redesign is driven by two sources:
1. The user's resume (`local/001shabnam-nazarli.pdf`) — the **source of truth** for identity, title, roles, skills, education, languages, certifications.
2. The `uncodixfy` skill — the governing aesthetic constraint (anti-generic-AI UI: calm, plain, content-first, à la Linear / GitHub / Stripe).

## Audience & framing

- **Primary audience:** recruiters / hiring managers for backend roles, including remote and abroad.
- **Positioning:** "AI-Oriented Software Engineer" (resume title) based in Baku, Azerbaijan, open to remote.
- **Cultural angle:** stands out via *substance* (Baku, six languages, the background folk song "Bu Qala Daşlı Qala"), **not** via decorative graphics. The music itself carries the heritage.

## Chosen direction: "Uncodixfied" (restrained, content-first)

A single clean reading-column layout. Approved via interactive demo (`uncodixfied.html`).

### Layout
- Centered reading column, **max-width ~680px**, generous vertical rhythm.
- Simple sticky-less header: name (left) + minimal nav (Experience, Projects, Contact) + light/dark toggle (right).
- Sections separated by **1px hairline borders**, normal-case `h2` headings (no uppercase eyebrows, no letter-spaced labels).
- No hero panel, no cards-as-decoration, no asymmetric/"creative" composition.

### Typography
- **One family:** IBM Plex Sans for text; IBM Plex Mono only for functional bits (dates, email, toggle label).
- Body 16px / line-height 1.6. `h1` ~30px, section `h2` ~15px.
- **Banned:** serif-display-over-sans "premium" combo; Inter / Roboto / system default stacks.

### Color (design tokens)
Light (default):
```
--bg:#f7f4ef  --surface:#ffffff  --text:#1b1a18  --muted:#6b6660
--border:#e4ded4  --accent:#9a3328 (muted pomegranate "nar")  --accent-weak:#9a332814
```
Dark (toggle):
```
--bg:#141310  --surface:#1b1916  --text:#ece7dd  --muted:#928b7e
--border:#2a2620  --accent:#c4634f  --accent-weak:#c4634f1a
```
- **One restrained accent** (pomegranate) for links + company names only. Dark mode is a **warm near-black**, never navy/purple.
- No gradients, no glows, no colored/dramatic shadows. Borders are hairline 1px. Radius ≤ 6px.

### Components (all "normal")
- **Experience:** plain list. Each entry = role (bold) + dates (mono, muted) + company (accent) + 1–2 line description. Andersen's sub-roles (PRetty Banking, NoDaNorm MedCare, Digital Giant) indented under it with a thin left rule.
- **Skills:** plain key/value rows (no pills/badges).
- **Projects:** simple list — name, one-line description, "Code →" link.
- **Beyond work:** Languages (6), Education (dual diploma Strasbourg & UFAZ), Certifications (ICPC, Constructor, Harbour.Space) as plain text.
- **Contact:** short line + email (mono).
- **Footer:** copyright + quiet "Playing: Bu Qala Daşlı Qala ♪".

### Motion
- Minimal. Simple 100–200ms opacity/color transitions only. No transform/bounce/reveal-on-scroll theatrics.

## Content reconciliation (resume vs. current site)

Apply these resume-driven changes:
- **Title:** "Backend Developer & AI Enthusiast" → **"AI-Oriented Software Engineer"**.
- **Add current role:** Golang Backend Developer @ Alievs Space LLC (2026–Present).
- **Add role:** IT Specialist, Software & Infrastructure @ Texno Construction LLC (2024–2026).
- **Restructure Andersen** as an umbrella over its sub-roles, including **PRetty (Banking System)**.
- **Add sections:** Education; Languages (6); Certifications.
- **Skills additions:** Go, PHP, C/C++, Django, React, MongoDB, MySQL (Go leads — it's the current role).
- **Projects:** keep real GitHub projects (Order Processing, Subscription Tracker, Medical Chatbot, The9Books, NoDaNorm, ReadAble) — curate to the strongest.
- **Contact/links:** GitHub `nazarli-shabnam`, LinkedIn `shabnamnazarli`, email `shabnamnezerli@gmail.com`, CV link.

## Explicitly removed (AI tells)
- Deep-navy + purple gradient palette and radial glow background.
- Emoji bullets (⚙️🧪📦☁️🤖📧💻🔗) and emoji-led lists.
- Skill "comfort level" % progress bars.
- Decorative ornament of any kind (including the Maiden Tower / buta / carpet motifs explored and rejected during brainstorming).
- Typing animation in hero; reveal-on-scroll animations; pill tags; dramatic shadows.

## Kept features (behavior preserved)
- **Background music** ("Bu Qala Daşlı Qala" via YouTube iframe API) with the floating toggle — restyled to match (no emoji icon; plain control).
- **Light/dark theme toggle** with `localStorage` persistence.
- **Contact form** posting to FormSubmit (existing token/flow) with loading + success/error states.
- Mobile-responsive nav.

## Tech / structure
- Static front-end in `my-portfolio-front/` (`index.html`, `style.css`, `script.js`). Stay vanilla HTML/CSS/JS — no framework introduced.
- Rework `index.html` structure + `style.css` to the new token system; trim `script.js` (remove typing loop, reveal observer, filter buttons if filters are dropped; keep theme toggle, music, form, mobile nav, year).
- Backend (`my-portfolio-backend/`) is out of scope.

## Out of scope
- Backend changes; new build tooling/frameworks; CMS; analytics; copywriting beyond resume reconciliation; the rejected ornamental directions (A/B/C from brainstorming).

## Success criteria
- No purple/navy gradient, emoji bullets, %-bars, or decorative ornament remain.
- Passes an `uncodixfy` self-check (no eyebrows, no serif+sans premium combo, no pills/glows/dramatic shadows, calm single accent, normal components).
- Content matches the resume (title, roles incl. Alievs Space & Texno, education, 6 languages, certifications).
- Music + light/dark toggle + contact form all still work.
- Renders cleanly on desktop and mobile in both themes.
- User reviews the running demo on the branch and approves **before** anything merges to `main`.

## Open follow-up (post-approval)
- Optional single tasteful cultural mark (one thin section divider motif **or** one short Azerbaijani phrase) — only if the user wants the culture dialed up one notch. Default is none.
- Decide whether to keep the Projects filter control or drop it (leaning drop, for restraint).
