import { useRef } from 'react'
import { useRecoilValue } from 'recoil'
import { ArrowDown, ArrowRight, CircleCheck, LoaderCircle } from 'lucide-react'
import CodingIllustration from './CodingIllustration'
import { gsap, EASE } from '../../lib/motion'
import { useGsap } from '../../hooks/useGsap'
import { introPlayingState } from '../../state/ui'
import { heroFacts, heroRoles } from '../../data/profile'

// Decorative CI status beside the hero illustration: stages only, no figures.
const PIPELINE = [
  { step: 'Build', state: 'passed' },
  { step: 'Tests', state: 'passed' },
  { step: 'Deploy', state: 'running' },
]

export default function Hero() {
  const scope = useRef(null)
  const introPlaying = useRecoilValue(introPlayingState)

  // Wait for the boot intro to finish so the entrance is actually seen.
  useGsap(
    scope,
    () => {
      if (introPlaying) return
      const timeline = gsap.timeline({ defaults: { ease: EASE } })
      timeline
        .fromTo('[data-hero="text"]', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.08 })
        .fromTo(
          '[data-hero="visual"]',
          { opacity: 0, y: 32, scale: 0.97 },
          { opacity: 1, y: 0, scale: 1, duration: 0.9 },
          0.2,
        )
        .fromTo('[data-hero="chip"]', { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.1 }, 0.75)

      // Gentle, slow drift on the floating details only.
      gsap.to('.hero-float-a', { y: -8, duration: 3.2, ease: 'sine.inOut', yoyo: true, repeat: -1 })
      gsap.to('.hero-float-b', { y: 7, duration: 3.8, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 0.6 })
    },
    [introPlaying],
  )

  return (
    <section
      id="home"
      ref={scope}
      aria-labelledby="hero-title"
      className="relative isolate overflow-hidden pb-16 pt-28 sm:pb-24 sm:pt-36 lg:min-h-[100svh] lg:pb-20 lg:pt-40"
    >
      <div aria-hidden="true" className="ambient pointer-events-none absolute inset-0 -z-10" />

      <div className="shell grid items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-8">
        <div className="max-w-2xl">
          <p data-hero="text" className="eyebrow">
            Full-Stack Developer <span aria-hidden="true">·</span> First-Principles Thinker
          </p>

          <h1 id="hero-title" data-hero="text" className="mt-6 text-display text-ink">
            I build scalable software by thinking <span className="text-gradient">from first principles.</span>
          </h1>

          <p data-hero="text" className="mt-7 max-w-[34rem] text-lg leading-relaxed text-muted sm:text-xl sm:leading-relaxed">
            Software developer passionate about scalable systems, system design, and building applications from first
            principles. I enjoy solving challenging problems through competitive programming and data structures and
            algorithms.
          </p>

          <div data-hero="text" className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a href="#projects" className="btn-primary">
              Explore My Work
              <ArrowRight aria-hidden="true" className="h-4 w-4" strokeWidth={2} />
            </a>
            <a href="#contact" className="btn-glass">
              Get in Touch
            </a>
          </div>

          <div data-hero="text" className="mt-12 flex max-w-xl flex-wrap items-center gap-x-3 gap-y-2">
            <span id="hero-roles" className="eyebrow text-[0.6875rem]">
              Roles
            </span>
            <ul aria-labelledby="hero-roles" className="flex flex-wrap gap-1.5">
              {heroRoles.map((role) => (
                <li
                  key={role}
                  className="rounded-lg border border-line/70 bg-surface/60 px-2.5 py-1 text-[0.8125rem] leading-5 text-ink/85 backdrop-blur-sm transition-colors duration-200 hover:border-ink/25 hover:text-ink"
                >
                  {role}
                </li>
              ))}
            </ul>
          </div>

          <ul
            data-hero="text"
            aria-label="Highlights"
            className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[0.75rem] text-muted"
          >
            {heroFacts.map((fact, index) => (
              <li key={fact} className="flex items-center gap-3">
                {index > 0 && <span aria-hidden="true" className="h-1 w-1 rounded-full bg-line" />}
                {fact}
              </li>
            ))}
          </ul>
        </div>

        <div data-hero="visual" className="relative mx-auto w-full max-w-[22rem] sm:max-w-[30rem] lg:max-w-none">
          <div className="relative aspect-[600/540] w-full">
            <CodingIllustration className="absolute inset-0 h-full w-full" />

            <div
              data-hero="chip"
              aria-hidden="true"
              className="absolute right-0 top-[2%] hidden sm:block"
            >
              <div className="hero-float-a glass w-52 rounded-2xl px-4 py-3 shadow-lift">
                <div className="flex items-center gap-1.5 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  CI pipeline · main
                </div>
                <ul className="mt-2.5 space-y-1.5 text-[0.8125rem]">
                  {PIPELINE.map(({ step, state }) => (
                    <li key={step} className="flex items-center justify-between gap-3">
                      <span className="flex items-center gap-2 font-medium text-ink">
                        {state === 'running' ? (
                          <LoaderCircle
                            aria-hidden="true"
                            className="h-3.5 w-3.5 animate-spin text-accent motion-reduce:animate-none"
                            strokeWidth={2.25}
                          />
                        ) : (
                          <CircleCheck aria-hidden="true" className="h-3.5 w-3.5 text-success" strokeWidth={2.25} />
                        )}
                        {step}
                      </span>
                      <span className={`font-mono text-[0.6875rem] ${state === 'running' ? 'text-accent' : 'text-muted'}`}>
                        {state}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div data-hero="chip" aria-hidden="true" className="absolute bottom-[14%] right-0 sm:right-[2%]">
              <div className="hero-float-b glass inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-[0.75rem] font-medium text-ink shadow-lift">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-50 motion-reduce:hidden" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
                </span>
                Developer mode
              </div>
            </div>
          </div>
        </div>
      </div>

      <a
        href="#about"
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 items-center gap-2 text-[0.75rem] text-muted transition hover:text-ink lg:inline-flex"
      >
        <ArrowDown aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={1.75} />
        Scroll to learn more
      </a>
    </section>
  )
}
