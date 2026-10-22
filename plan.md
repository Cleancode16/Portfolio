# Portfolio — Prompts and Actions

A record of every request made for this portfolio and what was done in response, in order.
File-level detail for each step is in `IMPLEMENTATION_LOG.md`; setup instructions are in `README.md`.

> Private contact addresses are deliberately not written here. The recipient lives only in the
> git-ignored `.env` as `CONTACT_TO_EMAIL`.

---

## Overview

| # | Prompt | Outcome |
|---|---|---|
| 1 | Build a premium Apple-inspired portfolio | Full application built on the Vite scaffold |
| 2 | Console error: `Cannot access 'ctx' before initialization` | Fixed in `useGsap` |
| 3 | Refine design, hero copy, About, remove My Journey, CGPA 8.97 | Implemented |
| 4 | Same refinement brief sent again | Verified already in place; no changes |
| 5 | Rounded-rectangle CTA buttons | 10px radius on the shared button class |
| 6 | Replace the MERN highlight with first-principles positioning | New hero headline, description and focus strip |
| 7 | Resend error 403 (testing emails only to own address) | Diagnosed; configuration options given |
| 8 | macOS Dock + Launchpad for tools and technologies | Implemented with brand icons |
| 9 | Recruiter-friendly section order | Reordered; new Education section; featured projects |
| 10 | Summarise everything in plan.md | This file |
| 11 | Set project order: Event-Connect, CodeBattle, CraftConnect, CollabCodeEditor, then the rest | Reordered |
| 12 | Redesign About as an Aceternity-style bento grid with six illustrated cards | Implemented |
| 13 | Smoother motion, real coding-profile links, Recharts ratings chart | Implemented |
| 14 | macOS cursor and a "dive into the Mac world" arrival; smoother Dock | Implemented |
| 15 | Open case studies in a macOS-style window instead of expanding inline | Implemented |
| 16 | Redraw the hero avatar as a man with a good haircut and headphones; add role tags | Implemented |
| 17 | Remove the hero focus strip (Scalable Systems / First Principles / CP & DSA) | Removed |
| 18 | Bento grid for Education & Certifications; avatar matched to a reference sketch | Implemented |
| 19 | Avatar exactly like the reference; C++ on screen; Accepted card; "Developer mode" | Implemented |
| 20 | Avatar in the reference's line-art style, rest unchanged | Implemented |
| 21 | Line art in the previous colours; screens show API code, tests and deploy; CI card | Implemented |
| 22 | Asked why the chart says "Résumé figures · not live" | Explained; options offered |
| 23 | Flat unDraw-style avatar from a new reference | Implemented |
| 24 | Remove "not live"; live contest and rating graphs; desk and hands like the reference | Implemented |
| 25 | Replace only the avatar with a hand-drawn hoodie developer | Implemented |
| 26 | "I want the previous one, only better" | Flat avatar restored and refined |
| 27 | Rename "Competitive Programming" to "Problem Solving" | Renamed (nav, anchor, eyebrow) |
| 28 | Smooth dark ↔ light theme animation | Circular reveal from the toggle, cross-fade fallback |
| 29 | npm output with warnings (Recharts deprecated, cache-dir) | Recharts 3 upgrade; cache-dir explained |
| 30 | Vercel deployment hanging | Dev server was running instead of the build; build settings pinned in vercel.json |
| 31 | Education: no score bars; separate square bento groups. Add the CraftConnect live link | Implemented |
| 32 | Deployed contact form: "This request is not allowed" (403) | Origin check made robust; env values to fix |
| 33 | Bento design for the hero | Implemented |
| 34 | Fill empty hero space with text; remove glow; ruled lines background | Implemented |
| 35 | Aceternity-style grid-with-dots background for the page; no lines in the hero | Implemented |
| 36 | Fill the empty space in the hero Highlights card with text | Implemented |
| 37 | Roles: no compressed tags, one after another | Implemented |
| 38 | Centre the hero image; fill the empty space below with icons | Implemented |
| 39 | Add Low-Level Design and High-Level Design to the tools | New System Design skill group |
| 40 | Interested roles; new hero card content; recruiter-friendly project points; no "All" skills filter; certificate links; drifting background | Implemented |
| 41 | Esc should close the search (command palette) | Implemented |
| 42 | Codeforces missing from the ratings graph; remove the hero "Recent" block | Fixed / removed |
| 43 | More moving lines in the background; remove thin separator lines between sections and components | Implemented |
| 44 | Longer, thicker, faster lines in the background | Implemented |
| 45 | Remove the live-stats caption under the chart; add an Achievements heading | Implemented |

---

## 1. Build a premium Apple-inspired portfolio

