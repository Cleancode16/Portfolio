import { useEffect, useLayoutEffect, useRef } from 'react'
import { useRecoilValue } from 'recoil'
import { themeState } from '../../state/ui'
import { prefersReducedMotion } from '../../lib/motion'

const GRID = 80 // px between lines
const DOT = 1.1 // dot radius (≈2px dots)
const DRIFT_X = 9 // grid drift, px per second
const DRIFT_Y = 6
// Two kinds of light beams: many short soft ones, and fewer long, thick, fast streaks.
// density: beams per px² of screen; length (px), speed (px/s) are [min, max] ranges.
const BEAM_KINDS = [
  { density: 1 / 95000, min: 10, length: [140, 180], speed: [60, 160], width: 1.25, alpha: 0.65 }, // ≈22 at 1080p
  { density: 1 / 260000, min: 4, length: [320, 520], speed: [240, 380], width: 2.25, alpha: 0.85 }, // ≈8 at 1080p
]
const between = ([min, max]) => min + Math.random() * (max - min)

/**
 * Page background: an 80px grid with dots at the intersections that drifts
 * slowly and continuously, while accent beams glide along the lines: many
 * short soft ones plus fewer long, thick, faster streaks (more of both on
 * larger screens). No pointer interaction. Drawn on one canvas, scrolls with the page,
 * follows the theme, pauses when the tab is hidden, and stays static for
 * reduced-motion visitors.
 */
export default function GridBackground() {
  const canvasRef = useRef(null)
  const drawRef = useRef(() => {})
  const theme = useRecoilValue(themeState)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return undefined

    const animated = !prefersReducedMotion()
    const state = { width: 0, height: 0, dpr: 1, time: 0, last: 0 }
    let colors = { line: '', dot: '', accent: '0 0 0' }
    let beams = []
    let frame = 0

    const readColors = () => {
      const styles = getComputedStyle(document.documentElement)
      const ink = styles.getPropertyValue('--ink').trim()
      colors = {
        line: `rgb(${ink} / ${document.documentElement.dataset.theme === 'dark' ? 0.07 : 0.08})`,
        dot: `rgb(${ink} / 0.2)`,
        accent: styles.getPropertyValue('--accent').trim(),
      }
    }

    // A beam runs along one grid line (horizontal or vertical), in grid units so it rides with the drift.
    const spawnBeam = (beam, initial = false) => {
      const { kind } = beam
      const horizontal = Math.random() < 0.5
      const span = horizontal ? state.width : state.height
      beam.horizontal = horizontal
      beam.line = Math.floor(Math.random() * ((horizontal ? state.height : state.width) / GRID + 2))
      // First beams start on screen; later ones enter from off-screen, staggered.
      beam.length = between(kind.length)
      beam.pos = initial ? Math.random() * span : -beam.length - Math.random() * span * 0.3
      beam.speed = between(kind.speed)
      beam.span = span
      return beam
    }

    const draw = () => {
      const { width, height, dpr, time } = state
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, width, height)
      const ox = (time * DRIFT_X) % GRID
      const oy = (time * DRIFT_Y - window.scrollY) % GRID
      const offsetX = ox - GRID
      const offsetY = (oy > 0 ? oy : oy + GRID) - GRID

      // Grid lines: one path.
      ctx.beginPath()
      for (let x = offsetX; x <= width + GRID; x += GRID) {
        ctx.moveTo(x, 0)
        ctx.lineTo(x, height)
      }
      for (let y = offsetY; y <= height + GRID; y += GRID) {
        ctx.moveTo(0, y)
        ctx.lineTo(width, y)
      }
      ctx.strokeStyle = colors.line
      ctx.lineWidth = 1
      ctx.stroke()

      // Beams: a soft gradient streak with a bright head.
      if (animated) {
        ctx.lineCap = 'round'
        for (const beam of beams) {
          const head = beam.pos
          const tail = head - beam.length
          const fixed = (beam.horizontal ? offsetY : offsetX) + beam.line * GRID
          const [x1, y1, x2, y2] = beam.horizontal ? [tail, fixed, head, fixed] : [fixed, tail, fixed, head]
          const gradient = ctx.createLinearGradient(x1, y1, x2, y2)
          gradient.addColorStop(0, `rgb(${colors.accent} / 0)`)
          gradient.addColorStop(1, `rgb(${colors.accent} / ${beam.kind.alpha})`)
          ctx.strokeStyle = gradient
          ctx.lineWidth = beam.kind.width
          ctx.beginPath()
          ctx.moveTo(x1, y1)
          ctx.lineTo(x2, y2)
          ctx.stroke()
        }
      }

      // Dots at the intersections.
      ctx.fillStyle = colors.dot
      ctx.beginPath()
      for (let x = offsetX; x <= width + GRID; x += GRID) {
        for (let y = offsetY; y <= height + GRID; y += GRID) {
          ctx.moveTo(x + DOT, y)
          ctx.arc(x, y, DOT, 0, Math.PI * 2)
        }
      }
      ctx.fill()
    }

    // Continuous loop driven by elapsed time, so motion stays smooth at any frame rate.
    const tick = (now) => {
      const dt = state.last ? Math.min((now - state.last) / 1000, 0.05) : 0
      state.last = now
      state.time += dt
      for (const beam of beams) {
        beam.pos += beam.speed * dt
        if (beam.pos - beam.length > beam.span) spawnBeam(beam)
      }
      draw()
      frame = requestAnimationFrame(tick)
    }
    const start = () => {
      if (!animated || frame) return
      state.last = 0
      frame = requestAnimationFrame(tick)
    }
    const stop = () => {
      cancelAnimationFrame(frame)
      frame = 0
    }

    const resize = () => {
      state.dpr = Math.min(window.devicePixelRatio || 1, 2)
      state.width = window.innerWidth
      state.height = window.innerHeight
      canvas.width = Math.round(state.width * state.dpr)
      canvas.height = Math.round(state.height * state.dpr)
      const area = state.width * state.height
      beams = BEAM_KINDS.flatMap((kind) =>
        Array.from({ length: Math.max(kind.min, Math.round(area * kind.density)) }, () => spawnBeam({ kind }, true)),
      )
      draw()
    }

    // Without the loop (reduced motion), redraw on scroll so the grid still moves with the page.
    let scrollFrame = 0
    const onScroll = () => {
      if (frame || scrollFrame) return
      scrollFrame = requestAnimationFrame(() => {
        scrollFrame = 0
        draw()
      })
    }
    const onVisibility = () => (document.hidden ? stop() : start())

    drawRef.current = () => {
      readColors()
      draw()
    }
    readColors()
    resize()
    start()
    window.addEventListener('resize', resize)
    window.addEventListener('scroll', onScroll, { passive: true })
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      stop()
      cancelAnimationFrame(scrollFrame)
      window.removeEventListener('resize', resize)
      window.removeEventListener('scroll', onScroll)
      document.removeEventListener('visibilitychange', onVisibility)
      drawRef.current = () => {}
    }
  }, [])

  // Redraw with the new theme colours inside the same commit (keeps the theme reveal snapshot correct).
  useLayoutEffect(() => {
    drawRef.current()
  }, [theme])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="grid-background pointer-events-none fixed inset-0 -z-10 h-full w-full"
    />
  )
}
