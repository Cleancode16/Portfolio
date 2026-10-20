# Devasani Bharath — Portfolio

A single-page portfolio built with React, Vite, Tailwind CSS v3, Recoil and GSAP, with
light and dark themes and a private, server-side contact form.

## Stack

| Concern | Choice |
| --- | --- |
| App | React 18.3 + Vite 8 |
| Styling | Tailwind CSS 3.4, theme tokens as CSS variables (`src/index.css`) |
| Shared state | Recoil (`src/state/ui.js`) |
| Motion | GSAP 3 + ScrollTrigger (`src/lib/motion.js`, `src/hooks/useGsap.js`) |
| Icons | lucide-react |
| Forms | react-hook-form (contact form only) |
| Contact delivery | Vercel serverless function → Resend REST API (no extra dependency) |

**Why React 18 and not 19:** Recoil 0.7.7, the latest release (the project is no longer
maintained), reads `React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED` on every
`useRecoilValue` call. React 19 removed that object, so every Recoil hook throws at runtime.
React is pinned to 18.3.1, the newest version Recoil supports.

## Scripts

```bash
npm install
npm run dev       # http://localhost:5173 (also serves /api/contact)
npm run lint
npm run build     # outputs dist/
npm run preview   # serves dist/ (also serves /api/contact)
```

## Project structure

```
api/contact.js              Vercel serverless function (POST /api/contact)
server/contact.js           Validation, spam checks, rate limit, Resend delivery (shared)
server/dev-middleware.js    Mounts the same handler in `vite dev` / `vite preview`
src/
  main.jsx                  RecoilRoot + StrictMode, enables reveal animations
  App.jsx                   Page composition and scroll spy
  index.css                 Theme tokens (light/dark), base styles, component classes
  state/ui.js               Recoil atoms: theme, mobile menu, command palette, active section
  lib/motion.js             GSAP + ScrollTrigger registration, reduced-motion helper
  hooks/                    useGsap, useScrollReveal, useScrollSpy, useThemeToggle
  data/                     Résumé content, navigation, verified project case studies
  components/
    layout/                 Navbar, ThemeToggle, CommandPalette (Ctrl/Cmd+K), Footer
    hero/                   Hero and the SVG coding-workstation illustration
    projects/               Project rows with case studies and per-project previews
    sections/               About, Projects, Experience, Skills, CompetitiveProgramming, Contact
```

## Themes

- Tokens are RGB triplets on `[data-theme="light"]` and `[data-theme="dark"]`, exposed to
  Tailwind as `bg-canvas`, `text-ink`, `text-muted`, `border-line`, `text-accent`, `bg-cta`, etc.
- An inline script in `index.html` sets `data-theme` before first paint: a stored choice
  (`localStorage["portfolio-theme"]`) wins, otherwise the OS preference.
- `themeState` (Recoil) starts from that value. A toggle persists the choice; until the
  visitor toggles, the site follows live OS theme changes.

## Contact form setup (required for email delivery)

The form posts to `/api/contact`. The server validates and sanitizes input, rejects
non-JSON requests, applies a honeypot and minimum fill-time check, rate-limits by IP
(5 per 10 minutes per instance), and sends a **plain-text** email through Resend, with
`reply_to` set to the visitor. The browser never receives the recipient address or any key.
The success message appears only after Resend accepts the email.

1. Create a Resend account at https://resend.com and an API key.
2. Sender address:
   - **Quick start:** keep `CONTACT_FROM_EMAIL=Portfolio Contact <onboarding@resend.dev>`.
     Resend's test sender only delivers to the email address that owns the Resend account,
     so register Resend with the inbox you set as `CONTACT_TO_EMAIL`.
   - **Production:** verify a domain in Resend and use an address on it.
3. Local development: copy `.env.example` to `.env` and fill in the values.
   (A git-ignored `.env` with `CONTACT_TO_EMAIL` already set exists locally; add `RESEND_API_KEY`.)
4. Vercel: set the project's **Root Directory** to `portfolio`, then add
   `CONTACT_TO_EMAIL`, `RESEND_API_KEY`, `CONTACT_FROM_EMAIL` and optionally
   `ALLOWED_ORIGINS` (your deployed origin) under Settings → Environment Variables.

Until `RESEND_API_KEY` and `CONTACT_TO_EMAIL` are set, the endpoint responds 503 and the form
shows a friendly "temporarily unavailable" error. Nothing is reported as sent.

Never commit `.env`. Only `.env.example` (placeholders) is tracked. None of the variables
use the `VITE_` prefix, so Vite never bundles them into client code.

## Content sources

- Personal details, education, experience, skills and competitive-programming figures come
  from the résumé. Ratings are labelled as résumé figures, not live data.
- Project descriptions were checked against each repository's README and source code.
  Live demo links are shown only for URLs that responded (Event-Connect, CodeBattle,
  AcadBoost, CollabCodeEditor).
- No email address or phone number appears anywhere in the public site.