**Prompt (summary):** Act as a senior frontend architect and turn the repo into a production-quality portfolio:
React + Vite, Tailwind CSS v3 only, Recoil for shared state, GSAP + ScrollTrigger, Lucide icons (no emojis).
Apple-style typography and visual identity; complete light and dark themes (OS preference on first visit,
persisted, no flicker); a two-column hero with a coding-person illustration; floating glass navigation with
active section, mobile menu and optional Cmd/Ctrl+K palette; an authentic About section; six projects with
verified case studies; experience, skills and competitive programming; a form-only contact section with real
server-side email delivery and no public email or phone anywhere. The résumé PDF was attached.

**Actions**
- **Inspected the repo.** It was the untouched Vite template. `tailwind.config.js` used `module.exports` in an
  ESM package (broken). Portfolio-website sits inside a git repo rooted at the home folder, so nothing was committed.
- **Found a blocking incompatibility.** Recoil 0.7.7 reads a React internal on every `useRecoilValue` call, and
  React 19 removed it, so every Recoil hook would throw. Pinned `react` / `react-dom` to 18.3.1.
- **Dependencies:** added `gsap@3.13.0`; removed `react-router-dom` (single page); kept `react-hook-form`.
- **Verified every project before writing about it:**
  - Public READMEs: Event-Connect, codeBattle-MatchMaking1, innovathon-2026, major-part-2.
  - Convergence and collabcodeeditor are private, so they were checked from local clones
    (`Downloads/craftConnect`, `Downloads/codeEditor/CollabCodeEditor`).
  - Event-Connect's export and gallery claims were checked against its package manifests.
  - Live demos were linked only where the URL returned HTTP 200 (Event-Connect, CodeBattle, AcadBoost,
    CollabCodeEditor).
- **Design system:** RGB CSS-variable tokens for both themes, mapped to Tailwind colors; frosted `.glass` used
  selectively; button, chip and field classes; `clamp()` type scale.
- **State (Recoil):** `themeState` (with an atom effect for persistence and OS-follow), `mobileMenuState`,
  `commandPaletteState`, `activeSectionState`. An inline script in `index.html` applies the theme before first paint.
- **Components:**
  - Navbar with a GSAP-sliding active pill, mobile sheet, theme toggle and command palette.
  - Hero with an art-directed SVG workstation illustration (theme-aware, fixed aspect ratio).
  - About, Projects (alternating rows, case-study disclosure, six distinct previews, pointer tilt), Experience,
    Skills, Competitive Programming, Contact and Footer.
- **Motion:** `useGsap` (gsap.context + revert for Strict Mode), `useScrollReveal` (ScrollTrigger.batch); reduced
  motion respected throughout.
- **Contact backend:**
  - Shared handler `server/contact.js`, exposed as a Vercel function (`api/contact.js`) and as Vite dev/preview
    middleware.
  - Protections: input validation and sanitizing, JSON-only requests, optional origin allow-list, honeypot and
    minimum fill-time checks, per-IP rate limit, and plain-text email through the Resend REST API (no SDK).
  - "Sent" is shown only after Resend accepts the email.
  - Configuration: `.env.example` added; `.env` git-ignored.
- **Checks:** lint and build passed; bundle scanned for email, phone, `mailto:` and env names (none); the contact
  handler was exercised in Node (405, 415, 422, honeypot, 503, 403 and 429 all behaved correctly).
- **Docs:** README rewritten; `IMPLEMENTATION_LOG.md` created; a memory note saved for future sessions.

## 2. Console error — `Cannot access 'ctx' before initialization`

**Prompt:** A browser stack trace from `useGsap.js`, followed by 24 "Invalid scope" warnings from `ProjectRow`.

**Actions**
- **Cause:** `gsap.context(() => setup(ctx))` runs its callback immediately, before `ctx` exists. The exception
  also left GSAP's global context stuck, which produced the "Invalid scope" warnings from later calls.
- **Fix:** create the context first, then `ctx.add(() => setup(ctx))`. One file changed.
- **Checks:** lint and build passed.

## 3. Refine design — hero copy, About, remove My Journey

**Prompt (summary):**
- Exact Apple system font stack.
- Hero copy: eyebrow "Full-Stack Developer · First-Principles Thinker", headline "I turn complex problems into
  thoughtful software.", buttons "Explore My Work" and "Get in Touch".
- Four highlights: MERN, 600+, 2027, 8.97/10.
- Shortened About with four numbered principles.
- Remove the My Journey timeline; CGPA 8.97 everywhere.
- macOS-style project windows; form-only contact.

**Actions**
- **Font:** stack set to `-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`; Inter web font removed.
- **Hero:** rewritten with the supplied copy and highlights; illustration capped in width on phones and tablets.
- **About:** rewritten; facts list, My Journey timeline and "Beyond code" panel removed.
- **Data:** CGPA updated to 8.97.
- **Buttons and windows:** buttons lift on hover and press down; new translucent `btn-glass`; project previews
  use a new `.window` surface. Window controls remain only on the code-editor preview.
