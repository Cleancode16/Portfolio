import { gsap } from '../../lib/motion'

// Education bento illustrations. Like the About scenes, each renders its final
// state (used as-is for reduced motion) and exposes `scene(root)` returning a
// paused timeline. These play once per load rather than looping: records, not
// processes. Only real figures are drawn (CGPA, percentages, years).

const accent = (alpha = 1) => `rgb(var(--accent) / ${alpha})`
const line = (alpha = 1) => `rgb(var(--line) / ${alpha})`
const once = { paused: true, defaults: { ease: 'power3.out' } }

/** Counts the element's text up from 0 to its data-count value, keeping its decimals. */
function countUp(timeline, el, duration, position) {
  if (!el) return
  const target = Number(el.dataset.count)
  const decimals = (el.dataset.count.split('.')[1] || '').length
  const counter = { value: 0 }
  el.textContent = (0).toFixed(decimals)
  timeline.to(
    counter,
    { value: target, duration, ease: 'power2.out', onUpdate: () => (el.textContent = counter.value.toFixed(decimals)) },
    position,
  )
}

/* B.Tech: CGPA ring plus progress through the degree (computed from today's date). */

const RING_R = 44
const RING_C = 2 * Math.PI * RING_R
const DEGREE_START = new Date(2023, 8, 1).getTime() // Sep 2023
const DEGREE_END = new Date(2027, 4, 31).getTime() // May 2027
const DEGREE_PROGRESS = Math.min(1, Math.max(0, (Date.now() - DEGREE_START) / (DEGREE_END - DEGREE_START)))
const YEARS = ['2023', '2024', '2025', '2026', '2027']

