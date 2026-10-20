import {
  CalendarDays,
  CircleCheck,
  Clock,
  Play,
  ScanFace,
  ShoppingBag,
  Swords,
  Trophy,
} from 'lucide-react'

// Decorative previews that sketch each product's core interaction.
// They are aria-hidden: the adjacent text carries the real description.

const surface = 'rounded-2xl border border-line/70 bg-surface shadow-soft'

function CalendarVisual() {
  const offset = 3
  const eventDays = new Set([4, 9, 12, 18, 20])
  const selected = 17
  return (
    <div className="relative h-full w-full p-[7%]">
      <div className={`${surface} h-full p-4 sm:p-5`}>
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-ink">October</span>
          <CalendarDays className="h-4 w-4 text-muted" strokeWidth={1.75} />
        </div>
        <div className="mt-3 grid grid-cols-7 gap-x-1 gap-y-1.5 text-center font-mono text-[0.625rem] text-subtle sm:text-[0.6875rem]">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
            <span key={i}>{d}</span>
          ))}
          {Array.from({ length: offset }).map((_, i) => (
            <span key={`pad-${i}`} />
          ))}
          {Array.from({ length: 21 }, (_, i) => i + 1).map((day) => (
            <span
              key={day}
              className={`relative mx-auto grid h-6 w-6 place-items-center rounded-full text-[0.6875rem] sm:h-8 sm:w-8 ${
                day === selected ? 'bg-[rgb(var(--tint))] font-semibold text-white' : 'text-ink/80'
              }`}
            >
              {day}
              {eventDays.has(day) && day !== selected && (
                <span className="absolute bottom-[8%] h-1 w-1 rounded-full bg-[rgb(var(--tint))]" />
              )}
            </span>
          ))}
        </div>
      </div>
      <div className={`${surface} absolute bottom-[4%] right-[4%] w-[58%] p-3 sm:p-4`}>
        <p className="font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted">Oct 17 · Club event</p>
        <p className="mt-1 text-[0.8125rem] font-semibold text-ink">Workshop registration</p>
        <div className="mt-2.5 flex items-center justify-between">
          <div className="flex -space-x-1.5">
            {[0.9, 0.65, 0.4].map((o) => (
              <span
                key={o}
                className="h-5 w-5 rounded-full border-2 border-surface"
                style={{ backgroundColor: `rgb(var(--tint) / ${o})` }}
              />
            ))}
          </div>
          <span className="inline-flex items-center gap-1 text-[0.6875rem] font-medium text-success">
            <CircleCheck className="h-3.5 w-3.5" strokeWidth={2} />
            Enrolled
          </span>
        </div>
      </div>
    </div>
  )
}

function BattleVisual() {
  const player = (name, status, solved) => (
    <div className={`${surface} flex flex-1 flex-col items-center px-3 py-4 text-center sm:py-5`}>
      <span
        className="grid h-10 w-10 place-items-center rounded-full font-mono text-xs font-semibold text-white sm:h-12 sm:w-12"
        style={{ backgroundColor: `rgb(var(--tint) / ${solved ? 1 : 0.55})` }}
      >
        {name.slice(0, 2).toUpperCase()}
      </span>
      <span className="mt-2.5 text-[0.8125rem] font-semibold text-ink">{name}</span>
      <span className={`mt-1 font-mono text-[0.625rem] ${solved ? 'text-success' : 'text-muted'}`}>{status}</span>
    </div>
  )
  return (
    <div className="flex h-full w-full flex-col justify-center gap-4 p-[7%]">
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-surface px-3 py-1 font-mono text-[0.6875rem] text-ink shadow-soft">
          <Clock className="h-3.5 w-3.5 text-[rgb(var(--tint))]" strokeWidth={2} />
          14:32
        </span>
        <span className="font-mono text-[0.6875rem] text-muted">Quick Match · ±200</span>
      </div>
      <div className="flex items-stretch gap-3">
        {player('player_one', 'Accepted', true)}
        <div className="grid place-items-center">
          <Swords className="h-5 w-5 text-[rgb(var(--tint))]" strokeWidth={1.75} />
        </div>
        {player('player_two', 'Attempting', false)}
      </div>
      <div className={`${surface} flex items-center justify-between px-4 py-3`}>
        <div>
          <p className="font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted">Problem</p>
          <p className="text-[0.8125rem] font-semibold text-ink">Codeforces · rating 1400</p>
        </div>
        <Trophy className="h-4 w-4 text-[rgb(var(--tint))]" strokeWidth={1.75} />
      </div>
    </div>
  )
}