- **Mobile menu:** items animate in one after another.
- **Checks:** lint and build passed; old content absent from the bundle; privacy scan clean.

## 4. Same refinement brief sent again

**Actions:** Checked the files rather than redoing the work. Everything from step 3 was present, and lint and build
passed. Reported this and suggested restarting the dev server and hard-refreshing.

## 5. Rounded-rectangle CTA buttons

**Prompt:** Replace pill-shaped buttons with 8–10px corners, keeping colors, text, icons, hover lift, focus and
pressed states.

**Actions**
- **Shape:** the shared `.btn` class changed from `rounded-full` to `rounded-[10px]`, so all five CTA-style buttons
  match. Circular icon buttons are unchanged.
- **Hover:** soft hover shadows added to the secondary and glass buttons.
- **Focus fix:** removed `border-radius: 6px` from the global `:focus-visible` rule, which had been changing a
  control's shape when focused.
- **Checks:** lint and build passed; compiled CSS shows a 10px radius on all three button classes.

## 6. Replace the MERN highlight with first-principles positioning

**Prompt:**
- Headline "I build scalable software by thinking from first principles.", with the supplied description.
- Highlights: Scalable Systems, First Principles, CP & DSA.
- No invented expertise.

**Actions**
- **Copy:** new headline and description, word for word.
- **Focus strip:** the three areas in one glass strip with Lucide icons, stacked on phones.
- **Other figures:** 600+, Class of 2027 and CGPA 8.97/10 kept as one small line, since only MERN was asked to
  be removed. Flagged as easy to drop.
- **Checks:** lint and build passed.

## 7. Resend 403 — testing emails only to the account's own address

**Prompt:** The server log showed Resend rejecting a message sent from `onboarding@resend.dev` to an address other
than the Resend account owner's.

**Actions**
- Confirmed the code behaved correctly: the visitor saw an error, not a false "sent".
- Explained three configuration options:
  - Re-register Resend with the intended inbox (recommended).
  - Point `CONTACT_TO_EMAIL` at the account-owner inbox.
  - Verify an owned domain.
- Offered a Gmail SMTP alternative. No files changed; awaiting the user's choice.

## 8. Tools & technologies — macOS Dock + Launchpad

**Prompt (summary, truncated in the original):** App-style technology tiles with brand icons and categories; a
Dock-style hover (distance-based magnification, lift, tooltip, smooth reset); a Launchpad grid with hover states,
staggered entrance and animated category filters; no invented skills.

**Actions**
- **Icons:** added `simple-icons@^15` because Lucide 1.x has no brand icons. Only the 21 icons used are bundled
  (+14 kB gzip). Java uses the OpenJDK mark; SQL, REST and the CS fundamentals use Lucide icons.
- **Data:** `skillGroups` items became `{ name, icon }` with group ids; added `dockStack`. Same technologies as the
  résumé.
- **TechIcon:** squircle app icon in the brand color with a luminance-based glyph color, gloss and shadow;
  near-black brands use graphite so they stay visible in dark mode.
- **Dock:** glass Dock with smoothstep magnification (max +24%, 8px lift) through `gsap.quickTo` on transforms
  only, plus a shared sliding tooltip. Mouse only; static for touch and reduced motion.
- **Skills section:** Dock, a segmented category filter with a GSAP-sliding highlight, and a categorised
  Launchpad grid with a ScrollTrigger entrance and re-stagger on each filter change.
- **Checks:** lint and build passed; privacy scan clean.

## 9. Recruiter-friendly section order

**Prompt (summary):**
- Order: Hero, About, Featured Projects, Technical Skills, Experience, Education & Certifications, Competitive
  Programming, Contact; navigation to match.
- Strongest projects first.
- CGPA 8.97 and graduation 2027 kept; My Journey stays removed; contact details stay private.

**Actions**
- **Order:** `navigation.js` and `App.jsx` reordered. The scroll spy, command palette and footer follow
  automatically.
- **Education:** new section (`#education`), moved out of Experience.
- **Navbar:** with eight links, desktop links now show from 1280px; the existing menu is used below that.
- **Projects:** reordered by engineering depth with a `featured` flag. Featured rows: AI Proctoring, CodeBattle,
  CollabCodeEditor. Compact "More projects" cards: CraftConnect, AcadBoost AI, Event-Connect (new `compact`
  variant of `ProjectRow`). Project content and links unchanged.
- **Labels:** eyebrows renamed "Featured projects" and "Technical skills".
- **About:** "real-time systems" changed to "scalable systems and system design" to match the requested focus.
  Flagged for confirmation.
- **Checks:** lint and build passed; page order matches nav order; every nav id maps to one section; no 8.96 or
  journey content; privacy scan clean.