function Degree() {
  return (
    <div className="flex h-full items-center gap-5 px-5 sm:gap-8 sm:px-8" aria-hidden="true">
      <div className="relative h-[120px] w-[120px] flex-none">
        <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
          <circle cx="60" cy="60" r={RING_R} fill="none" strokeWidth="8" style={{ stroke: line(0.8) }} />
          <circle
            data-ring
            cx="60"
            cy="60"
            r={RING_R}
            fill="none"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={RING_C}
            strokeDashoffset={RING_C * (1 - 0.897)}
            style={{ stroke: accent(1) }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span data-count="8.97" className="text-[1.625rem] font-semibold leading-none tracking-tight text-ink">
            8.97
          </span>
          <span className="mt-1 font-mono text-[0.625rem] text-muted">CGPA / 10</span>
        </div>
      </div>

      <div className="min-w-0 flex-1">
        <p className="font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted">B.Tech · CSE</p>
        <div className="relative mt-4 h-1.5 rounded-full bg-ink/10">
          <span
            data-track
            className="absolute inset-y-0 left-0 origin-left rounded-full bg-accent"
            style={{ width: `${DEGREE_PROGRESS * 100}%` }}
          />
          <span
            data-now
            className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-canvas bg-accent"
            style={{ left: `${DEGREE_PROGRESS * 100}%` }}
          />
        </div>
        <div className="mt-2.5 flex justify-between font-mono text-[0.625rem] text-muted">
          {YEARS.map((year, i) => (
            <span key={year} className={i % 2 === 1 ? 'hidden min-[420px]:inline' : ''}>
              {year}
            </span>
          ))}
        </div>
        <p className="mt-4 text-[0.75rem] text-ink/80">
          {DEGREE_PROGRESS >= 1 ? 'Completed' : 'In progress · graduating May 2027'}
        </p>
      </div>
    </div>
  )
}

Degree.scene = (root) => {
  const tl = gsap.timeline(once)
  tl.fromTo(root.querySelector('[data-ring]'), { strokeDashoffset: RING_C }, { strokeDashoffset: RING_C * (1 - 0.897), duration: 1.2 }, 0)
  countUp(tl, root.querySelector('[data-count]'), 1.2, 0)
  tl.from(root.querySelector('[data-track]'), { scaleX: 0, duration: 0.9 }, 0.2)
  tl.from(root.querySelector('[data-now]'), { scale: 0, duration: 0.4, ease: 'back.out(2)' }, 0.95)
  return tl
}

/* Intermediate: 97.7% with the three MPC subjects. */

function Intermediate() {
  return (
    <div className="flex h-full flex-col justify-center px-5 sm:px-6" aria-hidden="true">
      <p className="flex items-baseline gap-1">
        <span data-count="97.7" className="text-[2.25rem] font-semibold leading-none tracking-tight text-ink">
          97.7
        </span>
        <span className="text-[1.125rem] font-semibold text-muted">%</span>
      </p>
      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-ink/10">
        <span data-bar className="block h-full origin-left rounded-full bg-accent" style={{ width: '97.7%' }} />
      </div>
      <ul className="mt-4 flex flex-wrap gap-1.5">
        {['Mathematics', 'Physics', 'Chemistry'].map((subject) => (
          <li key={subject} data-subject className="mono-chip">
            {subject}
          </li>
        ))}
      </ul>
    </div>
  )
}

Intermediate.scene = (root) => {
  const tl = gsap.timeline(once)
  countUp(tl, root.querySelector('[data-count]'), 1.1, 0)
  tl.from(root.querySelector('[data-bar]'), { scaleX: 0, duration: 1.1, ease: 'power2.out' }, 0)
  tl.from(root.querySelectorAll('[data-subject]'), { opacity: 0, y: 6, duration: 0.4, stagger: 0.08 }, 0.5)
  return tl
}

/* High school: CGPA 10 / 10 as ten filled points. */

function HighSchool() {
  return (
    <div className="flex h-full flex-col items-center justify-center" aria-hidden="true">
      <p className="text-[2.25rem] font-semibold leading-none tracking-tight text-ink">
        10<span className="text-[1.125rem] text-muted"> / 10</span>
      </p>
      <div className="mt-5 grid grid-cols-5 gap-2.5">
        {Array.from({ length: 10 }, (_, i) => (
          <span key={i} data-dot className="h-3 w-3 rounded-full bg-accent" />
        ))}
      </div>
      <p className="mt-4 font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted">CGPA</p>
    </div>
  )
}

HighSchool.scene = (root) =>
  gsap
    .timeline(once)
    .from(root.querySelectorAll('[data-dot]'), { scale: 0, opacity: 0, duration: 0.35, stagger: 0.06, ease: 'back.out(2)' })

/* Smart Coder: a certificate with a seal. */

function SmartCoder() {
  return (
    <div className="flex h-full items-center justify-center px-5" aria-hidden="true">
      <div
        data-paper
        className="relative w-full max-w-[15rem] rounded-xl border border-line/80 bg-surface px-5 pb-5 pt-4 shadow-lift"
      >
        <p className="font-mono text-[0.5625rem] uppercase tracking-[0.16em] text-muted">Certificate</p>
        <p className="mt-1.5 text-[0.875rem] font-semibold tracking-tight text-ink">Smart Coder</p>
        <span className="mt-3 block h-1 w-[70%] rounded-full bg-ink/15" />
        <span className="mt-1.5 block h-1 w-[50%] rounded-full bg-ink/10" />
        <p className="mt-4 font-mono text-[0.625rem] text-muted">Smart Interviews · 2025</p>
        <span
          data-seal
          className="absolute -bottom-3 right-4 grid h-11 w-11 place-items-center rounded-full border-2 border-surface text-white"
          style={{ background: 'radial-gradient(circle at 35% 30%, rgb(var(--accent) / 0.85), rgb(var(--cta)))' }}
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12.5 L10 17 L19 7.5" />
          </svg>
        </span>
      </div>
    </div>
  )
}

SmartCoder.scene = (root) =>
  gsap
    .timeline(once)
    .from(root.querySelector('[data-paper]'), { opacity: 0, y: 14, duration: 0.6 })
    .from(root.querySelector('[data-seal]'), { scale: 1.6, opacity: 0, rotation: -25, duration: 0.45, ease: 'back.out(1.6)' }, '-=0.1')

/* DSA course: a binary tree with an in-order traversal highlight. */

const NODES = [
  { id: 0, x: 120, y: 26 },
  { id: 1, x: 70, y: 70 },
  { id: 2, x: 170, y: 70 },
  { id: 3, x: 44, y: 114 },
  { id: 4, x: 96, y: 114 },
  { id: 5, x: 144, y: 114 },
  { id: 6, x: 196, y: 114 },
]
const EDGES = [
  [0, 1],
  [0, 2],
  [1, 3],
  [1, 4],
  [2, 5],
  [2, 6],
]
const IN_ORDER = [3, 1, 4, 0, 5, 2, 6]

function DsaCourse() {
  return (
    <div className="flex h-full flex-col items-center justify-center" aria-hidden="true">
      <svg viewBox="0 0 240 140" className="h-[72%] w-full max-w-[17rem]">
        {EDGES.map(([a, b]) => (
          <line
            key={`${a}-${b}`}
            x1={NODES[a].x}
            y1={NODES[a].y}
            x2={NODES[b].x}
            y2={NODES[b].y}
            strokeWidth="1.25"
            style={{ stroke: line(1) }}
          />
        ))}
        <circle data-cursor cx={NODES[6].x} cy={NODES[6].y} r="15" style={{ fill: accent(0.18) }} />
        {NODES.map((node) => (
          <circle
            key={node.id}
            cx={node.x}
            cy={node.y}
            r="10"
            strokeWidth="1.25"
            style={{ fill: 'rgb(var(--surface))', stroke: accent(0.7) }}
          />
        ))}
      </svg>
      <p className="font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted">In-order traversal · C / C++</p>
    </div>
  )
}

DsaCourse.scene = (root) => {
  const cursor = root.querySelector('[data-cursor]')
  const tl = gsap.timeline(once)
  const start = NODES[IN_ORDER[0]]
  const end = NODES[6]
  // Cursor is drawn at the last node; offsets move it relative to there.
  tl.set(cursor, { x: start.x - end.x, y: start.y - end.y })
  IN_ORDER.slice(1).forEach((id) => {
    tl.to(cursor, { x: NODES[id].x - end.x, y: NODES[id].y - end.y, duration: 0.32, ease: 'power2.inOut' }, '+=0.12')
  })
  return tl
}

export const EDUCATION_ILLUSTRATIONS = { Degree, Intermediate, HighSchool, SmartCoder, DsaCourse }
