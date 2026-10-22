import { Suspense, lazy, useEffect, useRef, useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import SectionHeading from '../ui/SectionHeading'
import TechIcon from '../skills/TechIcon'
import { cpHighlights, cpPlatforms, cpSummary } from '../../data/profile'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { fetchCodeforces } from '../../lib/codeforces'

// Recharts is loaded only when the chart approaches the viewport, keeping it out of the initial bundle.
const CpRatingsChart = lazy(() => import('../cp/CpRatingsChart'))
const CpLiveCharts = lazy(() => import('../cp/CpLiveCharts'))

const chartData = cpPlatforms.map(({ platform, rating }) => ({ platform, rating }))
const SKELETON_HEIGHT = 'h-[420px]'

function ProfileCard({ item }) {
  return (
    <article className="group flex h-full flex-col rounded-2xl border border-line/70 bg-surface/70 p-6 shadow-soft backdrop-blur-xl transition duration-300 ease-apple hover:-translate-y-0.5 hover:border-ink/20 hover:shadow-lift motion-reduce:hover:translate-y-0">
      <div className="flex items-center gap-3.5">
        <TechIcon
          icon={item.icon}
          className="h-11 w-11 transition-transform duration-300 ease-apple group-hover:-rotate-3 group-hover:scale-[1.04] motion-reduce:group-hover:transform-none"
        />
        <div className="min-w-0">
          <h4 className="text-[1.0625rem] font-semibold tracking-tight text-ink">{item.platform}</h4>
          <p className="truncate font-mono text-[0.75rem] text-muted">@{item.handle}</p>
        </div>
      </div>
      <p className="mt-4 text-[0.9375rem] leading-relaxed text-muted">{item.description}</p>
      <p className="mt-3 text-[0.875rem] font-medium text-ink/85">{item.detail}</p>
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`View Profile: ${item.platform} @${item.handle} (opens in a new tab)`}
        className="btn-secondary mt-6 min-h-[40px] self-start px-4 text-[0.875rem]"
      >
        View Profile
        <ArrowUpRight
          aria-hidden="true"
          className="h-4 w-4 transition-transform duration-300 ease-apple group-hover:-translate-y-px group-hover:translate-x-px"
          strokeWidth={2}
        />
      </a>
    </article>
  )
}

