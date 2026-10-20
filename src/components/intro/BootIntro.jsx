import { useLayoutEffect, useRef, useState } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { INTRO_STORAGE_KEY, introPlayingState } from '../../state/ui'
import { gsap } from '../../lib/motion'

/**
 * A short macOS-style "boot": monogram and a progress bar on black, then the
 * screen fades away while the hero begins its entrance underneath. About 1.6s,
 * shown once per session, skippable with any click or key, and never shown
 * when reduced motion is requested (see introPlayingState).
 */
export default function BootIntro() {
  const initiallyPlaying = useRecoilValue(introPlayingState)
  const setPlaying = useSetRecoilState(introPlayingState)
  // Local flag keeps the overlay mounted through its fade-out, after the
  // shared flag has already released the hero.
  const [mounted, setMounted] = useState(initiallyPlaying)
  const rootRef = useRef(null)

  useLayoutEffect(() => {
    const root = rootRef.current
    if (!mounted || !root) return undefined

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const ctx = gsap.context(() => {}, root)
    let timeline
    ctx.add(() => {
      timeline = gsap
        .timeline({
          onComplete: () => {
            try {
              sessionStorage.setItem(INTRO_STORAGE_KEY, '1')
            } catch {
              // Storage unavailable: the intro may simply play again next visit.
            }
            setPlaying(false)
            setMounted(false)
          },
        })
        .fromTo('[data-boot-logo]', { opacity: 0, scale: 0.94 }, { opacity: 1, scale: 1, duration: 0.5, ease: 'power2.out' })
        .fromTo('[data-boot-track]', { opacity: 0 }, { opacity: 1, duration: 0.25 }, '-=0.15')
        // Fill in uneven steps, like a real boot bar.
        .fromTo('[data-boot-bar]', { scaleX: 0 }, { scaleX: 0.35, duration: 0.35, ease: 'power1.inOut' })
        .to('[data-boot-bar]', { scaleX: 0.7, duration: 0.3, ease: 'power1.inOut' }, '+=0.08')
        .to('[data-boot-bar]', { scaleX: 1, duration: 0.25, ease: 'power2.out' }, '+=0.05')
        // Release the hero as the fade begins, so the two blend instead of leaving an empty frame.
        .add(() => setPlaying(false), '+=0.12')
        .to(root, { opacity: 0, duration: 0.5, ease: 'power2.inOut' }, '<')
    })

    // Any interaction skips straight to the end.
    const skip = () => timeline?.progress(1)
    window.addEventListener('keydown', skip)
    window.addEventListener('pointerdown', skip)

    return () => {
      window.removeEventListener('keydown', skip)
      window.removeEventListener('pointerdown', skip)
      document.body.style.overflow = previousOverflow
      ctx.revert()
    }
  }, [mounted, setPlaying])

  if (!mounted) return null

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black"
    >
      <span
        data-boot-logo
        className="grid h-16 w-16 place-items-center rounded-[18px] bg-white font-mono text-[1.375rem] font-semibold text-black opacity-0"
      >
        DB
      </span>
      <span data-boot-track className="mt-12 block h-[5px] w-44 overflow-hidden rounded-full bg-white/20 opacity-0">
        <span data-boot-bar className="block h-full w-full origin-left scale-x-0 rounded-full bg-white" />
      </span>
    </div>
  )
}
