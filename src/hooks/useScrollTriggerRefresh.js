import { useEffect } from 'react'
import { ScrollTrigger } from '../lib/motion'

/**
 * ScrollTrigger measures trigger positions once and only re-measures on window
 * resize. Content that changes height in place (Skills filters, case studies
 * opening, the chart mounting) would leave later reveal triggers at stale
 * positions, so content could stay transparent after scrolling into view.
 * This watches the element's height and refreshes ScrollTrigger (debounced).
 */
export function useScrollTriggerRefresh(ref) {
  useEffect(() => {
    const el = ref.current
    if (!el || typeof ResizeObserver === 'undefined') return undefined
    let lastHeight = el.offsetHeight
    let timer = 0
    const observer = new ResizeObserver(() => {
      const height = el.offsetHeight
      if (height === lastHeight) return
      lastHeight = height
      window.clearTimeout(timer)
      timer = window.setTimeout(() => ScrollTrigger.refresh(), 180)
    })
    observer.observe(el)
    return () => {
      observer.disconnect()
      window.clearTimeout(timer)
    }
  }, [ref])
}