export default function CompetitiveProgramming() {
  const scope = useRef(null)
  const chartSlot = useRef(null)
  const [showChart, setShowChart] = useState(false)
  const [stats, setStats] = useState(null) // null: loading; { platforms } or { error: true }
  useScrollReveal(scope)

  // Mount the chart once it nears the viewport so its bar animation is actually seen.
  useEffect(() => {
    const slot = chartSlot.current
    if (!slot) return undefined
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShowChart(true)
          observer.disconnect()
        }
      },
      { rootMargin: '0px 0px -15% 0px' },
    )
    observer.observe(slot)
    return () => observer.disconnect()
  }, [])

  // Live stats (/api/cp-stats) are requested once the chart nears the viewport.
  useEffect(() => {
    if (!showChart) return undefined
    const controller = new AbortController()
    const { signal } = controller
    const load = async () => {
      let platforms = []
      try {
        const response = await fetch('/api/cp-stats', { signal })
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        const data = await response.json()
        platforms = Array.isArray(data?.platforms) ? data.platforms : []
      } catch (error) {
        if (error?.name === 'AbortError') return
      }
      // Codeforces missing from the server response: fetch it from the browser instead.
      const hasCodeforces = platforms.some((p) => p.platform === 'Codeforces' && !p.error && p.history?.length)
      if (!hasCodeforces) {
        try {
          const codeforces = await fetchCodeforces(signal)
          platforms = [...platforms.filter((p) => p.platform !== 'Codeforces'), codeforces]
        } catch (error) {
          if (error?.name === 'AbortError') return
        }
      }
      setStats(platforms.length ? { platforms } : { error: true })
    }
    load()
    return () => controller.abort()
  }, [showChart])

  const live = stats?.platforms?.filter((p) => !p.error && p.history?.length) ?? []
  const hasLive = live.length > 0
  const peak = hasLive ? live.reduce((best, p) => (p.maxRating > best.maxRating ? p : best)) : null
  const summary = hasLive
    ? [
        cpSummary[0],
        { value: String(live.reduce((sum, p) => sum + (p.contests || 0), 0)), label: 'Rated contests across platforms' },
        { value: String(peak.maxRating), label: `Peak ${peak.platform} rating` },
      ]
    : cpSummary

  const skeleton = <div className={`${SKELETON_HEIGHT} w-full animate-pulse rounded-2xl bg-ink/[0.04] motion-reduce:animate-none`} />
  let chart = skeleton
  if (showChart && hasLive) chart = <CpLiveCharts platforms={stats.platforms} />
  else if (showChart && stats && !hasLive) chart = <CpRatingsChart data={chartData} />

  return (
    <section
      id="problem-solving"
      ref={scope}
      aria-labelledby="cp-title"
      className="section-pad bg-elevated/40"
    >
      <div className="shell">
        <SectionHeading
          id="cp-title"
          eyebrow="Problem solving"
          title="Practice that sharpens every line I write."
          intro="Contests train me to reason about complexity, read problems precisely and stay calm under a clock."
        />

        {/* Profiles */}
        <h3 className="sr-only">Coding profiles</h3>
        <ul className="mt-16 grid gap-4 md:grid-cols-3">
          {cpPlatforms.map((item) => (
            <li key={item.platform} data-reveal>
              <ProfileCard item={item} />
            </li>
          ))}
        </ul>

        {/* Chart */}
        <div className="mt-24 grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-4">
            <h3 className="text-headline text-ink" data-reveal>
              The numbers behind the practice
            </h3>
            <p className="mt-4 leading-relaxed text-muted" data-reveal="soft">
              Competitive programming helps me develop algorithmic thinking, evaluate complexity, and improve through
              consistent practice.
            </p>
            <dl className="mt-8 grid grid-cols-3 gap-4 pt-6 lg:grid-cols-1 lg:gap-5" data-reveal="soft">
              {summary.map((item) => (
                <div key={item.label} className="flex flex-col-reverse">
                  <dt className="mt-1 text-[0.8125rem] leading-snug text-muted">{item.label}</dt>
                  <dd className="text-[1.375rem] font-semibold leading-none tracking-tight text-ink">{item.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <figure
            className="rounded-3xl border border-line/70 bg-surface/70 p-5 shadow-soft backdrop-blur-xl sm:p-7 lg:col-span-8"
            data-reveal
          >
            <figcaption className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <span className="text-[1rem] font-semibold tracking-tight text-ink">
                {hasLive || !stats ? 'Contest performance' : 'Peak rating by platform'}
              </span>
              {hasLive && (
                <span className="inline-flex items-center gap-1.5 font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-muted">
                  <span className="h-1.5 w-1.5 rounded-full bg-success" />
                  Live
                </span>
              )}
            </figcaption>
            <div ref={chartSlot} className="mt-6">
              <Suspense fallback={skeleton}>{chart}</Suspense>
            </div>
            <p className="mt-5 pt-4 text-[0.8125rem] leading-relaxed text-muted">
              {hasLive ? (
                <>
                  {live.map((p) => `${p.platform}: ${p.contests} rated contests, current ${p.currentRating}, peak ${p.maxRating}.`).join(' ')}{' '}
                  Fetched from each platform&apos;s public profile and refreshed hourly. Each platform uses its own rating
                  system, so ratings are not directly comparable.
                </>
              ) : stats ? (
                <>
                  Live stats couldn&apos;t be loaded right now. Peak ratings from my résumé: LeetCode {cpPlatforms[0].rating},
                  CodeChef {cpPlatforms[1].rating}, Codeforces {cpPlatforms[2].rating}.
                </>
              ) : (
                'Loading contest history from LeetCode, CodeChef and Codeforces…'
              )}
            </p>
          </figure>
        </div>

        {/* Highlights */}
        <ul className="mt-24 grid gap-x-12 sm:grid-cols-2">
          {cpHighlights.map((item) => (
            <li key={item.title} className="py-7" data-reveal="soft">
              <h3 className="text-[1.125rem] tracking-tight text-ink">{item.title}</h3>
              <p className="mt-2 max-w-prose text-[0.9375rem] leading-relaxed text-muted">{item.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
