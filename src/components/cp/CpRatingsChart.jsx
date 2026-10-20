import { Bar, BarChart, CartesianGrid, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { prefersReducedMotion } from '../../lib/motion'
import { useChartTheme } from './chartTheme'

function GlassTooltip({ active, payload, colors }) {
  if (!active || !payload?.length) return null
  const { platform, rating } = payload[0].payload
  return (
    <div className="glass rounded-[10px] px-3 py-2 shadow-lift">
      <p className="flex items-center gap-2 text-[0.75rem] font-medium text-muted">
        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: colors.platforms[platform] }} />
        {platform}
      </p>
      <p className="mt-0.5 text-[1rem] font-semibold tracking-tight text-ink">
        {rating}
        <span className="ml-1.5 text-[0.75rem] font-normal text-muted">max rating</span>
      </p>
    </div>
  )
}

/** Fallback when live stats are unavailable: the résumé's peak ratings per platform. Not a time series. */
export default function CpRatingsChart({ data }) {
  const colors = useChartTheme()
  const animate = !prefersReducedMotion()

  if (!data?.length) {
    return (
      <div className="grid h-[260px] place-items-center rounded-2xl border border-dashed border-line text-[0.9375rem] text-muted">
        No ratings to show yet.
      </div>
    )
  }

  const tick = { fill: colors.muted, fontSize: 12 }

  return (
    <div className="h-[260px] w-full" aria-hidden="true">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 28, right: 4, bottom: 0, left: -12 }} barCategoryGap="30%">
          <CartesianGrid vertical={false} stroke={colors.grid} />
          <XAxis dataKey="platform" tickLine={false} axisLine={false} tick={{ ...tick, fill: colors.ink }} dy={6} />
          <YAxis
            domain={[0, 2000]}
            ticks={[0, 500, 1000, 1500, 2000]}
            tickLine={false}
            axisLine={false}
            tick={tick}
            width={48}
          />
          <Tooltip
            cursor={{ fill: colors.cursor, radius: 10 }}
            content={<GlassTooltip colors={colors} />}
            isAnimationActive={false}
          />
          <Bar
            dataKey="rating"
            radius={[8, 8, 3, 3]}
            maxBarSize={72}
            isAnimationActive={animate}
            animationDuration={750}
            animationEasing="ease-out"
          >
            {data.map((entry) => (
              <Cell key={entry.platform} fill={colors.platforms[entry.platform]} />
            ))}
            <LabelList dataKey="rating" position="top" offset={8} fill={colors.ink} fontSize={12} fontWeight={600} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
