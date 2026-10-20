import { gsap, ScrollTrigger, EASE } from '../lib/motion'
import { useGsap } from './useGsap'

/**
 * Fades and lifts every [data-reveal] element inside the scope as it enters
 * the viewport. Elements that arrive together are staggered slightly.
 * data-reveal="soft" uses a shorter travel distance for dense content.
 */
export function useScrollReveal(scopeRef) {
  useGsap(scopeRef, () => {
    const items = gsap.utils.toArray('[data-reveal]', scopeRef.current)
    if (items.length === 0) return

    ScrollTrigger.batch(items, {
      start: 'top 88%',
      once: true,
      onEnter: (batch) =>
        gsap.fromTo(
          batch,
          { opacity: 0, y: (_, el) => (el.dataset.reveal === 'soft' ? 10 : 24) },
          { opacity: 1, y: 0, duration: 0.7, ease: EASE, stagger: 0.07, overwrite: true },
        ),
    })
  })
}
