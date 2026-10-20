import { useEffect, useRef } from 'react'
import TechIcon from './TechIcon'
import { gsap, prefersReducedMotion } from '../../lib/motion'

const RANGE = 150 // px from the pointer within which icons react (wider = gentler falloff)
const MAX_SCALE = 0.22 // extra scale for the icon directly under the pointer
const MAX_LIFT = 8 // px
const GLIDE = { duration: 0.5, ease: 'power2.out' } // trailing ease so icons glide, not snap

/**
 * macOS Dock: icons magnify with distance from the pointer and lift slightly,
 * and a small tooltip names the hovered icon. Transforms only, so the layout
 * never shifts. Mouse only; touch and reduced-motion visitors get a static dock.
 *
 * Smoothness: slot centres are measured once per hover (transforms never move
 * the slots), pointer updates are batched to one per animation frame, and a
 * cosine falloff plus a 0.5s power2 glide keeps neighbouring icons fluid.
 */
export default function Dock({ items }) {
  const dockRef = useRef(null)
  const tipRef = useRef(null)

  useEffect(() => {
    const dock = dockRef.current
    const tip = tipRef.current
    if (!dock || !tip) return undefined

    const reduced = prefersReducedMotion()
    const slots = Array.from(dock.querySelectorAll('[data-dock-slot]'))
    const icons = slots.map((slot) => slot.querySelector('[data-dock-icon]'))
    const setters = reduced
      ? []
      : icons.map((icon) => ({
          scale: gsap.quickTo(icon, 'scale', GLIDE),
          y: gsap.quickTo(icon, 'y', GLIDE),
        }))
    let centers = []
    let current = null
    let frame = 0
    let pointerX = 0

    const measure = () => {
      centers = slots.map((slot) => {
        const rect = slot.getBoundingClientRect()
        return rect.left + rect.width / 2
      })
    }

    const showTip = (slot) => {
      if (slot === current) return
      current = slot
      if (!slot) {
        gsap.to(tip, { autoAlpha: 0, y: 4, duration: reduced ? 0 : 0.2, ease: 'power2.out', overwrite: true })
        return
      }
      tip.textContent = slot.dataset.name
      const x = slot.offsetLeft + slot.offsetWidth / 2
      if (reduced || Number(gsap.getProperty(tip, 'opacity')) === 0) gsap.set(tip, { x })
      gsap.to(tip, { x, autoAlpha: 1, y: 0, duration: reduced ? 0 : 0.3, ease: 'power2.out', overwrite: true })
    }

    const magnify = () => {
      frame = 0
      centers.forEach((center, i) => {
        const t = Math.min(1, Math.abs(pointerX - center) / RANGE)
        const strength = t >= 1 ? 0 : (1 + Math.cos(Math.PI * t)) / 2 // cosine falloff: 1 at the pointer, 0 at RANGE
        setters[i].scale(1 + MAX_SCALE * strength)
        setters[i].y(-MAX_LIFT * strength)
      })
    }

    const onEnter = (event) => {
      if (event.pointerType === 'mouse') measure()
    }

    const onMove = (event) => {
      if (event.pointerType !== 'mouse') return
      showTip(event.target.closest?.('[data-dock-slot]') ?? null)
      if (reduced) return
      if (centers.length === 0) measure()
      pointerX = event.clientX
      if (!frame) frame = requestAnimationFrame(magnify)
    }

    const onLeave = () => {
      if (frame) cancelAnimationFrame(frame)
      frame = 0
      centers = []
      showTip(null)
      setters.forEach((set) => {
        set.scale(1)
        set.y(0)
      })
    }

    gsap.set(tip, { autoAlpha: 0, xPercent: -50 })
    gsap.set(icons, { force3D: true })
    dock.addEventListener('pointerenter', onEnter)
    dock.addEventListener('pointermove', onMove)
    dock.addEventListener('pointerleave', onLeave)
    // The dock can scroll horizontally on narrow screens; re-measure if it does.
    dock.addEventListener('scroll', measure, { passive: true })
    return () => {
      if (frame) cancelAnimationFrame(frame)
      dock.removeEventListener('pointerenter', onEnter)
      dock.removeEventListener('pointermove', onMove)
      dock.removeEventListener('pointerleave', onLeave)
      dock.removeEventListener('scroll', measure)
      gsap.killTweensOf([tip, ...icons])
      gsap.set(icons, { clearProps: 'transform' })
    }
  }, [items])

  return (
    <div className="flex justify-center">
      <div className="relative max-w-full">
        <span
          ref={tipRef}
          aria-hidden="true"
          className="glass pointer-events-none absolute bottom-[calc(100%+1.5rem)] left-0 z-10 whitespace-nowrap rounded-lg px-2.5 py-1 text-[0.75rem] font-medium text-ink opacity-0 shadow-soft"
        />
        <ul
          ref={dockRef}
          aria-label="Core stack"
          className="glass flex max-w-full items-end gap-2 overflow-x-auto rounded-[1.375rem] p-2.5 shadow-lift [scrollbar-width:none] sm:gap-2.5 sm:overflow-visible sm:p-3 [&::-webkit-scrollbar]:hidden"
        >
          {items.map((item) => (
            <li key={item.name} data-dock-slot data-name={item.name} className="flex-none">
              <span data-dock-icon className="block origin-bottom will-change-transform">
                <TechIcon icon={item.icon} className="h-11 w-11 sm:h-12 sm:w-12" />
              </span>
              <span className="sr-only">{item.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
