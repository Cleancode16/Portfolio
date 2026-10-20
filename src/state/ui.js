import { atom } from 'recoil'

export const THEME_STORAGE_KEY = 'portfolio-theme'

const prefersDark = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches

function readStoredTheme() {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY)
    return stored === 'light' || stored === 'dark' ? stored : null
  } catch {
    return null
  }
}

function applyTheme(theme) {
  const root = document.documentElement
  root.setAttribute('data-theme', theme)
  root.style.colorScheme = theme
}

/**
 * Initial value: the theme index.html already applied before first paint
 * (stored choice, else the OS preference), so React never disagrees with the DOM.
 */
function initialTheme() {
  if (typeof document === 'undefined') return 'light'
  const applied = document.documentElement.getAttribute('data-theme')
  if (applied === 'light' || applied === 'dark') return applied
  return readStoredTheme() ?? (prefersDark() ? 'dark' : 'light')
}

/**
 * Persistence strategy:
 * - An explicit toggle is written to localStorage and wins on later visits.
 * - Until the visitor chooses, the theme follows live OS changes.
 */
const themeSyncEffect = ({ setSelf, onSet, trigger }) => {
  if (trigger === 'get') applyTheme(initialTheme())

  onSet((theme, _previous, isReset) => {
    applyTheme(theme)
    try {
      if (isReset) localStorage.removeItem(THEME_STORAGE_KEY)
      else localStorage.setItem(THEME_STORAGE_KEY, theme)
    } catch {
      // Storage can be unavailable (private mode); the theme still applies for this visit.
    }
  })

  const media = window.matchMedia?.('(prefers-color-scheme: dark)')
  if (!media) return undefined
  const followSystem = (event) => {
    if (readStoredTheme()) return
    const next = event.matches ? 'dark' : 'light'
    applyTheme(next)
    setSelf(next)
  }
  media.addEventListener('change', followSystem)
  return () => media.removeEventListener('change', followSystem)
}

/** 'light' | 'dark' */
export const themeState = atom({
  key: 'ui/theme',
  default: initialTheme(),
  effects: [themeSyncEffect],
})

/** Mobile navigation sheet: shared by the menu button, the sheet and the command palette. */
export const mobileMenuState = atom({
  key: 'ui/mobileMenuOpen',
  default: false,
})

/** Cmd/Ctrl + K command palette visibility: opened from the navbar and a global shortcut. */
export const commandPaletteState = atom({
  key: 'ui/commandPaletteOpen',
  default: false,
})

/** Id of the section currently in view: written by the scroll spy, read by the desktop and mobile navigation. */
export const activeSectionState = atom({
  key: 'ui/activeSection',
  default: 'home',
})

export const INTRO_STORAGE_KEY = 'portfolio-intro-seen'

/** The boot intro plays once per browser session, never for reduced-motion visitors. */
function shouldPlayIntro() {
  if (typeof window === 'undefined') return false
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return false
  try {
    return sessionStorage.getItem(INTRO_STORAGE_KEY) !== '1'
  } catch {
    return false
  }
}

/** True while the macOS-style boot intro covers the page; the hero waits for it before animating in. */
export const introPlayingState = atom({
  key: 'ui/introPlaying',
  default: shouldPlayIntro(),
})
