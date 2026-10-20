import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { ArrowUpRight, FolderGit2, Maximize2, Minimize2, Minus, X } from 'lucide-react'
import { gsap, prefersReducedMotion } from '../../lib/motion'

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'

function Section({ label, children }) {
  return (
    <section className="border-t border-line/60 py-6 first:border-t-0 first:pt-0">
      <h3 className="eyebrow">{label}</h3>
      <div className="mt-3 text-[0.9375rem] leading-relaxed text-ink/85">{children}</div>
    </section>
  )
}

/**
 * macOS-style window for a project case study. Opens from the button that
 * launched it (scale + fade from that point, like an app opening from the
 * Dock) and closes back toward it. Rendered in a portal so transformed
 * ancestors (scroll reveals) can't capture its fixed positioning.
 */
export default function CaseStudyModal({ project, originRef, onClose }) {
  const overlayRef = useRef(null)
  const windowRef = useRef(null)
  const closeRef = useRef(null)
  const closingRef = useRef(false)
  const [zoomed, setZoomed] = useState(false)
  const titleId = `${project.id}-case-title`

  // Point inside the window that lines up with the launching button.
  const originPoint = useCallback(() => {
    const win = windowRef.current?.getBoundingClientRect()
    const btn = originRef.current?.getBoundingClientRect()
    if (!win || !btn) return '50% 50%'
    return `${btn.left + btn.width / 2 - win.left}px ${btn.top + btn.height / 2 - win.top}px`
  }, [originRef])

  const close = useCallback(() => {
    if (closingRef.current) return
    closingRef.current = true
    if (prefersReducedMotion()) {
      onClose()
      return
    }
    gsap
      .timeline({ onComplete: onClose })
      .to(windowRef.current, {
        opacity: 0,
        scale: 0.9,
        transformOrigin: originPoint(),
        duration: 0.24,
        ease: 'power2.in',
      })
      .to(overlayRef.current, { opacity: 0, duration: 0.22, ease: 'power1.out' }, '<0.04')
  }, [onClose, originPoint])

  // Open animation, scroll lock and focus handling.
  useLayoutEffect(() => {
    const overlay = overlayRef.current
    const win = windowRef.current
    const launcher = originRef.current
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus({ preventScroll: true })

    let timeline
    if (!prefersReducedMotion()) {
      timeline = gsap
        .timeline()
        .fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: 'power1.out' })
        .fromTo(
          win,
          { opacity: 0, scale: 0.88, transformOrigin: originPoint() },
          { opacity: 1, scale: 1, duration: 0.42, ease: 'power3.out' },
          '<0.02',
        )
    }

    return () => {
      timeline?.kill()
      gsap.killTweensOf([overlay, win])
      document.body.style.overflow = previousOverflow
      launcher?.focus({ preventScroll: true })
    }
  }, [originRef, originPoint])

  // Escape closes; Tab stays inside the window.
  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        close()
        return
      }
      if (event.key !== 'Tab') return
      const items = windowRef.current ? Array.from(windowRef.current.querySelectorAll(FOCUSABLE)) : []
      if (items.length === 0) return
      const first = items[0]
      const last = items[items.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [close])

  const control = 'grid h-3 w-3 place-items-center rounded-full border border-black/10 transition-transform duration-150 active:scale-90'
  const glyph = 'h-2 w-2 text-black/60 opacity-0 transition-opacity duration-150 group-hover/lights:opacity-100 group-focus-within/lights:opacity-100'

  return createPortal(
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-3 sm:p-6">
      <div
        ref={overlayRef}
        aria-hidden="true"
        className="absolute inset-0 bg-black/35 backdrop-blur-[3px] dark:bg-black/55"
        onClick={close}
      />

      <div
        ref={windowRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`relative flex max-h-[min(86vh,760px)] w-full flex-col overflow-hidden rounded-[14px] border border-line/70 transition-[max-width] duration-300 ease-apple ${
          zoomed ? 'max-w-5xl' : 'max-w-3xl'
        }`}
        style={{
          backgroundColor: 'rgb(var(--surface) / 0.86)',
          WebkitBackdropFilter: 'saturate(180%) blur(28px)',
          backdropFilter: 'saturate(180%) blur(28px)',
          boxShadow:
            'inset 0 1px 0 rgb(255 255 255 / 0.08), 0 0 0 0.5px rgb(0 0 0 / 0.12), 0 24px 48px -12px rgb(0 0 0 / 0.35), 0 48px 120px -24px rgb(0 0 0 / 0.45)',
        }}
      >
        {/* Title bar */}
        <div className="relative flex h-11 flex-none items-center border-b border-line/60 px-4">
          <div className="group/lights flex items-center gap-2">
            <button ref={closeRef} type="button" onClick={close} aria-label="Close case study" className={`${control} bg-[#ff5f57]`}>
              <X aria-hidden="true" className={glyph} strokeWidth={3} />
            </button>
            <button type="button" onClick={close} aria-label="Minimise case study" className={`${control} bg-[#febc2e]`}>
              <Minus aria-hidden="true" className={glyph} strokeWidth={3} />
            </button>
            <button
              type="button"
              onClick={() => setZoomed((value) => !value)}
              aria-label={zoomed ? 'Restore window size' : 'Enlarge window'}
              aria-pressed={zoomed}
              className={`${control} hidden bg-[#28c840] md:grid`}
            >
              {zoomed ? (
                <Minimize2 aria-hidden="true" className={glyph} strokeWidth={3} />
              ) : (
                <Maximize2 aria-hidden="true" className={glyph} strokeWidth={3} />
              )}
            </button>
          </div>
          <p className="pointer-events-none absolute inset-x-24 truncate text-center text-[0.8125rem] font-semibold text-muted">
            {project.name} — Case study
          </p>
        </div>

        {/* Body */}
        <div className="overflow-y-auto overscroll-contain px-6 pb-8 pt-7 sm:px-10 sm:pt-9">
          <p className="eyebrow">{project.context}</p>
          <h2 id={titleId} className="mt-3 text-headline text-ink sm:text-[2rem]">
            {project.name}
          </h2>
          <p className="mt-1.5 text-lg font-medium text-ink/70">{project.tagline}</p>

          <ul className="mt-5 flex flex-wrap gap-1.5" aria-label="Technology stack">
            {project.stack.map((tech) => (
              <li key={tech} className="mono-chip">
                {tech}
              </li>
            ))}
          </ul>

          <div className={`mt-9 grid gap-x-10 ${zoomed ? 'md:grid-cols-2' : ''}`}>
            <div>
              <Section label="Problem">{project.problem}</Section>
              <Section label="Approach">{project.approach}</Section>
            </div>
            <div className={zoomed ? 'md:border-l md:border-line/60 md:pl-10' : ''}>
              <Section label="Implementation">
                <ul className="space-y-2.5">
                  {project.implementation.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span aria-hidden="true" className="mt-[0.6rem] h-1 w-1 flex-none rounded-full bg-accent" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </Section>
              <Section label="Outcome">{project.outcome}</Section>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-none flex-wrap items-center justify-end gap-3 border-t border-line/60 px-6 py-4 sm:px-10">
          <a href={project.repo} target="_blank" rel="noopener noreferrer" className="btn-secondary min-h-[40px] px-4 text-[0.875rem]">
            <FolderGit2 aria-hidden="true" className="h-4 w-4" strokeWidth={1.75} />
            Source code
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
          {project.live && (
            <a href={project.live} target="_blank" rel="noopener noreferrer" className="btn-primary min-h-[40px] px-4 text-[0.875rem]">
              Live demo
              <ArrowUpRight aria-hidden="true" className="h-4 w-4" strokeWidth={2} />
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          )}
        </div>
      </div>
    </div>,
    document.body,
  )
}
