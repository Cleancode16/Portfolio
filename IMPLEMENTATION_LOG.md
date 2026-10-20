# Implementation log — Apple-inspired portfolio (2026-10-20)

## Starting point
- `portfolio/` was the unmodified Vite React template (counter demo, `App.css`, demo assets).
- `tailwind.config.js` used `module.exports` in an ESM package (`"type": "module"`), which breaks Tailwind config loading.
- Installed: React 19.3, Recoil 0.7.7, lucide-react 1.60, react-hook-form, react-router-dom, Tailwind 3.4.19.

## Decisions
| Decision | Reason |
| --- | --- |
| Pinned `react` / `react-dom` to 18.3.1 (and `@types/*` to 18) | Recoil 0.7.7 calls `currentRendererSupportsUseSyncExternalStore()` inside every `useRecoilValue`, which destructures `React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED`. React 19 removed it, so every Recoil hook would throw. |
| Removed `react-router-dom` | Single-page app with section anchors; no routes needed. |
| Added `gsap@3.13.0` | Required for the motion system; ScrollTrigger ships with it. |
| Kept `react-hook-form` | Already installed; used for contact-form validation. |
| Resend via `fetch` instead of an SDK or Nodemailer | Zero new dependencies; plain-text body only. |
| Vercel function in `api/` + Vite middleware for dev/preview | Resume lists Vercel; one shared handler keeps dev and production identical. |
| Lucide `FolderGit2` + text labels instead of GitHub/LinkedIn logos | lucide-react 1.x removed brand icons. |
| No LinkedIn, coding-profile or certificate links | The résumé PDF's link targets were not recoverable and the handles could not be verified; no broken or guessed links. |
| Hero illustration as an inline SVG component | Theme-aware colors through CSS variables, fixed aspect ratio (no layout shift), no binary asset to load. |
| Reveal animations use `opacity`, not `visibility` | Not-yet-revealed links stay keyboard-focusable. |

## Project verification
- Public READMEs were fetched for Event-Connect, codeBattle-MatchMaking1, innovathon-2026 and major-part-2.
- Convergence and collabcodeeditor are private (GitHub API 404). Verified from local clones instead:
  `Downloads/craftConnect` (remote Cleancode16/Convergence) and `Downloads/codeEditor/CollabCodeEditor`
  (remote Cleancode16/collabcodeeditor): routes, models, socket handlers and package.json files.
- Event-Connect export and gallery claims were checked against `Downloads/Event Connect/Event-Connect`
  (jspdf, xlsx, recoil, multer, cloudinary, nodemailer).
- Live URLs returned HTTP 200: event-connect-six-zeta.vercel.app, code-battle-match-making1.vercel.app,
  innovathon-2026.vercel.app, code-collab-editor.vercel.app. CraftConnect and the proctoring system have
  no verified live URL, so no demo link is shown.

## Files
**Modified:** `package.json`, `package-lock.json`, `index.html`, `tailwind.config.js` (ESM fix + tokens),
`eslint.config.js` (Node globals for server code), `vite.config.js` (dev/preview API middleware),
`.gitignore` (env files, `.vercel`), `src/main.jsx`, `src/App.jsx`, `src/index.css`, `public/favicon.svg`, `README.md`.

**Created:**
- `.env.example`; `.env` (git-ignored, contains only `CONTACT_TO_EMAIL`, empty `RESEND_API_KEY`)
- `api/contact.js`, `server/contact.js`, `server/dev-middleware.js`
- `src/state/ui.js`, `src/lib/motion.js`
- `src/hooks/useGsap.js`, `useScrollReveal.js`, `useScrollSpy.js`, `useThemeToggle.js`
- `src/data/profile.js`, `navigation.js`, `projects.js`
- `src/components/ui/SectionHeading.jsx`
- `src/components/layout/Navbar.jsx`, `ThemeToggle.jsx`, `CommandPalette.jsx`, `Footer.jsx`
- `src/components/hero/Hero.jsx`, `CodingIllustration.jsx`, `illustration.css`
- `src/components/projects/ProjectRow.jsx`, `ProjectVisual.jsx`
- `src/components/sections/About.jsx`, `Projects.jsx`, `Experience.jsx`, `Skills.jsx`, `CompetitiveProgramming.jsx`, `Contact.jsx`
- `IMPLEMENTATION_LOG.md`

**Deleted (template leftovers):** `src/App.css`, `src/assets/hero.png`, `src/assets/react.svg`, `src/assets/vite.svg`, `public/icons.svg`.

## Verification performed
- `npm run lint`: passes with no errors or warnings. Fixed along the way: a useless assignment in `api/contact.js`;
  react-hook-form `watch()` replaced with `useWatch()` (React Compiler compatibility); `handleSubmit` deferred to
  event time (ref/purity rules).
- `npm run build`: succeeds. JS 454 kB (152 kB gzip), CSS 37 kB (8 kB gzip).
- Privacy scan of `dist/` for the email address, phone number, `mailto:`, `gmail.com` and env variable names: no matches.
- Contact handler exercised in Node (no email sent): 405 for GET, 415 for non-JSON, 422 with field errors,
  silent 200 for honeypot / too-fast bots, 503 when the API key is missing, 403 for a disallowed origin, 429 on the 6th request.

## Not verified here (needs the user)
- In-browser visual review at 320–1440 px, both themes, keyboard navigation and reduced motion. The app was
  not launched, per the standing preference that the user does runtime testing.
- Real email delivery: requires `RESEND_API_KEY` (see README → Contact form setup).