function MarketplaceVisual() {
  const shapes = ['rounded-full', 'rounded-t-full', 'rounded-2xl', 'rounded-b-full', 'rounded-full', 'rounded-xl']
  return (
    <div className="flex h-full w-full flex-col gap-3 p-[7%]">
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-1.5">
          {['User', 'Artisan', 'NGO', 'Admin'].map((role, i) => (
            <span
              key={role}
              className={`rounded-full px-2.5 py-0.5 text-[0.6875rem] font-medium ${
                i === 1 ? 'bg-[rgb(var(--tint))] text-white' : 'bg-surface text-muted shadow-soft'
              }`}
            >
              {role}
            </span>
          ))}
        </div>
        <span className="relative grid h-8 w-8 place-items-center rounded-full bg-surface shadow-soft">
          <ShoppingBag className="h-4 w-4 text-ink" strokeWidth={1.75} />
          <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-[rgb(var(--tint))]" />
        </span>
      </div>
      <div className="grid flex-1 grid-cols-3 gap-2.5">
        {shapes.map((shape, i) => (
          <div key={i} className={`${surface} flex flex-col p-2`}>
            <div className="grid flex-1 place-items-center rounded-xl bg-elevated">
              <span
                className={`block h-[45%] w-[45%] ${shape}`}
                style={{ backgroundColor: `rgb(var(--tint) / ${0.35 + (i % 3) * 0.2})` }}
              />
            </div>
            <span className="mt-2 h-1.5 w-3/4 rounded-full bg-ink/15" />
            <span className="mt-1 h-1.5 w-1/3 rounded-full bg-ink/10" />
          </div>
        ))}
      </div>
    </div>
  )
}

function AnalyticsVisual() {
  const labels = ['OS', 'CN', 'DBMS', 'OOP', 'DSA', 'Apt']
  const values = [0.72, 0.55, 0.84, 0.66, 0.9, 0.6]
  const center = 100
  const radius = 70
  const point = (i, scale) => {
    const angle = (Math.PI * 2 * i) / labels.length - Math.PI / 2
    return [center + Math.cos(angle) * radius * scale, center + Math.sin(angle) * radius * scale]
  }
  const ring = (scale) => labels.map((_, i) => point(i, scale).join(',')).join(' ')
  return (
    <div className="flex h-full w-full items-center gap-4 p-[7%]">
      <div className={`${surface} flex h-full flex-1 items-center justify-center p-2`}>
        <svg viewBox="0 0 200 200" className="h-full max-h-[15rem] w-full">
          {[1, 0.66, 0.33].map((s) => (
            <polygon key={s} points={ring(s)} fill="none" style={{ stroke: 'rgb(var(--line))' }} strokeWidth="1" />
          ))}
          {labels.map((_, i) => {
            const [x, y] = point(i, 1)
            return <line key={i} x1={center} y1={center} x2={x} y2={y} style={{ stroke: 'rgb(var(--line))' }} strokeWidth="1" />
          })}
          <polygon
            points={values.map((v, i) => point(i, v).join(',')).join(' ')}
            style={{ fill: 'rgb(var(--tint) / 0.22)', stroke: 'rgb(var(--tint))' }}
            strokeWidth="1.5"
          />
          {labels.map((label, i) => {
            const [x, y] = point(i, 1.2)
            return (
              <text
                key={label}
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="9"
                style={{ fill: 'rgb(var(--muted))' }}
                fontFamily="ui-monospace, monospace"
              >
                {label}
              </text>
            )
          })}
        </svg>
      </div>
      <div className="hidden w-[38%] flex-col gap-3 min-[380px]:flex">
        <div className={`${surface} p-3`}>
          <p className="font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted">Roadmap</p>
          {[0.9, 0.7, 0.5].map((w, i) => (
            <div key={i} className="mt-2 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[rgb(var(--tint))]" />
              <span className="h-1.5 rounded-full bg-ink/15" style={{ width: `${w * 100}%` }} />
            </div>
          ))}
        </div>
        <div className={`${surface} p-3`}>
          <p className="font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted">Trend</p>
          <svg viewBox="0 0 100 36" className="mt-2 h-9 w-full" preserveAspectRatio="none">
            <polyline
              points="0,30 16,26 32,28 48,18 64,20 80,10 100,6"
              fill="none"
              style={{ stroke: 'rgb(var(--tint))' }}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </div>
      </div>
    </div>
  )
}

