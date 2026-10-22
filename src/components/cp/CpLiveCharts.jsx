import { useLayoutEffect, useRef, useState } from 'react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { gsap, prefersReducedMotion } from '../../lib/motion'
import { useChartTheme } from './chartTheme'

const monthYear = new Intl.DateTimeFormat('en', { month: 'short', year: '2-digit' })
const fullDate = new Intl.DateTimeFormat('en', { day: 'numeric', month: 'short', year: 'numeric' })

function RatingTooltip({ active, payload, color }) {
  if (!active || !payload?.length) return null
  const point = payload[0].payload
  return (
    <div className="glass max-w-[15rem] rounded-[10px] px-3 py-2 shadow-lift">
      <p className="truncate text-[0.75rem] font-medium text-muted">{point.contest}</p>
      <p className="mt-0.5 flex items-baseline gap-1.5 text-[1rem] font-semibold tracking-tight text-ink">
        <span className="h-2 w-2 self-center rounded-full" style={{ backgroundColor: color }} />
        {point.rating}
        <span className="text-[0.75rem] font-normal text-muted">{fullDate.format(point.date)}</span>
      </p>
    </div>
  )
}

function ContestsTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const { platform, contests } = payload[0].payload
  return (
    <div className="glass rounded-[10px] px-3 py-2 text-[0.8125rem] shadow-lift">
      <span className="font-semibold text-ink">{contests}</span> <span className="text-muted">rated contests on {platform}</span>
    </div>
  )
}

/**
 * Live competitive-programming charts: rating history per platform (switchable)
 * and contests attended across platforms. `platforms` comes from /api/cp-stats.
 */
export default function CpLiveCharts({ platforms }) {
  const colors = useChartTheme()
  const animate = !prefersReducedMotion()
  const available = platforms.filter((p) => !p.error && p.history?.length)
  const [selected, setSelected] = useState(available[0]?.platform)
  const segmentRef = useRef(null)
  const pillRef = useRef(null)
  const current = available.find((p) => p.platform === selected) ?? available[0]

  // Slide the segmented control's highlight to the selected platform.
  useLayoutEffect(() => {
    const button = segmentRef.current?.querySelector(`[data-platform="${current?.platform}"]`)
    const pill = pillRef.current
    if (!button || !pill) return
    const vars = { x: button.offsetLeft, width: button.offsetWidth, opacity: 1 }
    if (!animate || Number(gsap.getProperty(pill, 'opacity')) === 0) gsap.set(pill, vars)
    else gsap.to(pill, { ...vars, duration: 0.35, ease: 'power3.out', overwrite: true })
  }, [current?.platform, animate])

  if (!current) return null

  const color = colors.platforms[current.platform]
  const ratings = current.history.map((point) => point.rating)
  const min = Math.min(...ratings)
  const max = Math.max(...ratings)
  const pad = Math.max(50, Math.round((max - min) * 0.15))
  const domain = [Math.max(0, Math.floor((min - pad) / 100) * 100), Math.ceil((max + pad) / 100) * 100]
  const contestsData = available.map(({ platform, contests }) => ({ platform, contests }))
  const tick = { fill: colors.muted, fontSize: 11 }
  const gradientId = `cp-area-${current.platform}`

  return (
    <div>
      {/* Platform switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-[0.9375rem] font-semibold tracking-tight text-ink">Rating history</p>
        <div
          ref={segmentRef}
          role="group"
          aria-label="Choose platform"
          className="relative flex gap-0.5 rounded-[10px] bg-ink/[0.05] p-1"
        >
          <span ref={pillRef} aria-hidden="true" className="absolute left-0 top-1 h-[calc(100%-0.5rem)] rounded-[7px] bg-surface opacity-0 shadow-soft" />
          {available.map((p) => (
            <button
              key={p.platform}
              type="button"
              data-platform={p.platform}
              aria-pressed={p.platform === current.platform}
              onClick={() => setSelected(p.platform)}
              className={`relative rounded-[7px] px-3 py-1 text-[0.8125rem] font-medium transition-colors duration-200 ${
                p.platform === current.platform ? 'text-ink' : 'text-muted hover:text-ink'
              }`}
            >
              {p.platform}
            </button>
          ))}
        </div>
      </div>

      {/* Rating history */}
      <div className="mt-5 h-[240px] w-full" aria-hidden="true">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart accessibilityLayer={false} key={current.platform} data={current.history} margin={{ top: 8, right: 8, bottom: 0, left: -8 }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.28} />
                <stop offset="100%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke={colors.grid} />
            <XAxis
              dataKey="date"
              type="number"
              scale="time"
              domain={['dataMin', 'dataMax']}
              tickFormatter={(value) => monthYear.format(value)}
              tickLine={false}
              axisLine={false}
              tick={tick}
              tickCount={5}
              minTickGap={24}
              dy={6}
            />
            <YAxis domain={domain} tickLine={false} axisLine={false} tick={tick} width={48} allowDecimals={false} />
            <Tooltip
              cursor={{ stroke: colors.grid, strokeWidth: 1 }}
              content={<RatingTooltip color={color} />}
              isAnimationActive={false}
            />
            <Area
              type="monotone"
              dataKey="rating"
              stroke={color}
              strokeWidth={2.25}
              fill={`url(#${gradientId})`}
              dot={{ r: 2.5, fill: color, strokeWidth: 0 }}
              activeDot={{ r: 5, fill: color, stroke: colors.surface, strokeWidth: 2 }}
              isAnimationActive={animate}
              animationDuration={800}
              animationEasing="ease-out"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Contests + selected platform stats */}
      <div className="mt-6 grid gap-6 pt-6 sm:grid-cols-[1.4fr_1fr]">
        <div>
          <p className="text-[0.8125rem] font-medium text-muted">Rated contests by platform</p>
          <div className="mt-3 h-[120px] w-full" aria-hidden="true">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart accessibilityLayer={false} data={contestsData} layout="vertical" margin={{ top: 0, right: 32, bottom: 0, left: 0 }} barCategoryGap="28%">
                <XAxis type="number" hide domain={[0, 'dataMax']} />
                <YAxis type="category" dataKey="platform" tickLine={false} axisLine={false} tick={{ ...tick, fill: colors.ink }} width={84} />
                <Tooltip cursor={{ fill: colors.cursor }} content={<ContestsTooltip />} isAnimationActive={false} />
                <Bar dataKey="contests" radius={[3, 6, 6, 3]} maxBarSize={18} isAnimationActive={animate} animationDuration={700} animationEasing="ease-out">
                  {contestsData.map((entry) => (
                    <Cell key={entry.platform} fill={colors.platforms[entry.platform]} />
                  ))}
                  <LabelList dataKey="contests" position="right" offset={8} fill={colors.ink} fontSize={12} fontWeight={600} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <dl className="grid grid-cols-3 gap-3 sm:grid-cols-1 sm:gap-4">
          {[
            ['Current rating', current.currentRating],
            ['Peak rating', current.maxRating],
            ['Rated contests', current.contests],
          ].map(([label, value]) => (
            <div key={label} className="flex flex-col-reverse">
              <dt className="mt-0.5 text-[0.75rem] text-muted">{label}</dt>
              <dd className="text-[1.25rem] font-semibold leading-none tracking-tight text-ink">{value ?? '—'}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  )
}