## Fix — 2026-10-20 (reported from the browser console)
- **Error:** `ReferenceError: Cannot access 'ctx' before initialization` in `src/hooks/useGsap.js`, followed by
  24 `Invalid scope` warnings from `ProjectRow`.
- **Cause:** `gsap.context(() => setup(ctx), scope)` runs the callback synchronously, before `ctx` is assigned.
  The throw also left GSAP's global current-context set (Context.add has no try/finally), so later GSAP calls,
  such as the project tilt's `gsap.quickTo`, resolved targets through that broken context.
- **Fix:** create the context empty, then `ctx.add(() => setup(ctx))`. One file changed: `src/hooks/useGsap.js`.
- Lint and build re-run: both pass.

## Refinement pass — 2026-10-20
**Changed files**
- `src/data/profile.js`: replaced `principles` with the four new principles (no icons); removed `facts` and
  `journey`; added `highlights` (MERN, 600+, 2027, 8.97/10); CGPA corrected to 8.97 / 10 in `education`.
- `src/components/hero/Hero.jsx`: new eyebrow, headline and description; CTAs "Explore My Work" (#projects) and
  "Get in Touch" (#contact, new `btn-glass`); four understated highlights in place of the three metadata items;
  location line removed; illustration capped at 22rem (phone) and 30rem (tablet) so it doesn't dominate.
- `src/components/sections/About.jsx`: rewritten with the provided copy and four numbered principles. Removed the
  facts list, the "My Journey" timeline and the "Beyond code" panel. Education and experience remain in Experience.
- `src/index.css`: buttons lift on hover and settle on press, with fine borders and layered shadows; new translucent
  `btn-glass`; new `.window` surface (top highlight + layered shadow) for project previews.
- `src/components/projects/ProjectVisual.jsx`: previews use `.window` with smaller radii. Traffic-light controls
  remain only on the CollabCodeEditor preview (the one desktop-style window).
- `src/components/layout/Navbar.jsx`: mobile menu items stagger in with GSAP (skipped for reduced motion).
- `tailwind.config.js`: font stack is exactly `-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`.
- `index.html`: removed the Inter Google Fonts links (no external font requests).

**Checks**
- `npm run lint` passes; `npm run build` passes (JS 445 kB / 150 kB gzip, CSS 40 kB / 8 kB gzip).
- Source and bundle contain none of: "My journey", the journey data, 8.96, Inter, Google Fonts, "Let’s Connect".
- Bundle contains the new hero, About, principles and CGPA copy.
- Bundle privacy scan (email, phone, mailto:, gmail.com, env var names, localhost URLs): no matches.
- Not run here: the in-browser review at mobile, tablet and desktop widths, both themes, the console, and contact
  submission. Those are left to the user, per the standing preference.

## Button shape — 2026-10-20
- `src/index.css` only. The shared `.btn` base now uses `rounded-[10px]` instead of `rounded-full`, so `btn-primary`,
  `btn-glass` and `btn-secondary` (hero CTAs, "Read case study", contact submit, "Send another message") share one
  rectangular shape. Colors, text, icons, padding and the 44px height are unchanged.
- Hover: `btn-secondary` gains a soft shadow and `btn-glass` a restrained layered shadow; all still lift by 1px and
  scale to 0.98 when pressed.
- Removed `border-radius: 6px` from the global `:focus-visible` rule. It changed an element's corners whenever it
  received keyboard focus; outlines now follow each element's own radius.
- Circular icon buttons (theme toggle, menu, ⌘K) don't use `.btn` and are unchanged.
- Lint and build pass; compiled CSS shows `border-radius:10px` for all three button classes.

## Hero positioning — 2026-10-20
- `src/data/profile.js`: replaced `highlights` (which included "MERN — Full-stack development") with `focusAreas`
  (Scalable Systems, First Principles, CP & DSA) and `heroFacts` (600+ problems solved, Class of 2027, CGPA 8.97/10).
- `src/components/hero/Hero.jsx`: new headline ("I build scalable software by thinking from first principles.") and
  description, as provided. The focus areas sit in one glass strip (3 columns from `sm`, stacked with hairline
  dividers on phones) with Lucide Network/Atom/Binary icons; the résumé figures follow as a single small monospace
  line. Both join the existing staggered GSAP entrance. Eyebrow, CTAs (10px radius) and illustration are unchanged.
- Lint and build pass; the new copy is in the bundle and the "Full-stack development" highlight is gone.

## Tools & technologies: Dock + Launchpad — 2026-10-20
- **Dependency added:** `simple-icons@^15.0.0` (official brand SVG paths, CC0). Lucide 1.x has no brand icons. Named
  imports are tree-shaken: +14 kB gzip for 21 icons. Java uses the OpenJDK mark (simple-icons has no Java icon);
  SQL, REST APIs and the CS fundamentals use Lucide icons.
- `src/data/profile.js`: `skillGroups` items became `{ name, icon }` objects with a group `id` and short filter label.
  Same technologies as the résumé; nothing added. New `dockStack` (10 core technologies).
- **New** `src/components/skills/TechIcon.jsx`: squircle app icon. Brand-color gradient with a white or dark glyph
  chosen by luminance; near-black brands use a graphite gradient so they stay visible in dark mode; gloss and shadow.
- **New** `src/components/skills/Dock.jsx`: glass Dock with distance-based magnification (max +24%, 8px lift,
  110px range, smoothstep) via `gsap.quickTo` on transforms only (no layout shift); one shared glass tooltip that
  slides to the hovered icon; resets on pointer leave. Mouse only; static for touch and reduced motion; scrolls
  horizontally on narrow phones.
- `src/components/sections/Skills.jsx`: Dock, segmented category filter (All / Languages / Frontend / Backend /
  Databases / Tools / Fundamentals) with a GSAP-sliding highlight and `aria-pressed`, and a Launchpad grid grouped
  by category (3 → 8 columns). Tiles get a hover highlight, border transition and slight icon lift/scale; labels
  stay readable. Tiles stagger in when the grid first scrolls into view and again on each filter change
  (ScrollTrigger, killed on cleanup; nothing hidden for reduced motion).
- Lint and build pass; bundle privacy scan clean.

## Recruiter-friendly order — 2026-10-20
- **Order (page = nav = scroll spy = command palette = footer):** Home → About → Projects → Skills → Experience →
  Education → Competitive Programming → Contact. `src/data/navigation.js` and `src/App.jsx` updated.
- **New** `src/components/sections/Education.jsx` (`#education`): education with CGPA 8.97/10 and certifications,
  moved out of `Experience.jsx`, which now covers only Intripid and ACM ("Where I’ve worked and taught.").
- `src/components/layout/Navbar.jsx`: with eight links, desktop links show from `xl` (1280px). Below that the
  existing menu button and sheet are used (breakpoint and auto-close-on-resize updated to 1280).
- `src/data/projects.js`: reordered by engineering depth and added a `featured` flag. Featured: AI Proctoring,
  CodeBattle, CollabCodeEditor; then CraftConnect, AcadBoost AI, Event-Connect. No content, links or claims changed.
- `src/components/projects/ProjectRow.jsx`: new `compact` variant (stacked card, one-column case study);
  `src/components/sections/Projects.jsx` renders featured rows, then a "More projects" grid (1/2/3 columns,
  `items-start`). Eyebrow "Featured projects"; intro mentions engineering decisions.
- `src/components/sections/Skills.jsx`: eyebrow "Technical skills".
- `src/components/sections/About.jsx`: "explore real-time systems" → "explore scalable systems and system design",
  to match the requested focus.
- Checks: lint and build pass; App order matches nav order; every nav id maps to exactly one section; no 8.96 or
  journey content; bundle privacy scan clean. Existing `scroll-margin-top: 5.5rem` on sections keeps headings
  clear of the fixed nav.

## Custom project order — 2026-10-20
- `src/data/projects.js`: order set by the owner to Event-Connect, CodeBattle, CraftConnect, CollabCodeEditor,
  AcadBoost AI, AI Proctoring. `featured` is true for the first three (full-width rows); the rest are compact cards.
  Header comment updated. Lint and build pass.

## About → Aceternity-style bento grid — 2026-10-20
- Reference: the Aceternity "feature grid with illustrations" page. Its source is All-Access only, so the
  pattern (six cards, each with a small scene that plays while on screen) was rebuilt with existing tools.
  No screenshots arrived with the request. No dependencies added.
- **New** `src/components/about/illustrations.jsx`: six inline SVG/HTML scenes using theme tokens:
  - first principles: scattered pieces settle into fundamentals, then into a solution;
  - end to end: Database → API → Interface with travelling packets;
  - scalable systems: gateway → three services → store, flowing links and a service highlight;
  - real-time: three windows syncing a typed line;
  - CP & DSA: C++ LIS editor with a stepping execution line and an `O(n log n)` chip;
  - build/debug: terminal going FAIL → fix → PASS.
  Each renders its final state (shown as-is for reduced motion) plus a paused, looping `scene()` timeline with a
  2.6s pause between loops.
- **New** `src/components/about/BentoCard.jsx`: charcoal card (near-black in dark, white in light), dot-grid
  illustration well, hover lift, border highlight, shadow and a pointer-following accent light. The scene plays
  only while the card is on screen (ScrollTrigger `onToggle`), cleaned up through `useGsap` (gsap.context).
- `src/components/sections/About.jsx`: centred heading "How I think. How I build." plus subtitle, then a 1/2/3-column
  grid of six cards. Staggered entrance via `useScrollReveal` on the list items, so the GSAP entrance never fights
  the hover transform. The old four-principle layout was removed.
- `src/components/ui/SectionHeading.jsx`: optional `align="center"`.
- `src/data/profile.js`: `principles` replaced with `aboutCards` (the six titles and descriptions, as provided).
- **Fix:** `src/components/projects/ProjectVisual.jsx` radar chart moved `fill`/`stroke` CSS-variable colors from
  SVG attributes to `style` (var() is not reliable in presentation attributes).
- Lint and build pass; the new copy is in the bundle, the old About copy is gone, and the privacy scan is clean.

## Motion, coding profiles and Recharts — 2026-10-20
**Motion review.** Existing animations already keep GSAP on wrapper elements and CSS hover transforms on inner
elements (no property is driven by two systems); everything uses gsap.context cleanup and respects reduced motion.
Changes:
- **Bug fix, new** `src/hooks/useScrollTriggerRefresh.js` (used in `App.jsx` on `<main>`): ScrollTrigger only
  re-measures on window resize, so in-place height changes (Skills filters, case studies, the chart mounting)
  left later reveal triggers stale and content could stay transparent. A ResizeObserver now calls a debounced
  `ScrollTrigger.refresh()`.
- **Timings** (interactions 200–400ms, entrances 500–800ms):
  - scroll reveals 0.9s → 0.7s, travel 28/12px → 24/10px;
  - hero 1.0/1.2/0.8s → 0.8/0.9/0.6s;
  - nav pill and Skills filter pill 0.45/0.4s → 0.35s; mobile sheet 500 → 400ms; nav shadow 500 → 300ms;
  - theme-toggle icons 500 → 300ms (now `transition-[transform,opacity]` instead of `transition-all`);
  - theme cross-fade 0.45 → 0.35s;
  - case-study expand 700 → 500ms, chevron 500 → 300ms; project tilt 0.6 → 0.45s;
  - bento hover 500 → 300ms.
- `useThemeToggle` writes `data-theme` to the DOM before updating Recoil, so components that read computed theme
  tokens during re-render always see the new theme.

**Coding profiles** (`src/data/profile.js`, `CompetitiveProgramming.jsx`)
- `cpPlatforms` now carries the exact URLs and handles: LeetCode `cleancode16`, Codeforces `cleancode08`,
  CodeChef `devasanibharat`. Official icons (simple-icons) are rendered through `TechIcon`.
- Three glass profile cards: icon, name, handle, short description, the résumé detail, and a 10px-radius
  "View Profile" button (new tab, `rel="noopener noreferrer"`, accessible name starting with the visible text).
  Hover lift, border and shadow; the icon tilts slightly and the arrow nudges.
- The ratings are no longer repeated in the cards; they appear in the chart and summary, labelled as résumé figures.

**Chart** — dependency added: `recharts@^2.15.4` (supports React 18).
- **New** `src/components/cp/CpRatingsChart.jsx`: BarChart (LeetCode 1764, CodeChef 1516, Codeforces 1104).
  Per-platform colors per theme, horizontal grid only, minimal axes, value labels on bars, a frosted custom
  tooltip, a 750ms ease-out bar animation (off for reduced motion), and an empty state. Colors resolve from theme
  tokens keyed to the Recoil `themeState`, since SVG attributes can't use `var()`.
- Section block "The numbers behind the practice" with the supplied text and three restrained metrics (600+,
  1764, 2-star). The chart sits in a translucent `<figure>`, captioned "Résumé figures · not live", with a visible
  text summary noting that rating systems differ between platforms.
- The chart is `React.lazy`-loaded and mounted only when it nears the viewport (IntersectionObserver), so the bar
  animation is seen; a fixed-height skeleton prevents layout shift.

**Bundle:** `vite.config.js` `manualChunks` splits `react-vendor` (React, ReactDOM, scheduler, Recoil) and `gsap`.
Gzipped: app 61 kB, react-vendor 68 kB, gsap 44 kB, CSS 10 kB; the chart chunk (99 kB) loads on demand. The
500 kB chunk warning is resolved.

**Checks:** lint and build pass. All three URLs and the rating values are in the bundle; privacy scan clean.
CodeChef responded HTTP 200 to curl. LeetCode and Codeforces returned 403 to scripted requests (Cloudflare bot
protection), so those two links still need a check in a real browser.

## macOS cursor, boot intro, smoother Dock — 2026-10-20
- **Cursor** (`src/index.css`): SVG data-URI cursors inside `@media (pointer: fine)`. The macOS arrow (black,
  white outline, soft shadow, hotspot 6,3) is the default; a pointing hand (hotspot 13,3) is used on links,
  enabled buttons, labels, summary, select and `[role=button|option]`. Text inputs keep the native I-beam;
  disabled buttons use `not-allowed`. The OS still draws the cursor (no JS, no lag); touch is unaffected.
  Removed the `cursor-pointer` utility from the command palette so the rule applies there too.
- **Boot intro** — new `src/components/intro/BootIntro.jsx` plus `introPlayingState` in `src/state/ui.js`:
  black screen, DB monogram (not Apple's logo), and a progress bar filling in uneven steps, about 1.6s.
  The hero is released as the fade-out begins, so its entrance blends in (`Hero.jsx` waits on
  `introPlayingState`). Shown once per session (`sessionStorage`); any key or click skips it; never shown for
  reduced motion; scroll locked while visible; cleaned up through gsap.context.
- **Dock smoothing** (`src/components/skills/Dock.jsx`, at the user's request):
  - slot centres measured once per hover instead of on every pointer move;
  - updates batched to one per animation frame;
  - cosine falloff over 150px (was smoothstep over 110px), max scale 1.22;
  - 0.5s `power2.out` glide (was 0.35s `power3.out`); tooltip 0.3s `power2.out`;
  - `force3D` on icons; re-measures if the dock scrolls on narrow screens.
- Lint and build pass; both cursors are present in the compiled CSS; privacy scan clean.

## Case study as a macOS window — 2026-10-20
- **New** `src/components/projects/CaseStudyModal.jsx`, a macOS-style window rendered through a React portal
  (transformed reveal ancestors would otherwise capture `position: fixed`):
  - frosted surface (`backdrop-filter`, static, never animated), 14px radius, layered shadow; title bar with
    "Project — Case study"; scrollable body (context, name, tagline, stack, Problem / Approach / Implementation /
    Outcome); footer with Source code and Live demo (when verified);
  - traffic lights: red closes, yellow "minimises" (closes), green zooms the window (max-w-3xl ↔ max-w-5xl, two
    columns when zoomed; hidden below `md`); hovering or focusing the group shows ×, − and maximise glyphs;
  - motion: overlay fade 0.3s; window scales 0.88 → 1 with opacity over 0.42s `power3.out`, with its
    transform origin at the launching button (an app opening from the Dock); close reverses toward the button
    (0.24s `power2.in`). Reduced motion: instant;
  - accessibility: `role="dialog"`, `aria-modal`, labelled by the project name; focus moves to the close
    control; Tab is trapped; Escape and backdrop click close; scroll locked; focus returns to the launcher.
- `src/components/projects/ProjectRow.jsx`: removed the inline expanding panel and `CaseBlock`; the "Read case
  study" button (AppWindow icon, `aria-haspopup="dialog"`) opens the modal. Stale comments updated in
  `ProjectRow.jsx` and `Projects.jsx`.
- Lint and build pass.

## Hero avatar redraw and roles — 2026-10-20
- `src/components/hero/CodingIllustration.jsx` + `illustration.css`: the person is redrawn as a man in the same
  pose, seen from behind:
  - textured top with volume and lighter strand highlights; faded back and sides (gradient `ws-fade`);
  - thicker neck and broader shoulders; a centre seam on the hoodie;
  - larger over-ear headphones with cushions, and a band arching over the hair.
  New tokens `--w-hair-hi` and `--w-headphone-pad` (both themes); the SVG title describes the new figure.
- `src/data/profile.js` `heroRoles` + `Hero.jsx`: a "Roles" row of tags under the focus strip: Software
  Development Engineer, Full-Stack Developer, Frontend Developer, Backend Developer, Full-Stack AI Developer.
  It is part of the hero's staggered entrance.
- Lint and build pass.

## Hero focus strip removed — 2026-10-20
- `Hero.jsx`: removed the glass "Scalable Systems / First Principles / CP & DSA" strip and its Lucide
  Network/Atom/Binary icons. The Roles row now sits directly under the CTAs (`mt-12`), followed by the small
  résumé-figures line. `profile.js`: removed `focusAreas`. Lint and build pass; the strip text is absent from the bundle.

## Avatar to match the reference; Education bento — 2026-10-20
- **Avatar** (`CodingIllustration.jsx`, `illustration.css`), following the user's reference sketch:
  - tousled, spiky locks covering the back of the head to the nape (rounded joins via a same-colour stroke) with
    lighter strand strokes; the fade gradient was removed;
  - a large hood draped over the upper back with an opening fold and a centre seam;
  - over-ear headphones kept (asked for earlier; the reference has none). New class `.s-hair`.
- **`BentoCard` generalised** (`src/components/about/BentoCard.jsx`): now takes `Illustration`, `title`, `text`,
  `children` and `className`, and is shared by About and Education. `About.jsx` updated to the new props.
- **New** `src/components/education/illustrations.jsx` (real figures only; scenes play once, no loop):
  - Degree: a CGPA ring drawing to 8.97/10 with a count-up, plus a 2023→2027 progress track computed from
    today's date ("In progress · graduating May 2027", switching to "Completed" after May 2027);
  - Intermediate: 97.7% count-up, a bar and MPC subject chips;
  - High school: 10 / 10 with ten dots popping in;
  - Smart Coder: a certificate card with a seal stamping in (Smart Interviews · 2025);
  - DSA course: a seven-node binary tree with an in-order traversal highlight (C / C++).
- `src/components/sections/Education.jsx`: centred heading plus a bento grid (degree spans two columns; 3/2/1
  columns), with kind, title, subtitle, period and result on each card. Same staggered reveal on wrappers.
- Lint and build pass; new content is in the bundle; privacy scan clean.

## Hero scene recomposed to the reference; C++ screen; Accepted card — 2026-10-20
- `src/components/hero/CodingIllustration.jsx`, rewritten to match the user's reference sketch:
  - centred developer seen straight from behind; broad hoodie filling the lower frame; a large hood resting
    on the back; both forearms on the desk; ears; tousled hair. Locks are now quadratic curves (softer than the
    earlier jagged polyline, which read as spiky);
  - no headphones, chair or lamp (as in the reference); a main monitor flanked by two side monitors;
  - the main screen shows real, syntax-highlighted C++ (`solution.cpp`, Kadane's maximum subarray) as SVG
    text with line numbers and a blinking cursor; `white-space: pre` keeps the indentation.
- `src/components/hero/Hero.jsx`: the floating "socket.js" card is replaced by a Submission card ("Accepted",
  `C++17 · all tests passed`, Lucide CircleCheck; no invented runtime figures); "Room synced" became "Developer mode".
- Lint and build pass.

## Avatar as line art (reference style) — 2026-10-20
- The user repeated the reference sketch: they want its style, not only its pose. The reference image is only
  162px wide, too small to use as an asset, so the figure is redrawn as vector line art in
  `CodingIllustration.jsx`, replacing only the person group:
  - white hoodie with 3px ink outlines; hatched shading under the arms and down the back;
  - outlined hood with its opening and centre fold; outlined neck and ears; solid ink hair (soft curved locks)
    with light strand lines; arms angled out to the desk.
- `illustration.css`: new tokens `--w-sketch-fill` and `--w-sketch-ink` (both themes) and classes `.l-fill`,
  `.l-ink`, `.l-hair`, `.l-hair-hi`.
- Unchanged: monitors, C++ screen, desk, mug, the "Accepted" card and the "Developer mode" chip.
- Lint and build pass.

## Hero: line art in the original colours; development, test and deploy story — 2026-10-20
- **Palette** (user: "exact same with previous colors, not pure white"): the line-art figure keeps its outlined
  shapes but uses the scene palette (blue hoodie, darker hood, original skin and hair tones) with ink outlines
  `--w-ink` and 45% ink hatching. The white sketch tokens and classes were removed.
- **Screens** (user: no C++ / Accepted; show development, build and tests that appeal to recruiters):
  - main monitor: an Express + Mongoose + Socket.io route (`routes/orders.js`: create an order, emit
    `order:created`, return 201) as syntax-highlighted text;
  - left monitor: "terminal — tests" with `npm test` and passing suites;
  - right monitor: "terminal — deploy" with build, `git push`, deploying and live.
- **Hero card:** "Accepted" replaced by "CI pipeline · main": Build passed, Tests passed, Deploy running (spinner,
  static for reduced motion). Stages only, no numbers. The "Developer mode" chip is unchanged.
- The edits were applied by a script in the session scratchpad (an inline shell heredoc failed to parse; nothing
  changed on that attempt). Lint and build pass; the new content is in the bundle.

## Hero avatar: flat unDraw style — 2026-10-20
- Following the user's new reference (a flat unDraw-style developer from behind), only the person group in
  `CodingIllustration.jsx` is replaced. Flat shapes with no outlines or hatching:
  - indigo shirt with a collar shade; both arms to the desk; skin-tone neck and ears (right ear visible);
  - smooth dark hair with a swept quiff and a soft sheen;
  - dark chair back in front of him.
- `illustration.css`: tokens `--w-shirt`, `--w-shirt-shade` and `--w-ink-dark` (light and dark themes) replace
  the line-art `--w-ink`; classes `.f-shirt`, `.s-shirt`, `.f-shirt-shade`, `.f-ink-dark`, `.f-hair-sheen`.
  The unused tousled-hair path data and line-art classes were removed.
- Unchanged: monitors (API code, tests, deploy), desk, CI pipeline card and "Developer mode". Lint and build pass.

## Live CP stats (Recharts) and a reference-style desk — 2026-10-20
**Live competitive-programming data** (user: remove "Résumé figures · not live"; add contest-count and rating
graphs from all three sites)
- Checked first: Codeforces public API (7 rated contests, current 1104), LeetCode GraphQL (18 contests, current
  1776, above the résumé's 1764), CodeChef profile `all_rating` (15 contests, current 1516). All reachable.
- **New** `server/cp-stats.js`: fetches all three server-side (browser CORS blocks LeetCode and CodeChef; CodeChef
  has no API), with a 9s timeout per source, normalised `{ contests, currentRating, maxRating, history[] }`,
  independent failures (`{ error }` per platform), and a 1h in-memory cache plus
  `Cache-Control: s-maxage=3600, stale-while-revalidate=86400`.
- **New** `api/cp-stats.js` (Vercel GET) and `cpStatsMiddleware` in `server/dev-middleware.js`, registered in
  `vite.config.js` for dev and preview.
- **New** `src/components/cp/chartTheme.js` (shared theme-resolved colours) and `src/components/cp/CpLiveCharts.jsx`:
  - rating-history area chart (time axis, glass tooltip with contest name and date) with a LeetCode / CodeChef /
    Codeforces switch (sliding highlight);
  - horizontal bar chart of rated contests per platform;
  - current, peak and contests stats for the selected platform.
- `CompetitiveProgramming.jsx`: the "Résumé figures · not live" caption is gone. Live stats are fetched when the
  chart nears the viewport. The heading is "Contest performance" with a green "Live" marker; the left metrics and
  the text summary use live values. If every source fails, the earlier résumé bar chart shows with an honest note.
  The skeleton is 420px tall to limit layout shift.
- `CpRatingsChart.jsx` is kept as that fallback and uses the shared theme. Recharts stays lazy-loaded.
- Risk noted: LeetCode or CodeChef may block requests from cloud IPs in production; the per-platform fallback
  handles that.

**Hero desk like the reference** (user: hands and desk setup like the unDraw image)
- `CodingIllustration.jsx` recomposed: a large monitor on the left (API route), a laptop on the right (test →
  build → deploy terminal), a keyboard in front of the monitor. The figure sits right of centre, overlapping the
  monitor's edge: left forearm forward to the keyboard, right arm reaching to the laptop with the hand on its
  keyboard (no more arms splayed to the desk ends). Dark chair back in front; flat unDraw style kept.
- `Hero.jsx`: the CI pipeline card moved to the top right so it no longer covers the code.
- Lint and build pass.

## Hero avatar: hand-drawn hoodie figure — 2026-10-20
- Brief: replace only the person with a hand-drawn, rear-view developer in a light hoodie (reference sketch);
  everything else unchanged. Only the reference image arrived; the base scene is the current code.
- `src/components/hero/CodingIllustration.jsx`: only the person group was replaced, in the same position, scale
  and typing pose:
  - light-grey hoodie with 3px ink outlines, side fold lines and light hatching; outlined hood with its opening
    and centre fold; outlined neck and ears; dark tousled hair (curved locks) with light strand lines;
  - sleeves drawn as an ink stroke under a lighter stroke (outlined tubes); outlined hands on the keyboard
    and the laptop.
  The chair back is kept unchanged. A diff of everything before the person group shows only the added hair data,
  one comment and the accessible title changed.
- `illustration.css`: the flat-figure shirt tokens were replaced by sketch tokens (`--w-sketch-fill`,
  `--w-sketch-shade`, `--w-sketch-ink`; light grey in dark mode for legibility) and the `.l-*` classes;
  `.f-ink-dark` (chair) kept.
- Unchanged: `Hero.jsx` (CI pipeline card, "Developer mode"), desk, monitor, code, laptop terminal, glow.
- `vercel.json` (user's file): the SPA catch-all rewrite now excludes `/api/`
  (`/((?!api/).*)` → `/index.html`), so `/api/contact` and `/api/cp-stats` always reach their functions.
- Lint and build pass.

## Hero avatar: back to the flat figure, refined — 2026-10-20
- User: "I want the previous one, not this; the previous one, only better."
- `CodingIllustration.jsx` restored from the copy saved before the sketch swap (scratchpad
  `CodingIllustration.before.jsx`); everything outside the person group is verified identical to that version.
- Person refined in the same flat unDraw style, pose and placement:
  - shirt side shading for volume, a faint back seam, shoulder highlights, a collar band;
  - sleeve shading, darker cuffs, hands with thumbs, soft contact shadows on the desk;
  - hair rebuilt as back/crown plus a swept quiff with volume, a sideburn, and subtle sheen strokes;
  - shadow under the hairline on the neck, inner-ear detail; chair back gains a lumbar line.
- `illustration.css`: sketch tokens removed; flat tokens restored (`--w-shirt`, `--w-shirt-shade`) plus
  `--w-shirt-hi` and `--w-skin-deep`, both themes; classes `.s-shirt-shade`, `.s-shirt-hi`, `.f-skin-deep`,
  `.s-skin-deep`, `.s-hair-sheen`, `.s-chair-line`.
- `vercel.json` keeps the `/api/` exclusion from step 25. Lint and build pass.
- Follow-up (same step): "hair simple and formal; hands only on the desk". Hair is now a neat short cut with
  a clean side part (one subtle part line and one soft sheen; no quiff or sideburn). Both forearms come forward
  and the hands rest flat on the desk just outside the torso silhouette, thumbs inward, with contact shadows.
  Hands placed in front of the body would be hidden by it from this rear view. They no longer touch the keyboard
  or laptop. New class `.s-hair-part`. Scene outside the person verified unchanged; lint and build pass.

## "Competitive Programming" section renamed "Problem Solving" — 2026-10-20
- `src/data/navigation.js`: `{ id: 'problem-solving', label: 'Problem Solving' }` (feeds the navbar, mobile menu,
  scroll spy, ⌘K palette and footer).
- `CompetitiveProgramming.jsx`: section `id="problem-solving"`, eyebrow "Problem solving".
- Kept as-is: sentences describing competitive programming as an activity (About card, CodeBattle tagline,
  chart text) and internal file/component names. No links referenced the old anchor. Lint and build pass.

## Smooth theme switching — 2026-10-20
- `src/hooks/useThemeToggle.js`:
  - With the View Transitions API (Chrome, Edge, Safari 18+), `document.startViewTransition` snapshots the old
    theme and the new theme is revealed by a `clip-path` circle growing from the clicked toggle (0.56s,
    `cubic-bezier(0.22, 1, 0.36, 1)`), animated on `::view-transition-new(root)`.
  - The ⌘K command (no click event) reveals from the navbar toggle area, top right.
  - Inside the transition, `data-theme` is applied first and Recoil is updated with `flushSync`, so the new
    snapshot (including the Recharts colours and toggle icons) is already final.
  - Fallback (no View Transitions, e.g. older Firefox): the colour cross-fade, now 0.5s with the same easing and
    including box-shadows. Reduced motion: instant switch.
- `src/index.css`: `html.theme-reveal::view-transition-old/new(root)` disables the default snapshot cross-fade
  and stacks the new snapshot on top; the `.theme-transition` fallback rule updated.
- Lint and build pass.
- Follow-up ("little bit slow"): reveal lengthened 0.56s → 0.9s with an ease-in-out curve
  `cubic-bezier(0.65, 0, 0.35, 1)`; fallback cross-fade 0.5s → 0.8s with the same curve. Lint and build pass.

## Recharts 3 upgrade; npm warnings — 2026-10-20
- The user's `npm install` showed "recharts@2.15.4 deprecated" (the 2.x branch is no longer maintained). Upgraded
  to `recharts@^3.10.1` and added its peer `react-is@^18.3.1`. Recharts 3 supports React 18. It uses Redux
  Toolkit internally for its own chart state; that is internal to the library, and the app's shared state is still
  Recoil only.
- Recharts 3 enables `accessibilityLayer` by default (focusable chart SVG). The charts sit inside `aria-hidden`
  wrappers with visible text summaries, so `accessibilityLayer={false}` was set on all three charts
  (`CpLiveCharts.jsx` ×2, `CpRatingsChart.jsx` ×1) to avoid focusable content inside `aria-hidden`.
- The other warning, `Unknown env config "cache-dir"`, comes from the user's machine, not the project: no
  `.npmrc` in the project or home folder and no `npm_config_cache_dir` in User/Machine environment variables or
  this shell. `npm config ls -l` shows the valid `cache` setting. Harmless; the user can remove the variable
  from wherever it is defined.
- Lint and build pass. Charts still need a browser check after the major-version upgrade.

## Vercel deployment hanging — 2026-10-20
- The user's Vercel build log showed `[vite] (client) [optimizer] bundling dependencies...`, which only the Vite
  dev server prints, so Vercel was running the dev server (`npm run dev`), which never exits; the deployment
  hung. The project scripts are correct (`build` = `vite build`), so the Vercel project setting was wrong.
- `vercel.json` now pins `framework: "vite"`, `installCommand: "npm install"`, `buildCommand: "npm run build"`
  and `outputDirectory: "dist"` (these override the dashboard), keeping the `/api/`-excluding SPA rewrite.
- The `Unknown env config "cache-dir"` warning also appears on Vercel: it comes from the npm environment of the
  build machines, not this project. Warning only.
- The local build produces `dist/` correctly. The Root Directory must still be `portfolio` in the Vercel dashboard
  (it can't be set in `vercel.json`).

## Education bento: no score meters, separate square groups; CraftConnect live link — 2026-10-20
- User: no bars for scores or percentages; separate Education and Certifications as square bento cards.
- `src/components/education/illustrations.jsx`: removed the CGPA ring, degree progress track, 97.7% bar and
  10/10 dots (and their count-up helper). New pictorial, score-free scenes, each playing once:
  - `Campus` (VNR VJIET): a building whose columns rise and flag unfurls; caption "B.Tech · Computer Science";
  - `Mpc` (Narayana): Mathematics / Physics / Chemistry formula tiles;
  - `Book` (St. Paul's): an open book whose page turns.
  `SmartCoder` and `DsaCourse` unchanged.
- `src/components/about/BentoCard.jsx`: optional `square` prop (`aspect-square` card; the illustration well
  flexes, min 7.5rem, so the text always fits). About cards unchanged.
- `src/components/sections/Education.jsx`: two separate groups, "Education" (3 cards) and "Certifications"
  (2 cards), each with an icon heading and its own square grid (1 / 2 / 3 columns). Results stay as plain text
  on the cards (CGPA 8.97 / 10, 97.7%, CGPA 10 / 10).
- `src/data/projects.js`: CraftConnect `live` set to https://craftconnect-ix7v.vercel.app/ (verified HTTP 200);
  it now shows "Live demo" on the card and in the case-study window.
- Lint and build pass; the old meter text is absent from the bundle.

## Contact form 403 after deployment — 2026-10-20
- Symptom: deployed form showed "This request is not allowed." (`/api/contact` 403). That response comes only
  from the origin check, so `ALLOWED_ORIGINS` on Vercel didn't match the site's Origin. Likely the
  `.env.example` placeholder (`https://your-portfolio.vercel.app`) was pasted, or a trailing slash or preview URL.
- `server/contact.js`: same-site requests (Origin host = serving host, from `x-forwarded-host` / `host`) are
  always allowed. `ALLOWED_ORIGINS` entries are normalised (case, trailing slash), the `.env.example`
  placeholder is ignored, and rejections are logged with origin and host. `api/contact.js` and
  `server/dev-middleware.js` pass `host`.
- Verified in Node: same-site passes even with the placeholder; a normalised custom domain passes; a foreign
  origin is still 403. Lint and build pass.
- Follow-up: the user's value was `ALLOWED_ORIGINS=https://devasanibharath.vercel.app/` (Vercel and local `.env`).
  Its trailing slash never matches a browser Origin header, which confirms the cause. The updated code
  accepts this exact value (verified in Node). Recommended removing the slash anyway and redeploying with the
  new code; the user's `.env` was not edited.

## Hero as a bento grid — 2026-10-20
- `src/components/hero/Hero.jsx` laid out as bento cards (shared surface: rounded-3xl, fine border, translucent
  surface, blur, soft shadow):
  - intro card (lg 7 cols × 2 rows): eyebrow, headline (clamped 2.25–4.25rem so it fits the card), description,
    "Explore My Work" and "Get in Touch";
  - illustration card (lg 5 cols × 3 rows): the workstation scene with the CI pipeline card and "Developer mode"
    chip, unchanged;
  - roles card (lg 4 cols): the five role tags;
  - highlights card (lg 3 cols): 600+ problems solved, Graduating 2027, CGPA 8.97/10 as plain stat blocks.
  Layout is 1 column on phones, 2 on tablets (intro and illustration full width), 12-column bento on desktop.
  Cards enter with the existing staggered GSAP timeline (after the boot intro).
- `src/data/profile.js`: `heroFacts` (strings) replaced by `heroStats` (`{ value, label }`).
- Lint and build pass.

## Hero bento: fill the empty space; ruled lines instead of glow — 2026-10-20
- `Hero.jsx`:
  - The illustration card is now a flex column; the scene sits on top and a "Currently" block fills the rest
    (border-top, `mt-auto`), using the user's stated interests (`heroCurrently` in `profile.js`): building
    full-stack products with React, Node.js and MongoDB; studying system design and scalable architecture;
    competing on LeetCode, CodeChef and Codeforces.
  - Card shadows removed (border plus translucent fill only).
  - The ambient glow background was replaced by `.hero-lines`.
- `index.css`: new `.hero-lines`, horizontal ruled lines every 40px in `rgb(var(--ink) / 0.07)` (light lines
  on the dark theme, dark lines on the light theme), masked to fade out toward the bottom. Lines only, no boxes.
- `CodingIllustration.jsx`: removed the blue glow behind the monitor (two ellipses) and their unused gradient
  defs.
- Lint and build pass.

## Page grid background (Aceternity-style); no lines in the hero — 2026-10-20
- Reference: Aceternity "background grid with dots and animations" (source paywalled; public description: 80px
  grid, 2px dots at intersections, lines bending in a wave near the cursor with a distance-based glow, lerped
  animation that stops when the mouse leaves, separate light and dark colours).
- **New** `src/components/layout/GridBackground.jsx`, mounted once in `App.jsx`: a fixed full-page `<canvas>`
  (`-z-10`, `pointer-events-none`):
  - 80px grid drawn in the theme's text colour at low alpha (light on dark, dark on light), dots at
    intersections;
  - near the mouse, lines and dots are pushed outward (160px radius, max 14px) and glow in the accent colour,
    with smoothed pointer and intensity; the rAF loop stops once settled;
  - scrolls with the page (redraw on scroll); DPR-aware; resize handled; theme colours re-read in a layout
    effect so the theme-reveal snapshot is correct;
  - static on touch devices and with reduced motion; full cleanup on unmount.
  `index.css`: `.grid-background` radial vignette mask.
- The hero's ruled lines (`.hero-lines`) were removed. Follow-up ("remove the lines in the hero"): the hero has a
  solid `--canvas` background that fades over its last 18%, so no grid lines appear behind the hero and the grid
  eases in from the About section down.
- Lint and build pass.
- Follow-up ("hero section background design missing, add there also"): the user meant the old ruled lines, not
  the grid. Removed the hero's solid `--canvas` background so the animated grid shows behind the hero too.
  Lint and build pass.
