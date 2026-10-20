import { AppWindow, Database, Server } from 'lucide-react'
import { gsap } from '../../lib/motion'

// Each illustration renders its *final* state, so reduced-motion visitors see a
// complete scene. Its `scene(root)` builds a paused, looping GSAP timeline that
// animates from a starting state; BentoCard plays it only while the card is on
// screen. Colors come from theme tokens through `style` (CSS variables are not
// reliable inside SVG presentation attributes).

const ink = (alpha = 1) => `rgb(var(--ink) / ${alpha})`
const accent = (alpha = 1) => `rgb(var(--accent) / ${alpha})`
const line = (alpha = 1) => `rgb(var(--line) / ${alpha})`
const muted = 'rgb(var(--muted))'
const surface = 'rgb(var(--surface))'
const mono = 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace'

const loop = { paused: true, repeat: -1, repeatDelay: 2.6, defaults: { ease: 'power3.out' } }

/* 1. First principles: scattered pieces settle into fundamentals, then form a solution. */

const SQUARES = [0, 1, 2, 3, 4, 5].map((i) => ({ x: 34 + (i % 2) * 28, y: 46 + Math.floor(i / 2) * 28 }))
const SCATTER = [
  [-14, -22, -28],
  [22, -6, 34],
  [-20, 10, 18],
  [26, 18, -40],
  [-8, 26, 52],
  [18, -26, -16],
]

function FirstPrinciples() {
  return (
    <svg viewBox="0 0 320 176" className="h-full w-full" aria-hidden="true">
      {SQUARES.map((sq, i) => (
        <rect
          key={i}
          data-piece
          x={sq.x}
          y={sq.y}
          width="20"
          height="20"
          rx="5"
          style={{ fill: accent(0.14), stroke: accent(0.6) }}
          strokeWidth="1"
        />
      ))}
      <text x="58" y="150" textAnchor="middle" fontSize="9" fontFamily={mono} style={{ fill: muted }}>
        fundamentals
      </text>
      <path
        data-flow
        d="M112 92 C150 92 160 92 196 92"
        fill="none"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeDasharray="90"
        style={{ stroke: accent(0.7) }}
      />
      <path d="M190 87 L197 92 L190 97" fill="none" strokeWidth="1.5" strokeLinecap="round" style={{ stroke: accent(0.7) }} />
      <g data-solution>
        <rect x="204" y="62" width="92" height="60" rx="12" strokeWidth="1" style={{ fill: surface, stroke: line(0.9) }} />
        <circle cx="224" cy="92" r="9" style={{ fill: 'rgb(var(--success) / 0.15)' }} />
        <path
          d="M220 92 L223 95 L229 88"
          fill="none"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ stroke: 'rgb(var(--success))' }}
        />
        <rect x="240" y="84" width="42" height="5" rx="2.5" style={{ fill: ink(0.6) }} />
        <rect x="240" y="95" width="28" height="5" rx="2.5" style={{ fill: ink(0.2) }} />
      </g>
      <text x="250" y="150" textAnchor="middle" fontSize="9" fontFamily={mono} style={{ fill: muted }}>
        simplest solution
      </text>
    </svg>
  )
}

FirstPrinciples.scene = (root) => {
  const pieces = root.querySelectorAll('[data-piece]')
  return gsap
    .timeline({ ...loop, yoyo: true })
    .from(pieces, {
      x: (i) => SCATTER[i][0],
      y: (i) => SCATTER[i][1],
      rotation: (i) => SCATTER[i][2],
      transformOrigin: '50% 50%',
      duration: 1.1,
      stagger: 0.05,
    })
    .from(root.querySelector('[data-flow]'), { strokeDashoffset: 90, duration: 0.6, ease: 'power2.inOut' })
    .from(root.querySelector('[data-solution]'), { opacity: 0, scale: 0.92, transformOrigin: '50% 50%', duration: 0.5 })
}

/* 2. End to end: a request travels from the database through the API to the interface. */