## 10. Summarise everything in plan.md

**Actions:** Created this file.

## 11. Custom project order

**Prompt:** "projects order eventconnect, code battle, craft connect, code collab editor and next".

**Actions**
- **Order in `src/data/projects.js`:** Event-Connect, CodeBattle, CraftConnect, CollabCodeEditor, AcadBoost AI,
  AI Proctoring System. "And next" was read as the remaining two in their original order.
- **Layout:** the first three are now featured full-width rows; the last three are compact "More projects" cards.
  Content and links unchanged.
- **Checks:** lint and build passed.

## 12. About as an Aceternity-style bento grid

**Prompt (summary):**
- Eyebrow "About", heading "How I think. How I build.", and the supplied subtitle, centred.
- Six cards with custom illustrations: First-Principles Thinking, End-to-End Engineering, Scalable Systems,
  Real-Time Applications, Problem Solving with CP & DSA, Build Debug Improve.
- Charcoal cards on near-black (light mode adapted), a 3/2/1-column grid, staggered entrances, subtle scene
  animations, hover lift and border light.
- No new dependencies; reduced motion respected; other sections unchanged.

**Actions**
- **Reference:** the Aceternity source is paywalled (All-Access), so the pattern was rebuilt from its public
  description. The screenshots mentioned in the request did not arrive.
- **New files:** `components/about/illustrations.jsx` (six SVG/HTML scenes with looping GSAP timelines) and
  `components/about/BentoCard.jsx` (card shell; the scene plays only while on screen).
- **About section:** rewritten as a centred heading plus a six-card grid; the old four-principle layout was
  removed. `SectionHeading` gained `align="center"`; `aboutCards` replaced `principles` in `profile.js`.
- **Bug fix along the way:** the project radar chart's SVG colors moved into `style` props.
- **Checks:** lint and build passed; new copy present; old About copy gone; privacy scan clean.

## 13. Motion polish, coding profiles and a Recharts chart

**Prompt (summary):**
- Make animations fluid: 200–400ms interactions, 500–800ms entrances, transforms and opacity only, no conflicting
  systems, proper cleanup, reduced motion respected.
- Add the LeetCode, Codeforces and CodeChef profile links as polished cards.
- Build a macOS-style Recharts bar chart of the résumé maximum ratings: "The numbers behind the practice", a
  themed glass tooltip, a text summary, labelled as not live, and no invented data.
- A screenshot of the Skills Dock was attached; every icon in it renders correctly.

**Actions**
- **Motion:**
  - Fixed stale ScrollTrigger positions after in-place height changes (new `useScrollTriggerRefresh`).
  - Tightened timings site-wide (detailed in `IMPLEMENTATION_LOG.md`).
  - The theme toggle now writes to the DOM before updating Recoil.
- **Profiles:**
  - Three glass cards with official platform icons, the handles, and 10px "View Profile" buttons.
  - Links open in a new tab with `rel="noopener noreferrer"`.
- **Chart:**
  - New `CpRatingsChart` (Recharts 2.15.4, lazy-loaded when near the viewport) with per-theme colors, a frosted
    tooltip, value labels, an empty state and a reduced-motion fallback.
  - Accompanied by a metrics column and a visible text summary.
- **Bundle:** vendor chunk splitting resolved the 500 kB warning.
- **Checks:**
  - Lint and build passed; URLs and ratings are in the bundle; privacy scan clean.
  - The LeetCode and Codeforces URLs return 403 to curl (bot protection), so they need a browser check.

## 14. macOS cursor, arrival experience, smoother Dock

**Prompts:**
- "change the cursor also match it same like mac one and whenever someone enters my portfolio they experience or
  dive into the mac world."
- Mid-task: "make this animation little bit more smooth", with a screenshot of the Skills Dock.

**Actions**
- **Cursor:** macOS-style arrow and pointing-hand SVG cursors in CSS (mouse and trackpad only; native I-beam in
  text fields).
- **Arrival:** a once-per-session boot screen (DB monogram plus progress bar on black, about 1.6s, skippable,
  off for reduced motion) that fades into the hero entrance. New `BootIntro` and `introPlayingState`.
- **Dock:** cached measurements, one update per frame, cosine falloff, and a longer power2 glide.
- **Checks:** lint and build passed; privacy scan clean.

## 15. Case studies in a macOS window

**Prompt:** "whenever I click, open the modal and close to see the info, rather than expanding it; make this
animation smoother and proper, and aesthetic to the Mac environment" (with a screenshot of the "Read case study"
button).

**Actions**
- **New `CaseStudyModal`:** a portal-rendered macOS window.
  - Frosted glass, title bar and traffic lights (close, minimise, zoom).
  - Opens from the clicked button and closes back toward it.
  - Focus trap, Escape and backdrop close, scroll lock and focus restore; reduced motion respected.
