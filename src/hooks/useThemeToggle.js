import { useCallback, useEffect, useRef } from 'react'
import { flushSync } from 'react-dom'
import { useRecoilState } from 'recoil'
import { themeState } from '../state/ui'
import { prefersReducedMotion } from '../lib/motion'

const REVEAL_MS = 900
const REVEAL_EASE = 'cubic-bezier(0.65, 0, 0.35, 1)'
const FADE_MS = 800

/** Where the reveal starts: the clicked control, else the navbar's theme toggle area (top right). */
function revealOrigin(event) {
  const target = event?.currentTarget
  if (target?.getBoundingClientRect) {
    const rect = target.getBoundingClientRect()
    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
  }
  return { x: window.innerWidth - 72, y: 36 }
}

/**
 * Returns [theme, toggleTheme].
 * - View Transitions API available: the new theme is revealed in a circle that
 *   expands from the toggle (macOS-style), about 0.9s.
 * - Otherwise: colors cross-fade over about 0.8s.
 * - Reduced motion: the theme switches instantly.
 */
export function useThemeToggle() {
  const [theme, setTheme] = useRecoilState(themeState)
  const timer = useRef(0)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const toggleTheme = useCallback(
    (event) => {
      const root = document.documentElement
      const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'

      // Apply to the DOM first so components that read computed theme tokens during
      // the re-render (the Recharts panels) always see the new values.
      const apply = () => {
        root.setAttribute('data-theme', next)
        root.style.colorScheme = next
        flushSync(() => setTheme(next))
      }

      if (prefersReducedMotion()) {
        apply()
        return
      }

      if (typeof document.startViewTransition === 'function') {
        const { x, y } = revealOrigin(event)
        const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y))
        root.classList.add('theme-reveal')
        const transition = document.startViewTransition(apply)
        transition.ready
          .then(() => {
            root.animate(
              { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
              { duration: REVEAL_MS, easing: REVEAL_EASE, pseudoElement: '::view-transition-new(root)' },
            )
          })
          .catch(() => {})
        transition.finished.finally(() => root.classList.remove('theme-reveal'))
        return
      }

      // Fallback: cross-fade colors.
      root.classList.add('theme-transition')
      window.clearTimeout(timer.current)
      timer.current = window.setTimeout(() => root.classList.remove('theme-transition'), FADE_MS + 80)
      apply()
    },
    [setTheme],
  )

  return [theme, toggleTheme]
}
