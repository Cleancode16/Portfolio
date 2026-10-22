import { useRef } from 'react'
import { useRecoilValue } from 'recoil'
import { ArrowDown, ArrowRight, BadgeCheck, CircleCheck, LoaderCircle, Sparkles } from 'lucide-react'
import CodingIllustration from './CodingIllustration'
import { gsap, EASE } from '../../lib/motion'
import { useGsap } from '../../hooks/useGsap'
import { introPlayingState } from '../../state/ui'
import { heroRoles, heroStats } from '../../data/profile'

// Decorative CI status beside the hero illustration: stages only, no figures.
const PIPELINE = [
  { step: 'Build', state: 'passed' },
  { step: 'Tests', state: 'passed' },
  { step: 'Deploy', state: 'running' },
]

// Shared bento card surface for the hero: fine border, translucent fill, no shadow.
const CARD = 'rounded-3xl border border-line/70 bg-surface/60 backdrop-blur-xl'

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
        .fromTo('[data-hero="text"]', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.1 })
        .fromTo(
          '[data-hero="visual"]',
          { opacity: 0, y: 28, scale: 0.98 },
          { opacity: 1, y: 0, scale: 1, duration: 0.9 },
          0.15,
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
      className="relative isolate overflow-hidden pb-16 pt-24 sm:pb-24 sm:pt-28 lg:min-h-[100svh] lg:pb-20 lg:pt-28"
    >

      {/* Bento: intro (large), illustration (tall), roles and highlights. */}
      <div className="shell grid gap-4 md:grid-cols-2 lg:grid-cols-12 lg:gap-5">
        {/* Intro */}
        <div data-hero="text" className={`${CARD} flex flex-col justify-center p-6 sm:p-10 md:col-span-2 lg:col-span-7 lg:row-span-2`}>
          <p className="eyebrow">
            Full-Stack Developer <span aria-hidden="true">·</span> First-Principles Thinker
          </p>
          <h1
            id="hero-title"
            className="mt-5 text-[clamp(2.25rem,1.35rem+3.1vw,4.25rem)] font-semibold leading-[1.04] tracking-[-0.035em] text-ink"
          >
            I build scalable software by thinking <span className="text-gradient">from first principles.</span>
          </h1>
          <p className="mt-6 max-w-[36rem] text-[1.0625rem] leading-relaxed text-muted sm:text-lg sm:leading-relaxed">
            Software developer passionate about scalable systems, system design, and building applications from first
            principles. I enjoy solving challenging problems through competitive programming and data structures and
            algorithms.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a href="#projects" className="btn-primary">
              Explore My Work
              <ArrowRight aria-hidden="true" className="h-4 w-4" strokeWidth={2} />
            </a>
            <a href="#contact" className="btn-glass">
              Get in Touch
            </a>
          </div>
        </div>

        {/* Illustration */}
        <div
          data-hero="visual"
          className={`${CARD} relative flex flex-col overflow-hidden p-3 sm:p-5 md:col-span-2 lg:col-span-5 lg:row-span-3`}
        >
          {/* Scene centred in the card. */}
          <div className="flex flex-1 items-center justify-center">
            <div className="relative mx-auto aspect-[600/540] w-full max-w-[26rem] sm:max-w-[30rem] lg:max-w-none">
              <CodingIllustration className="absolute inset-0 h-full w-full" />

              <div data-hero="chip" aria-hidden="true" className="absolute right-0 top-[2%] hidden sm:block">
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

        {/* Roles */}
        <div data-hero="text" className={`${CARD} flex flex-col p-6 lg:col-span-4`}>
          <p id="hero-roles" className="flex items-center gap-2 text-[0.8125rem] font-medium text-muted">
            <BadgeCheck aria-hidden="true" className="h-4 w-4 text-accent" strokeWidth={1.75} />
            Interested Roles
          </p>
          {/* One role per row, spread evenly down the card (matches the Highlights card). */}
          <ul aria-labelledby="hero-roles" className="mt-3 flex flex-1 flex-col justify-between">
            {heroRoles.map((role) => (
              <li
                key={role}
                className="group flex items-center gap-3 py-2.5 text-[0.9375rem] font-medium text-ink/85 transition-colors duration-200 last:pb-0 hover:text-ink"
              >
                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 flex-none rounded-full bg-accent/70 transition-colors duration-200 group-hover:bg-accent"
                />
                {role}
              </li>
            ))}
          </ul>
        </div>

        {/* Highlights */}
        <div data-hero="text" className={`${CARD} flex flex-col p-6 lg:col-span-3`}>
          <p className="flex items-center gap-2 text-[0.8125rem] font-medium text-muted">
            <Sparkles aria-hidden="true" className="h-4 w-4 text-accent" strokeWidth={1.75} />
            Highlights
          </p>
          {/* One full-width row per stat: value, label and a short description, spread evenly down the card. */}
          <dl className="mt-3 flex flex-1 flex-col justify-between">
            {heroStats.map((stat) => (
              <div key={stat.label} className="flex items-baseline gap-4 py-3 last:pb-0">
                <dt className="order-2 min-w-0 text-[0.8125rem] leading-snug text-muted">
                  <span className="font-medium text-ink/85">{stat.label}</span>
                  <span className="block">{stat.detail}</span>
                </dt>
                <dd className="order-1 w-[4.75rem] flex-none text-[1.25rem] font-semibold leading-none tracking-tight text-ink">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
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