- **`ProjectRow`:** the inline expansion was removed and the button now opens the window.
- **Checks:** lint and build passed.

## 16. Hero avatar and roles

**Prompts:**
- "make the avatar look like a man, same position, with a good hairstyle, with headphones" (hero screenshot).
- Mid-task: "just add software development engineer, full stack developer, frontend developer, backend developer
  and fullstack AI developer" (screenshot of the focus strip).

**Actions**
- **Avatar:** redrawn in the same pose with a textured top and faded sides, a broader build, and over-ear
  headphones.
- **Roles:** a "Roles" tag row added under the hero focus strip with the five roles, in the order given.
- **Checks:** lint and build passed.

## 17. Remove the hero focus strip

**Prompt:** "remove this" (screenshot of the Scalable Systems / First Principles / CP & DSA strip).

**Actions:** Removed the strip, its icons and the `focusAreas` data. The Roles tags now follow the CTAs. Lint and
build passed.

## 18. Education bento and avatar reference

**Prompts:**
- "add bento here also" (screenshot of Education & Certifications).
- "refer this avatar" (a sketch of a man from behind with tousled hair and a hooded sweatshirt at the monitors).

**Actions**
- **Education:** rebuilt as a bento grid using the shared `BentoCard`.
  - Five illustrated cards: CGPA ring and degree progress, 97.7% bar, 10/10 dots, a certificate with a seal, and a
    DSA tree traversal.
  - Real figures only; animations play once when visible.
- **Avatar:** tousled spiky hair and a draped hood, following the reference. Headphones kept from the earlier
  request.
- **Checks:** lint and build passed; privacy scan clean.

## 19. Avatar like the reference, C++ screen, Accepted card

**Prompts:**
- "avatar need to be like this" (reference sketch).
- Mid-task: "not related to socket.io, something like problem solving accepted, and on the screen of the
  computer I want coding in C/C++, and at the bottom developer mode" (hero screenshot).

**Actions**
- **Scene:** recomposed the hero to match the reference.
  - A centred figure from behind with tousled hair (now soft curved locks), a hoodie with the hood resting on his
    back, and both arms on the desk.
  - Three monitors; no headphones, chair or lamp.