function EditorVisual() {
  return (
    <div className="flex h-full w-full flex-col p-[7%]">
      <div className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-white/10 bg-[rgb(var(--code-bg))] shadow-lift">
        <div className="flex items-center gap-1.5 border-b border-white/10 px-3 py-2">
          <span className="h-2 w-2 rounded-full bg-[#ff5f57]" />
          <span className="h-2 w-2 rounded-full bg-[#febc2e]" />
          <span className="h-2 w-2 rounded-full bg-[#28c840]" />
          <span className="ml-2 font-mono text-[0.625rem] text-white/50">room / ABX4K2 · main.cpp</span>
        </div>
        <pre className="flex-1 overflow-hidden px-3 py-3 font-mono text-[0.6875rem] leading-[1.7] text-[#abb2bf] sm:text-[0.75rem]">
          <code>
            <span className="text-[#c49bff]">int</span> <span className="text-[#61afef]">main</span>() {'{'}
            {'\n'}
            {'  '}
            <span className="text-[#c49bff]">int</span> n; cin {'>>'} n;
            <span className="relative">
              <span className="absolute -top-0.5 left-0.5 inline-block h-[1.1em] w-[2px] bg-[#56d4e0]" />
              <span className="absolute -top-4 left-0.5 whitespace-nowrap rounded bg-[#56d4e0] px-1 font-sans text-[0.5625rem] font-semibold text-black">
                teammate
              </span>
            </span>
            {'\n'}
            {'  '}vector{'<'}
            <span className="text-[#c49bff]">int</span>
            {'>'} a(n);
            {'\n'}
            {'  '}
            <span className="text-[#c49bff]">for</span> (<span className="text-[#c49bff]">auto</span> {'&'}x : a) cin{' '}
            {'>>'} x;
            <span className="relative">
              <span className="absolute -top-0.5 left-0.5 inline-block h-[1.1em] w-[2px] bg-[#e5c07b]" />
            </span>
            {'\n'}
            {'  '}cout {'<<'} <span className="text-[#61afef]">solve</span>(a);
            {'\n'}
            {'}'}
          </code>
        </pre>
      </div>
      <div className={`${surface} mt-3 flex items-center justify-between gap-3 px-4 py-2.5`}>
        <span className="inline-flex items-center gap-2 text-[0.75rem] font-medium text-ink">
          <Play className="h-3.5 w-3.5 text-[rgb(var(--tint))]" strokeWidth={2} />
          Run requested
        </span>
        <span className="flex items-center gap-1.5">
          {[1, 1, 0].map((on, i) => (
            <span key={i} className={`h-2 w-2 rounded-full ${on ? 'bg-success' : 'bg-ink/15'}`} />
          ))}
          <span className="ml-1 font-mono text-[0.6875rem] text-muted">2 / 3 approved</span>
        </span>
      </div>
    </div>
  )
}