function Layer({ icon: Icon, label, sub }) {
  return (
    <div className="flex w-16 flex-none flex-col items-center text-center">
      <span
        data-node
        className="grid h-11 w-11 place-items-center rounded-xl border border-line/80 bg-surface shadow-soft"
      >
        <Icon aria-hidden="true" className="h-5 w-5 text-accent" strokeWidth={1.75} />
      </span>
      <span className="mt-2 text-[0.6875rem] font-medium text-ink">{label}</span>
      <span className="font-mono text-[0.625rem] text-muted">{sub}</span>
    </div>
  )
}

function Connector() {
  return (
    <div className="relative mx-1 mb-8 h-px flex-1 bg-line">
      <span
        data-packet
        className="absolute -top-[3px] left-1/2 h-[7px] w-[7px] -translate-x-1/2 rounded-full bg-accent"
        style={{ boxShadow: '0 0 0 3px rgb(var(--accent) / 0.15)' }}
      />
    </div>
  )
}

function EndToEnd() {
  return (
    <div className="flex h-full items-center px-3 sm:px-5" aria-hidden="true">
      <Layer icon={Database} label="Database" sub="schema" />
      <Connector />
      <Layer icon={Server} label="API" sub="REST" />
      <Connector />
      <Layer icon={AppWindow} label="Interface" sub="React" />
    </div>
  )
}

EndToEnd.scene = (root) => {
  const packets = root.querySelectorAll('[data-packet]')
  const nodes = root.querySelectorAll('[data-node]')
  const tl = gsap.timeline(loop)
  nodes.forEach((node, i) => {
    tl.fromTo(node, { scale: 1 }, { scale: 1.08, duration: 0.25, yoyo: true, repeat: 1, ease: 'power1.inOut' })
    if (packets[i]) {
      tl.fromTo(
        packets[i],
        { left: '0%', opacity: 0 },
        { left: '100%', opacity: 1, duration: 0.8, ease: 'power1.inOut' },
      ).to(packets[i], { opacity: 0, duration: 0.15 })
    }
  })
  return tl
}

/* 3. Scalable systems: a gateway fans out to services that share a data store. */

const SERVICES = [70, 160, 250]

function ScalableSystems() {
  return (
    <svg viewBox="0 0 320 176" className="h-full w-full" aria-hidden="true">
      {SERVICES.map((x) => (
        <g key={x}>
          <path
            data-link
            d={`M160 40 C160 62 ${x} 58 ${x} 76`}
            fill="none"
            strokeWidth="1.25"
            strokeDasharray="3 6"
            style={{ stroke: accent(0.55) }}
          />
          <path
            data-link
            d={`M${x} 102 C${x} 120 160 116 160 132`}
            fill="none"
            strokeWidth="1.25"
            strokeDasharray="3 6"
            style={{ stroke: line(1) }}
          />
        </g>
      ))}
      <circle cx="160" cy="28" r="12" strokeWidth="1" style={{ fill: accent(0.14), stroke: accent(0.7) }} />
      <circle cx="160" cy="28" r="3.5" style={{ fill: accent(1) }} />
      <text x="182" y="31" fontSize="9" fontFamily={mono} style={{ fill: muted }}>
        gateway
      </text>
      {SERVICES.map((x, i) => (
        <g key={x}>
          <rect
            x={x - 30}
            y="76"
            width="60"
            height="26"
            rx="8"
            strokeWidth="1"
            style={{ fill: surface, stroke: line(0.9) }}
          />
          <rect
            data-service-glow
            x={x - 30}
            y="76"
            width="60"
            height="26"
            rx="8"
            fill="none"
            strokeWidth="1.25"
            style={{ stroke: accent(0.85), opacity: 0 }}
          />
          <circle cx={x - 18} cy="89" r="3" style={{ fill: 'rgb(var(--success))' }} />
          <text x={x - 10} y="92" fontSize="9" fontFamily={mono} style={{ fill: ink(0.75) }}>
            {`svc-${i + 1}`}
          </text>
        </g>
      ))}
      <ellipse cx="160" cy="136" rx="26" ry="6" strokeWidth="1" style={{ fill: surface, stroke: line(0.9) }} />
      <path d="M134 136 L134 152 A26 6 0 0 0 186 152 L186 136" strokeWidth="1" style={{ fill: surface, stroke: line(0.9) }} />
      <text x="196" y="150" fontSize="9" fontFamily={mono} style={{ fill: muted }}>
        store
      </text>
    </svg>
  )
}

