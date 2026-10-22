import { useEffect, useRef, useState } from 'react'
import { AppWindow, ArrowUpRight, FolderGit2 } from 'lucide-react'
import ProjectVisual from './ProjectVisual'
import CaseStudyModal from './CaseStudyModal'
import { gsap, prefersReducedMotion } from '../../lib/motion'

function useTilt(ref) {
  useEffect(() => {
    const el = ref.current
    if (!el || prefersReducedMotion()) return undefined
    const rotateX = gsap.quickTo(el, 'rotationX', { duration: 0.45, ease: 'power3.out' })
    const rotateY = gsap.quickTo(el, 'rotationY', { duration: 0.45, ease: 'power3.out' })
    gsap.set(el, { transformPerspective: 1200 })

    const onMove = (event) => {
      if (event.pointerType !== 'mouse') return
      const rect = el.getBoundingClientRect()
      const x = (event.clientX - rect.left) / rect.width - 0.5
      const y = (event.clientY - rect.top) / rect.height - 0.5
      rotateY(x * 5)
      rotateX(-y * 5)
    }
    const onLeave = () => {
      rotateX(0)
      rotateY(0)
    }
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)
    return () => {
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
      gsap.killTweensOf(el)
      gsap.set(el, { clearProps: 'transform' })
    }
  }, [ref])
}

/**
 * variant "featured": full-width editorial row (alternating sides on desktop).
 * variant "compact": stacked card for a grid; same content. Both open the case study in a CaseStudyModal window.
 */
export default function ProjectRow({ project, index, variant = 'featured' }) {
  const [open, setOpen] = useState(false)
  const launcherRef = useRef(null)
  const visualRef = useRef(null)
  const compact = variant === 'compact'
  const reversed = !compact && index % 2 === 1
  useTilt(visualRef)

  return (
    <article
      aria-labelledby={`${project.id}-title`}
      className={compact ? 'flex flex-col' : 'py-16 sm:py-20'}
    >
      <div className={compact ? 'flex flex-1 flex-col gap-7' : 'grid items-center gap-10 lg:grid-cols-2 lg:gap-16'}>
        <div className={reversed ? 'lg:order-2' : ''} data-reveal>
          <div ref={visualRef} className="will-change-transform">
            <ProjectVisual type={project.visual} />
          </div>
        </div>

        <div className={compact ? 'flex flex-1 flex-col' : reversed ? 'lg:order-1' : ''}>
          <p className="flex items-center gap-3 font-mono text-[0.75rem] text-muted" data-reveal="soft">
            <span className="text-ink">{String(index + 1).padStart(2, '0')}</span>
            <span aria-hidden="true" className="h-px w-6 bg-line" />
            {project.context}
          </p>
          <h3
            id={`${project.id}-title`}
            className={`mt-4 text-ink ${compact ? 'text-[1.375rem] tracking-tight' : 'text-headline sm:text-[2.125rem]'}`}
            data-reveal
          >
            {project.name}
          </h3>
          <p className={`mt-2 font-medium text-ink/70 ${compact ? 'text-[1rem]' : 'text-lg'}`} data-reveal="soft">
            {project.tagline}
          </p>
          <ul
            className={`max-w-prose space-y-2.5 leading-relaxed text-muted ${compact ? 'mt-4 text-[0.9375rem]' : 'mt-5'}`}
            aria-label="Key highlights"
            data-reveal="soft"
          >
            {project.highlights.map((point) => (
              <li key={point} className="flex gap-3">
                <span aria-hidden="true" className="mt-[0.6rem] h-1.5 w-1.5 flex-none rounded-full bg-accent/80" />
                <span>{point}</span>
              </li>
            ))}
          </ul>

          <ul className="mt-6 flex flex-wrap gap-1.5" aria-label="Technology stack" data-reveal="soft">
            {project.stack.map((tech) => (
              <li key={tech} className="mono-chip">
                {tech}
              </li>
            ))}
          </ul>

          <div
            className={`flex flex-wrap items-center gap-x-6 gap-y-3 ${compact ? 'mt-auto pt-7' : 'mt-8'}`}
            data-reveal="soft"
          >
            <button
              ref={launcherRef}
              type="button"
              className="btn-secondary min-h-[40px] px-5 text-[0.875rem]"
              aria-haspopup="dialog"
              onClick={() => setOpen(true)}
            >
              <AppWindow aria-hidden="true" className="h-4 w-4" strokeWidth={1.75} />
              Read case study
            </button>
            <a href={project.repo} target="_blank" rel="noreferrer" className="link-arrow text-[0.9375rem]">
              <FolderGit2 aria-hidden="true" className="h-4 w-4" strokeWidth={1.75} />
              Source code
              <span className="sr-only"> for {project.name} on GitHub (opens in a new tab)</span>
            </a>
            {project.live && (
              <a href={project.live} target="_blank" rel="noreferrer" className="link-arrow text-[0.9375rem]">
                Live demo
                <ArrowUpRight aria-hidden="true" className="h-4 w-4" strokeWidth={2} />
                <span className="sr-only"> of {project.name} (opens in a new tab)</span>
              </a>
            )}
          </div>
        </div>
      </div>

      {open && <CaseStudyModal project={project} originRef={launcherRef} onClose={() => setOpen(false)} />}
    </article>
  )
}