function ProctoringVisual() {
  const signals = [
    ['Identity', 'ok'],
    ['Gaze', 'ok'],
    ['Objects', 'flag'],
    ['Voice', 'ok'],
  ]
  return (
    <div className="flex h-full w-full flex-col gap-3 p-[7%]">
      <div className="flex flex-1 gap-3">
        <div className="relative flex-1 overflow-hidden rounded-2xl bg-[rgb(var(--code-bg))]">
          <div className="absolute inset-x-0 bottom-0 mx-auto h-[38%] w-[62%] rounded-t-[45%] bg-white/10" />
          <div className="absolute left-1/2 top-[20%] h-[34%] w-[26%] -translate-x-1/2 rounded-[45%] bg-white/15" />
          <div className="absolute left-1/2 top-[15%] h-[44%] w-[38%] -translate-x-1/2">
            {['left-0 top-0 border-l-2 border-t-2', 'right-0 top-0 border-r-2 border-t-2', 'bottom-0 left-0 border-b-2 border-l-2', 'bottom-0 right-0 border-b-2 border-r-2'].map(
              (pos) => (
                <span key={pos} className={`absolute h-3 w-3 border-[rgb(var(--tint))] ${pos}`} />
              ),
            )}
          </div>
          <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-black/40 px-2 py-0.5 font-mono text-[0.5625rem] text-white/80">
            <span className="h-1.5 w-1.5 rounded-full bg-[#ff5f57]" /> LIVE
          </span>
          <span className="absolute bottom-2 left-2 inline-flex items-center gap-1 rounded-full bg-black/40 px-2 py-0.5 text-[0.5625rem] text-white/85">
            <ScanFace className="h-3 w-3" strokeWidth={2} /> Face verified
          </span>
        </div>
        <ul className={`${surface} hidden w-[38%] flex-col justify-center gap-2.5 p-3 min-[380px]:flex`}>
          {signals.map(([label, state]) => (
            <li key={label} className="flex items-center justify-between text-[0.75rem]">
              <span className="text-ink">{label}</span>
              <span className={`h-2 w-2 rounded-full ${state === 'ok' ? 'bg-success' : 'bg-[#ff9f0a]'}`} />
            </li>
          ))}
        </ul>
      </div>
      <div className={`${surface} px-4 py-3`}>
        <div className="flex items-center justify-between font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted">
          <span>Session timeline</span>
          <span>Review report</span>
        </div>
        <div className="relative mt-2.5 h-1.5 rounded-full bg-ink/10">
          {[18, 46, 71].map((left) => (
            <span
              key={left}
              className="absolute -top-[3px] h-3 w-1.5 rounded-full bg-[rgb(var(--tint))]"
              style={{ left: `${left}%` }}
            />
          ))}
        </div>
        <div className="mt-3 flex gap-1.5">
          {['Valid', 'Suspicious', 'Invalid'].map((verdict, i) => (
            <span
              key={verdict}
              className={`rounded-full px-2 py-0.5 text-[0.625rem] font-medium ${
                i === 1 ? 'bg-[rgb(var(--tint))] text-white' : 'bg-elevated text-muted'
              }`}
            >
              {verdict}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

const VISUALS = {
  calendar: { Component: CalendarVisual, tint: '232 121 0' },
  battle: { Component: BattleVisual, tint: '150 80 220' },
  marketplace: { Component: MarketplaceVisual, tint: '28 140 72' },
  analytics: { Component: AnalyticsVisual, tint: '0 113 227' },
  editor: { Component: EditorVisual, tint: '8 145 178' },
  proctoring: { Component: ProctoringVisual, tint: '88 86 214' },
}

export default function ProjectVisual({ type }) {
  const { Component, tint } = VISUALS[type]
  return (
    <div
      aria-hidden="true"
      className="window aspect-[4/3] w-full"
      style={{ '--tint': tint }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(70% 60% at 85% 10%, rgb(var(--tint) / 0.16), transparent 70%), radial-gradient(60% 50% at 0% 100%, rgb(var(--tint) / 0.08), transparent 70%)',
        }}
      />
      <div className="relative h-full w-full">
        <Component />
      </div>
    </div>
  )
}
