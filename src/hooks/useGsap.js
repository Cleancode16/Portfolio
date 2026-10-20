import { useLayoutEffect } from 'react'
import { gsap, prefersReducedMotion } from '../lib/motion'

/**
 * Runs GSAP code inside a gsap.context() scoped to `scopeRef`, and reverts it
 * on unmount. Reverting kills every tween and ScrollTrigger created inside, so
 * React Strict Mode's mount → unmount → mount cycle never duplicates animations.
 * The callback is skipped entirely when the visitor prefers reduced motion.
 */
export function useGsap(scopeRef, setup, deps = []) {
  useLayoutEffect(() => {
    if (!scopeRef.current || prefersReducedMotion()) return undefined
    // Create the context first, then add the setup: gsap.context(fn) runs fn
    // synchronously, so fn cannot reference the context's own variable.
    const ctx = gsap.context(() => {}, scopeRef)
    ctx.add(() => setup(ctx))
    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
