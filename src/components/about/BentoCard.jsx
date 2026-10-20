import { useRef } from 'react'
import { ScrollTrigger } from '../../lib/motion'
import { useGsap } from '../../hooks/useGsap'

// Faint dot grid behind every illustration, drawn from the line token.
const DOT_GRID = {
  backgroundImage: 'radial-gradient(rgb(var(--line) / 0.55) 1px, transparent 1px)',
  backgroundSize: '16px 16px',
  backgroundPosition: 'center',
}

/**
 * Bento card shared by About and Education: an illustration well on top,
 * text below. `Illustration` may expose `scene(root)` returning a paused GSAP
 * timeline; it plays only while the card is on screen. gsap.context (inside
 * useGsap) reverts it on unmount, and nothing runs for reduced motion.
 */
export default function BentoCard({ Illustration, title, text, children, className = '' }) {
  const sceneRef = useRef(null)

  useGsap(sceneRef, () => {
    const timeline = Illustration.scene?.(sceneRef.current)
    if (!timeline) return
    ScrollTrigger.create({
      trigger: sceneRef.current,
      start: 'top bottom',
      end: 'bottom top',
      onToggle: (self) => (self.isActive ? timeline.play() : timeline.pause()),
    })
  })

  const onPointerMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect()
    event.currentTarget.style.setProperty('--mx', `${event.clientX - rect.left}px`)
    event.currentTarget.style.setProperty('--my', `${event.clientY - rect.top}px`)
  }

  return (
    <article
      onPointerMove={onPointerMove}
      className={`group relative flex h-full flex-col overflow-hidden rounded-3xl border border-line/70 bg-surface p-2.5 shadow-soft transition duration-300 ease-apple hover:-translate-y-1 hover:border-ink/20 hover:shadow-lift motion-reduce:hover:translate-y-0 ${className}`}
    >
      {/* Soft light that follows the pointer while hovering. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            'radial-gradient(420px circle at var(--mx, 50%) var(--my, 0%), rgb(var(--accent) / 0.07), transparent 45%)',
        }}
      />
      <div
        ref={sceneRef}
        className="relative h-44 overflow-hidden rounded-[1.125rem] border border-line/60 bg-canvas sm:h-48"
        style={DOT_GRID}
      >
        <Illustration />
      </div>
      <div className="relative flex flex-1 flex-col px-3 pb-4 pt-5 sm:px-4">
        {title && <h3 className="text-[1.0625rem] font-semibold tracking-tight text-ink">{title}</h3>}
        {text && <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted">{text}</p>}
        {children}
      </div>
    </article>
  )
}
