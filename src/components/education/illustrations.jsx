import { gsap } from '../../lib/motion'

// Education bento illustrations. Each renders its final state (used as-is for
// reduced motion) and exposes `scene(root)` returning a paused timeline that
// plays once when the card is on screen. Purely pictorial: no score meters,
// bars or percentages (results appear as text on the cards).

const accent = (alpha = 1) => `rgb(var(--accent) / ${alpha})`
const line = (alpha = 1) => `rgb(var(--line) / ${alpha})`
const surface = 'rgb(var(--surface))'
const once = { paused: true, defaults: { ease: 'power3.out' } }

/* B.Tech at VNR VJIET: a campus building. */

const COLUMNS = [62, 82, 102, 122, 142]

function Campus() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2 px-4" aria-hidden="true">
      <svg viewBox="0 0 200 120" className="h-[70%] max-h-36 w-full">
        <g data-building>
          {/* Roof */}
          <path d="M44 46 L100 16 L156 46 Z" strokeWidth="1.5" strokeLinejoin="round" style={{ fill: accent(0.14), stroke: accent(0.8) }} />
          <rect x="44" y="46" width="112" height="7" rx="1.5" strokeWidth="1.5" style={{ fill: surface, stroke: accent(0.8) }} />
          <circle cx="100" cy="34" r="5" strokeWidth="1.5" style={{ fill: surface, stroke: accent(0.8) }} />
          {/* Columns */}
          {COLUMNS.map((x) => (
            <rect key={x} data-column x={x - 4} y="56" width="8" height="38" rx="1.5" strokeWidth="1.25" style={{ fill: surface, stroke: line(1) }} />
          ))}
          {/* Steps */}
          <rect x="40" y="94" width="120" height="6" rx="1.5" strokeWidth="1.25" style={{ fill: surface, stroke: line(1) }} />
          <rect x="32" y="100" width="136" height="6" rx="1.5" strokeWidth="1.25" style={{ fill: surface, stroke: line(1) }} />
        </g>
        {/* Flag */}
        <line x1="100" y1="16" x2="100" y2="2" strokeWidth="1.25" style={{ stroke: line(1) }} />
        <path data-flag d="M100 2 L114 6 L100 10 Z" style={{ fill: accent(0.9) }} />
      </svg>
      <p className="font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted">B.Tech · Computer Science</p>
    </div>
  )
}

Campus.scene = (root) =>
  gsap
    .timeline(once)
    .from(root.querySelector('[data-building]'), { opacity: 0, y: 10, duration: 0.6 })
    .from(root.querySelectorAll('[data-column]'), { scaleY: 0, transformOrigin: '50% 100%', duration: 0.45, stagger: 0.06 }, '-=0.35')
    .from(root.querySelector('[data-flag]'), { scaleX: 0, transformOrigin: '0% 50%', duration: 0.4, ease: 'back.out(2)' }, '-=0.1')

/* Intermediate (MPC): one tile per subject. */

const SUBJECTS = [
  { label: 'Mathematics', glyph: '∫ f(x) dx' },
  { label: 'Physics', glyph: 'F = ma' },
  { label: 'Chemistry', glyph: 'H₂O' },
]

function Mpc() {
  return (
    <div className="flex h-full items-center justify-center gap-2.5 px-4" aria-hidden="true">
      {SUBJECTS.map((subject, i) => (
        <div
          key={subject.label}
          data-tile
          className={`flex w-[30%] max-w-[6.5rem] flex-col items-center rounded-xl border border-line/80 bg-surface px-2 py-3 text-center shadow-soft ${
            i === 1 ? '-translate-y-2' : ''
          }`}
        >
          <span className="font-mono text-[0.8125rem] font-semibold text-accent">{subject.glyph}</span>
          <span className="mt-1.5 text-[0.625rem] text-muted">{subject.label}</span>
        </div>
      ))}
    </div>
  )
}

Mpc.scene = (root) =>
  gsap.timeline(once).from(root.querySelectorAll('[data-tile]'), { opacity: 0, y: 12, duration: 0.5, stagger: 0.1 })

/* High school: an open book. */

function Book() {
  return (
    <div className="flex h-full items-center justify-center px-4" aria-hidden="true">
      <svg viewBox="0 0 200 120" className="h-[72%] max-h-36 w-full">
        <path d="M100 30 C80 20 54 18 34 22 L34 98 C54 94 80 96 100 106 Z" strokeWidth="1.5" strokeLinejoin="round" style={{ fill: surface, stroke: line(1) }} />
        <path d="M100 30 C120 20 146 18 166 22 L166 98 C146 94 120 96 100 106 Z" strokeWidth="1.5" strokeLinejoin="round" style={{ fill: surface, stroke: line(1) }} />
        <g data-lines>
          {[36, 46, 56, 66, 76].map((y) => (
            <line key={`l${y}`} x1="46" y1={y} x2="88" y2={y + 3} strokeWidth="2" strokeLinecap="round" style={{ stroke: line(0.9) }} />
          ))}
          {[36, 46, 56, 66].map((y) => (
            <line key={`r${y}`} x1="112" y1={y + 3} x2="154" y2={y} strokeWidth="2" strokeLinecap="round" style={{ stroke: line(0.9) }} />
          ))}
        </g>
        <path data-page d="M100 30 C116 24 136 22 150 24 L150 92 C136 90 116 92 100 100 Z" style={{ fill: accent(0.12), stroke: accent(0.6) }} strokeWidth="1.25" />
        <line x1="100" y1="30" x2="100" y2="106" strokeWidth="1.5" style={{ stroke: line(1) }} />
      </svg>
    </div>
  )
}

Book.scene = (root) =>
  gsap
    .timeline(once)
    .from(root.querySelector('[data-page]'), { scaleX: -1, transformOrigin: '0% 50%', duration: 0.8, ease: 'power2.inOut' })
    .from(root.querySelectorAll('[data-lines] line'), { opacity: 0, duration: 0.3, stagger: 0.04 }, '-=0.3')

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

export const EDUCATION_ILLUSTRATIONS = { Campus, Mpc, Book, SmartCoder, DsaCourse }