ScalableSystems.scene = (root) => {
  const tl = gsap.timeline(loop)
  tl.to(root.querySelectorAll('[data-link]'), { strokeDashoffset: -36, duration: 2.4, ease: 'none' }, 0).fromTo(
    root.querySelectorAll('[data-service-glow]'),
    { opacity: 0 },
    { opacity: 1, duration: 0.3, stagger: 0.25, yoyo: true, repeat: 1 },
    0.3,
  )
  return tl
}

/* 4. Real-time: a change typed in one window appears in the others. */

const PEERS = [
  { color: 'bg-accent', width: '70%' },
  { color: 'bg-success', width: '70%' },
  { color: 'bg-[#ff9f0a]', width: '70%' },
]

function RealTime() {
  return (
    <div className="relative flex h-full items-center justify-center gap-[5%] px-4" aria-hidden="true">
      <div className="absolute left-[12%] right-[12%] top-1/2 h-px bg-line">
        <span
          data-sync
          className="absolute -top-[3px] left-1/2 h-[7px] w-[7px] rounded-full bg-accent"
          style={{ boxShadow: '0 0 0 3px rgb(var(--accent) / 0.15)' }}
        />
      </div>
      {PEERS.map((peer, i) => (
        <div
          key={i}
          className="relative w-[29%] overflow-hidden rounded-lg border border-line/80 bg-surface shadow-soft"
        >
          <div className="flex items-center gap-1 border-b border-line/60 px-2 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-ink/15" />
            <span className="h-1.5 w-1.5 rounded-full bg-ink/15" />
            <span className={`ml-auto h-2.5 w-2.5 rounded-full ${peer.color}`} />
          </div>
          <div className="space-y-1.5 p-2">
            <span className="block h-1 w-[85%] rounded-full bg-ink/15" />
            <span className="block h-1 w-[60%] rounded-full bg-ink/15" />
            <span
              data-typed
              className="block h-1 origin-left rounded-full bg-accent/70"
              style={{ width: peer.width }}
            />
            <span className="block h-1 w-[45%] rounded-full bg-ink/10" />
          </div>
        </div>
      ))}
    </div>
  )
}

RealTime.scene = (root) => {
  const typed = root.querySelectorAll('[data-typed]')
  return gsap
    .timeline(loop)
    .from(typed[0], { scaleX: 0, duration: 0.7, ease: 'steps(7)' })
    .fromTo(
      root.querySelector('[data-sync]'),
      { left: '20%', opacity: 0 },
      { left: '80%', opacity: 1, duration: 0.6, ease: 'power1.inOut' },
    )
    .from([typed[1], typed[2]], { scaleX: 0, duration: 0.3, stagger: 0.08 }, '-=0.25')
    .to(root.querySelector('[data-sync]'), { opacity: 0, duration: 0.2 })
}

/* 5. CP & DSA: stepping through a longest-increasing-subsequence routine. */

const CODE = [
  [['k', 'int'], ['f', ' lis'], ['t', '(vector<'], ['k', 'int'], ['t', '>& a) {']],
  [['t', '  vector<'], ['k', 'int'], ['t', '> d;']],
  [['t', '  '], ['k', 'for'], ['t', ' ('], ['k', 'int'], ['t', ' x : a) {']],
  [['t', '    '], ['k', 'auto'], ['t', ' it = '], ['f', 'lower_bound'], ['t', '(all(d), x);']],
  [['t', '    '], ['k', 'if'], ['t', ' (it == d.end()) d.'], ['f', 'push_back'], ['t', '(x);']],
  [['t', '    '], ['k', 'else'], ['t', ' *it = x;']],
  [['t', '  }']],
  [['t', '  '], ['k', 'return'], ['t', ' d.'], ['f', 'size'], ['t', '();']],
  [['t', '}']],
]
const TOKEN = { k: 'text-[#c49bff]', f: 'text-[#61afef]', t: 'text-[#abb2bf]' }
const LINE_PX = 16

