import { useCallback, useEffect, useRef } from 'react'
import { useRecoilState } from 'recoil'
import { themeState } from '../state/ui'
import { prefersReducedMotion } from '../lib/motion'

/** Returns [theme, toggleTheme]. Colors cross-fade briefly unless reduced motion is requested. */
export function useThemeToggle() {
  const [theme, setTheme] = useRecoilState(themeState)
  const timer = useRef(0)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const toggleTheme = useCallback(() => {
    const root = document.documentElement
    if (!prefersReducedMotion()) {
      root.classList.add('theme-transition')
      window.clearTimeout(timer.current)
      timer.current = window.setTimeout(() => root.classList.remove('theme-transition'), 400)
    }
    // Apply to the DOM first so components that read computed theme tokens during
    // the re-render (the Recharts panel) always see the new values.
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'
    root.setAttribute('data-theme', next)
    root.style.colorScheme = next
    setTheme(next)
  }, [setTheme])

  return [theme, toggleTheme]
}