- **Main screen:** real C++ (Kadane's algorithm) with syntax colours and line numbers.
- **Floating details:** the "socket.js" card became a Submission card ("Accepted · C++17 · all tests passed");
  "Room synced" became "Developer mode".
- **Checks:** lint and build passed.

## 20. Avatar in the reference's line-art style

**Prompt:** "I want avatar like this, not like that; change it by keeping remaining same" (the same reference sketch).

**Actions:** Redrew only the person as vector line art matching the sketch: white hoodie with bold ink outlines,
an outlined hood, hatched shading, solid dark tousled hair with light strands, and outlined ears and neck. The
rest of the scene and the floating cards are unchanged. Lint and build passed.

## 21. Line art in colour; a development, test and deploy story

**Prompts:**
- "not keep cpp code or accepted; developing some code and keep there running build testing, something that
  attracts managers and recruiters".
- "I want exact same with previous colors, not pure white" (a reference line-art image).

**Actions**
- **Avatar:** keeps the line-art outlines and shapes, now filled with the original palette (blue hoodie, darker
  hood, skin and hair tones) with ink outlines and soft hatching.
- **Screens:** main shows an Express/Mongoose/Socket.io API route; left shows passing tests; right shows build →
  push → deploy → live.
- **Hero card:** "CI pipeline · main" with Build ✓, Tests ✓ and Deploy running, replacing "Accepted".
  "Developer mode" kept.
- **Checks:** lint and build passed.

## 22. "Résumé figures · not live", why?

**Actions:** Explained that the caption follows the step 13 brief (label the ratings as résumé figures, don't
imply live data). Offered softer wording ("Peak ratings"), removing the caption, or real live data (feasible for
Codeforces via its public API; fragile for LeetCode and CodeChef). Awaiting the user's choice; no files changed.

## 23. Flat unDraw-style avatar

**Prompt:** "add this type of avatar rather than that" (a flat unDraw-style developer from behind).

**Actions:** Replaced the person with a flat figure: indigo shirt, swept dark hair, a visible ear, both arms on
the desk, and a dark chair back, with no outlines. The rest of the scene and cards are unchanged. Lint and build
passed.

## 24. Live CP graphs; reference-style desk and hands

**Prompts:**
- "Résumé figures · not live: remove this line; add Recharts like number of contests and rating graphs from all
  these websites".
- Mid-task: "hands not like this; proper hands and desk setup like this" (current hero plus the unDraw reference).

**Actions**
- **Live data:**
  - Verified real data from all three sites, then added a server endpoint `/api/cp-stats` (Vercel function plus
    dev middleware) with timeouts, per-platform failure handling and hourly caching.
  - New `CpLiveCharts`: rating history per platform with a switch, contests per platform, and current/peak stats.
  - The caption is removed and a "Live" marker added; the résumé chart remains as the fallback.
- **Hero:**
  - A monitor (API code) on the left and a laptop (tests → build → deploy) on the right.
  - Natural typing pose (left hand on the keyboard, right hand on the laptop) and a chair back, in the flat style.
  - The CI card moved to the top right.
- **Checks:** lint and build passed.

## 25. Hand-drawn hoodie avatar, scene preserved

**Prompt (summary):** Replace only the purple-shirted figure with a black-and-white, hand-drawn, rear-view
developer in a light hoodie (reference sketch). Same size and position; desk, monitors, CI panel, terminal, glow
and "Developer mode" unchanged; no watermark.

**Actions**
- **Avatar:** replaced only the person group in `CodingIllustration.jsx` with an ink-outlined light hoodie, hood,
  hatching and tousled dark hair, in the same typing pose. Sketch tokens added in `illustration.css`.
- **Verification:** a diff confirmed the rest of the scene is unchanged.
- **`vercel.json`:** the catch-all rewrite now excludes `/api/` so the serverless functions are always reached.
- **Checks:** lint and build passed.

## 26. Previous avatar, only better

**Prompt:** "i want previous one not this previous only better".

**Actions:**
- Restored the flat indigo figure from the copy saved before step 25; the rest of the scene is verified identical.
- Refined it in the same style: shirt shading, collar and shoulder highlights; cuffs, thumbs and desk shadows; a
  fuller swept quiff with sheen and a sideburn; neck shadow and ear detail; a chair lumbar line.
- The sketch figure was removed; lint and build passed.
- **Follow-up** ("hair simple and formal; hands only on the desk"): a neat side-part haircut, and both hands
  resting flat on the desk on either side, no longer on the keyboard or laptop.

## 27. Rename to "Problem Solving"

**Prompt:** "Competitive Programming rename this with problem solving".

**Actions:** The nav label is now "Problem Solving", the anchor `#problem-solving` and the section eyebrow
"Problem solving". The navbar, mobile menu, ⌘K palette and footer follow automatically. Descriptive sentences
about competitive programming were kept. Lint and build passed.

## 28. Smooth theme switching

**Prompt:** "dark theme to white theme and vice versa need to be done in smooth animations".

**Actions:** The theme toggle uses the View Transitions API to reveal the new theme in a circle expanding from
the toggle (0.56s, macOS-style). Where unsupported, colours cross-fade over 0.5s; reduced motion switches
instantly. The ⌘K theme command reveals from the navbar toggle area. Lint and build passed.
- **Follow-up** ("little bit slow"): slowed the reveal to 0.9s and the fallback fade to 0.8s, with a gentler
  ease-in-out curve.

## 29. npm warnings

**Prompt:** pasted `npm install` / `npm run dev` output with two warnings.

**Actions:**
- **Recharts:** upgraded 2.15.4 → 3.10.1 (+ `react-is`); `accessibilityLayer={false}` on the charts.
- **`cache-dir`:** traced to the user's machine configuration, not the project. Harmless; explained how to clear it.
- **Checks:** lint and build passed.

## 30. Vercel deployment hanging

**Prompt:** a Vercel build log (with the cache-dir warning) and "this mistake keeps happening".

**Actions:**
- **Diagnosis:** `[vite] (client) [optimizer]` in the log shows Vercel was running the dev server, not a build,
  so the deployment never finished.
- **Fix:** pinned `framework`, `installCommand`, `buildCommand` (`npm run build`) and `outputDirectory` (`dist`)
  in `vercel.json`.
- **cache-dir:** explained again; it is Vercel's environment and only a warning.

## 31. Score-free education bento; CraftConnect live demo

**Prompts:**
- "don't add bars; separate the education and certifications like bento grid squares; don't add any bars for
  scores and percentage".
- Mid-task: "https://craftconnect-ix7v.vercel.app/ add this link to craftconnect".

**Actions**
- **Meters removed:** the CGPA ring, progress bar, percentage bar and score dots are gone.
- **New pictures:** campus building, MPC formula tiles and an open book.
- **Layout:** Education and Certifications are now separate groups of square bento cards; results stay as text.
- **CraftConnect:** live demo URL verified (HTTP 200) and added.
- **Checks:** lint and build passed.

## 32. Contact form 403 after deployment

**Prompt:** a screenshot of "This request is not allowed." and console 403s on `/api/contact`.

**Actions:**
- **Cause:** a mismatched `ALLOWED_ORIGINS` on Vercel, most likely the pasted `.env.example` placeholder.
- **Fix:** the origin check always allows the site's own domain, normalises entries, ignores placeholders and
  logs rejections. Verified in Node.
- **User:** check every Vercel environment variable for placeholder values (see the final note).

## 33. Hero as a bento grid

**Prompt:** "add bento design to make it neat and clean" (hero screenshot).

**Actions:** Rebuilt the hero layout as bento cards: a large intro card, a tall illustration card (CI card and
"Developer mode" kept), a roles card and a highlights card (600+ / 2027 / CGPA 8.97 as stat blocks, no bars).
The layout is responsive (1 → 2 → 12-column grid), with a staggered entrance. Lint and build passed.

## 34. Hero: no empty space, ruled-page lines

**Prompt:** "remaining space keep text so that space will not be there; remove that shadow at the back; just add
lines (white lines for the black background, black lines for the white background), not boxes, like lines in a
page".

**Actions:**
- **Empty space:** a "Currently" text block now fills the illustration card's empty space.
- **Shadows and glow:** card shadows, the hero glow and the glow behind the monitor were removed.
- **Lines:** the background is now faint horizontal ruled lines in the theme's text colour, fading out at the
  bottom.
- **Checks:** lint and build passed.

## 35. Animated grid-and-dots page background

**Prompts:**
- "I want this type of design (Aceternity background grid with dots and animations) in the background of the
  page for the white and dark themes".
- Mid-task: "remove the lines on the background in the hero section".

**Actions:**
- **New `GridBackground`:** a single canvas behind the whole page.
  - An 80px grid with dots, in light-on-dark or dark-on-light theme colours.
  - Lines and dots bend away from the cursor in a wave and glow in the accent colour, easing back when the mouse
    leaves.
  - Static on touch devices and with reduced motion.
- **Hero:** the ruled lines were removed, and the hero background now covers the grid, fading in at its bottom.
- **Follow-up** ("hero section background design missing, add there also"): the hero's covering background was
  removed, so the grid shows behind the hero too.
- **Checks:** lint and build passed.

## 36. Highlights card without empty space

**Prompt:** "cover the space with the text" (screenshot of the Highlights card).

**Actions:** Each stat is now a full-width row (value plus label and a short factual description) with dividers,
spread to fill the card. Lint and build passed.

## 37. Roles one per row

**Prompt:** "don't compress them and keep them one after another" (screenshot of the Roles card).

**Actions:** Replaced the wrapped tag cluster with one role per row (accent dot plus divider), spread to fill
the card like the Highlights card. Lint and build passed.

## 38. Centred hero scene with stack icons

**Prompt:** "keep this image in the middle; lots of extra space at the bottom; add something there, any icons".

**Actions:** The scene is vertically centred in the card, and a "Stack" row of app-style brand icons (the
Skills Dock set) fills the space above the "Currently" list. Lint and build passed.

## 39. HLD and LLD in Skills

**Prompt:** "in the tools add the low level design and high level design".

**Actions:** Added a "System design" skill group (filter: "System Design") with High-Level Design and Low-Level
Design tiles (Lucide Waypoints and Blocks icons). Lint and build passed.

---

## Current state

- **Stack:** React 18.3.1, Vite 8, Tailwind CSS 3.4, Recoil 0.7.7, GSAP 3.13, lucide-react, simple-icons,
  Recharts 3.10, react-hook-form.
- **Page order:** Home → About → Projects → Skills → Experience → Education → Problem Solving → Contact.
- **Every step passed:** `npm run lint` and `npm run build`.
- **Privacy:** no email address or phone number in the UI or the built bundle; the recipient and API key exist
  only in server environment variables.

## 40. Interested roles, hero card, project points, certificates, background

**Prompt (summary):** Change "Roles" to interested roles. Remove the hero's Stack and Currently blocks and add
something different. Rewrite the project content as clear points recruiters and hiring managers can scan. Remove
the "All" option from the tech-stack filter and keep the rest. Link the Smart Interviews and Udemy certificates.
Replace the magnifying cursor effect in the background with lines that move continuously and smoothly.

**Actions:**
- **Roles:** the hero card heading is now "Interested Roles"; the list is unchanged.
- **Hero card:** Stack icons and the Currently list were removed. A "Recent" block replaced them: four résumé
  milestones as small icon tiles (Frontend Developer Intern at Intripid, Finalist CodeVerse 2025, problem setter for
  the Winter Coding Contest, Smart Coder certified). Data: `heroMilestones` in `profile.js` (`heroCurrently` removed).
- **Projects:** each project now has 3–4 `highlights` written verb-first and impact-first, shown as bullet points on
  the card in place of the summary paragraph. The case study now reads Problem → Solution → Highlights → What I built
  (bold feature name plus one line each) → Impact. No new figures were invented; every point restates facts
  already verified against the repos.
- **Skills filter:** "All" was removed; the filter opens on Languages and the other categories remain.
- **Certificates:** both certificate cards have a "View certificate" link (new tab) to
  smartinterviews.in/certificate/d1710086 and the Udemy certificate UC-9ed65133-….
- **Background:** the cursor bend/glow (magnifying effect) was removed. The grid and dots now drift slowly and
  continuously, and six soft accent beams glide along the grid lines. Time-based animation (smooth at any frame
  rate), pauses when the tab is hidden, and stays static with reduced motion. Also runs on touch devices now.
- **Checks:** lint and build passed.

## 41. Esc closes the search

**Prompt:** "in search functionality if i click esc button it need to be closed".

**Actions:** Esc was only handled while the search field had focus, so it did nothing after clicking elsewhere in
the panel. Esc is now handled at window level while the palette is open, and the "esc" badge is a clickable close
button. Lint and build passed.

## 42. Codeforces missing from the ratings graph; hero "Recent" removed

**Prompts:** "ratings graph codeforces is missing". Mid-task: remove the hero's "Recent" block (added in step 40).

**Actions:**
- **Diagnosis:** the chart shows only platforms that `/api/cp-stats` returns without an error. Locally all three
  load (LeetCode 18, CodeChef 15, Codeforces 7 contests), so the deployed function's Codeforces request was failing.
  Codeforces often rejects or times out requests from cloud IPs. The failure then stuck around: partial results
  were cached in memory for an hour and served by Vercel's edge, stale, for up to a day.
- **Server (`server/cp-stats.js`):** Codeforces is retried once with JSON/User-Agent headers. Partial results are
  cached for 5 minutes (instead of an hour) and sent with `s-maxage=300`, so a missing platform comes back soon.
- **Browser fallback:** the Codeforces API allows cross-origin requests (`Access-Control-Allow-Origin: *`), so if
  the server response lacks Codeforces, the page fetches it directly (`src/lib/codeforces.js`) and adds it to the chart.
- **Hero:** the "Recent" milestones block and its `heroMilestones` data were removed; the illustration card now
  holds only the illustration and its floating chips.
- **Checks:** lint and build passed; the stats handler returned all three platforms locally.

## 43. More moving lines; no separator lines

**Prompt:** "i want more lines need to move in the background continuously and also remove the separation lines
between the sections and components black lines thin".

**Actions:**
- **Background:** beam count now scales with the screen (about 22 at 1920×1080, at least 10), slightly longer
  (160px) and with a wider speed range (60–160 px/s); new beams enter sooner after one leaves.
- **Separators removed:** the top border of every section (About, Projects, Skills, Experience, Education, Problem
  Solving, Contact), the lines between project rows and before "More projects", between experience entries, CP
  highlights and stats, the chart footer, the Skills category heading rule, the hero Roles/Highlights row dividers,
  and both footer lines. Spacing is unchanged.
- **Kept:** card outlines, and the window chrome of the case-study window, search panel and mobile menu.
- **Checks:** lint and build passed.

## 44. Longer, thicker, faster background lines

**Prompt:** "some more long length lines with thick goes on with some extra speed at the background".

**Actions:** A second kind of beam was added beside the existing soft ones: 320–520px long, 2.25px thick,
240–380 px/s, slightly brighter (about 8 on a 1080p screen, at least 4). The short soft beams are unchanged.
Lint and build passed.

## 45. Chart caption removed; Achievements heading

**Prompt:** Remove the text under the contest chart ("LeetCode: 18 rated contests, current 1776 … ratings are not
directly comparable.") and add the heading "Achievements" above the list (600+ problems solved, Finalist CodeVerse
2025, Problem setter Winter Coding Contest, Hackathons).

**Actions:**
- **Caption:** the per-platform summary and the "fetched … refreshed hourly … not directly comparable" note no
  longer show when live data loads. The short loading message and the "couldn't be loaded" fallback (résumé peak
  ratings) remain for those states only.
- **Achievements:** a section-level heading with a trophy icon, styled like the Education/Certifications headings,
  now sits above the four items; item titles became `h4` under it.
- **Checks:** lint and build passed.

## Open items for the user

1. **Email delivery:** resolve the Resend 403 (step 7). The recommended fix is a Resend account registered to the
   intended inbox, with its key placed in `RESEND_API_KEY`.
2. **Browser review:** mobile, tablet and desktop widths, both themes, keyboard navigation, reduced motion, the
   console, and nav behavior between 1024 and 1280px. The app was not launched here, per the standing preference
   that the user tests.
3. **Confirm wording:** the About phrase changed in step 9, and whether to keep the small 600+ / 2027 / CGPA line
   in the hero.
5. **Project layout:** with the step 11 order, CollabCodeEditor is a compact card. Say if all six should be
   full-width rows, or if a different set should be featured.
4. **Deployment:** set the Vercel Root Directory to `portfolio` and add the environment variables from
   `.env.example`.