function ProblemSolving() {
  return (
    <div className="absolute inset-3 overflow-hidden rounded-xl border border-white/10 bg-[rgb(var(--code-bg))] shadow-lift" aria-hidden="true">
      <div className="flex items-center gap-1.5 border-b border-white/10 px-3 py-2">
        <span className="h-2 w-2 rounded-full bg-[#ff5f57]" />
        <span className="h-2 w-2 rounded-full bg-[#febc2e]" />
        <span className="h-2 w-2 rounded-full bg-[#28c840]" />
        <span className="ml-2 font-mono text-[0.625rem] text-white/45">lis.cpp</span>
      </div>
      <div className="relative px-3 py-2 font-mono text-[10px]" style={{ lineHeight: `${LINE_PX}px` }}>
        <span
          data-exec
          className="absolute inset-x-0 bg-white/[0.06]"
          style={{ top: 8 + 3 * LINE_PX, height: LINE_PX }}
        />
        {CODE.map((tokens, i) => (
          <div key={i} className="relative whitespace-pre">
            {tokens.map(([kind, text], j) => (
              <span key={j} className={TOKEN[kind]}>
                {text}
              </span>
            ))}
          </div>
        ))}
      </div>
      <span
        data-complexity
        className="glass absolute bottom-2.5 right-2.5 rounded-md px-2 py-0.5 font-mono text-[0.6875rem] font-medium text-accent"
      >
        O(n log n)
      </span>
    </div>
  )
}

ProblemSolving.scene = (root) => {
  const bar = root.querySelector('[data-exec]')
  // Step the highlighted line through the loop body: lines 2 → 5, twice.
  const steps = [2, 3, 4, 5, 3, 4, 5].map((lineIndex) => (lineIndex - 3) * LINE_PX)
  const tl = gsap.timeline(loop)
  steps.forEach((y) => tl.to(bar, { y, duration: 0.18, ease: 'power2.out' }, '+=0.32'))
  tl.to(bar, { y: 0, duration: 0.25 }).fromTo(
    root.querySelector('[data-complexity]'),
    { scale: 1 },
    { scale: 1.08, duration: 0.25, yoyo: true, repeat: 1, ease: 'power1.inOut' },
  )
  return tl
}

/* 6. Build, debug, improve: a failing test, a fix, and a passing run. */

function Badge({ ok, children }) {
  return (
    <span className={`rounded px-1 font-semibold text-black ${ok ? 'bg-[#98c379]' : 'bg-[#ff6b6b]'}`}>{children}</span>
  )
}

function BuildDebug() {
  return (
    <div className="absolute inset-3 overflow-hidden rounded-xl border border-white/10 bg-[rgb(var(--code-bg))] shadow-lift" aria-hidden="true">
      <div className="flex items-center gap-1.5 border-b border-white/10 px-3 py-2">
        <span className="h-2 w-2 rounded-full bg-white/15" />
        <span className="h-2 w-2 rounded-full bg-white/15" />
        <span className="h-2 w-2 rounded-full bg-white/15" />
        <span className="ml-2 font-mono text-[0.625rem] text-white/45">terminal</span>
      </div>
      <div className="space-y-1.5 px-3 py-2.5 font-mono text-[10px] leading-4 text-[#abb2bf]">
        <p data-line>
          <span className="text-[#56d4e0]">$</span> npm test
        </p>
        <p data-line>
          <Badge>FAIL</Badge> api/contact.test.js
        </p>
        <p data-line className="pl-3 text-[#ff8a8a]">✕ rejects an empty message</p>
        <p data-line className="truncate">
          <span className="text-[#56d4e0]">$</span> git commit -m <span className="text-[#98c379]">&quot;fix: validate body&quot;</span>
        </p>
        <p data-line>
          <span className="text-[#56d4e0]">$</span> npm test
        </p>
        <p data-line>
          <Badge ok>PASS</Badge> api/contact.test.js
        </p>
      </div>
    </div>
  )
}

BuildDebug.scene = (root) =>
  gsap
    .timeline(loop)
    .from(root.querySelectorAll('[data-line]'), { opacity: 0, x: -6, duration: 0.3, stagger: 0.42 })

export const ILLUSTRATIONS = {
  firstPrinciples: FirstPrinciples,
  endToEnd: EndToEnd,
  scalable: ScalableSystems,
  realTime: RealTime,
  problemSolving: ProblemSolving,
  buildDebug: BuildDebug,
}
