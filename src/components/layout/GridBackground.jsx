import { useEffect, useLayoutEffect, useRef } from 'react'
import { useRecoilValue } from 'recoil'
import { themeState } from '../../state/ui'
import { prefersReducedMotion } from '../../lib/motion'

const GRID = 80 // px between lines
const DOT = 1.1 // dot radius (≈2px dots)
const RADIUS = 160 // px around the cursor that reacts
const PUSH = 14 // max displacement in px
const STEP = 12 // sampling step along each line (px)
const FOLLOW = 0.14 // pointer smoothing (lerp factor per frame)
const FADE = 0.08 // intensity smoothing in/out

/**
 * Page background inspired by Aceternity's "grid with dots and animations":
 * an 80px grid with dots at the intersections. Near the mouse the lines bend
 * away in a soft wave and glow in the accent colour; everything eases back
 * when the mouse leaves. Drawn on one canvas (fast), scrolls with the page,
 * follows the theme, and stays static for touch and reduced-motion visitors.
 */
export default function GridBackground() {
  const canvasRef = useRef(null)
  const drawRef = useRef(() => {})
  const theme = useRecoilValue(themeState)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return undefined

    const interactive = !prefersReducedMotion() && window.matchMedia('(pointer: fine)').matches
    const state = { width: 0, height: 0, dpr: 1, tx: -9999, ty: -9999, mx: -9999, my: -9999, target: 0, intensity: 0 }
    let colors = { line: '', dot: '', accent: '0 0 0' }
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

    // Displacement of a point away from the (smoothed) pointer, with a smooth falloff.
    const displace = (x, y) => {
      if (state.intensity < 0.001) return [x, y, 0]
      const dx = x - state.mx
      const dy = y - state.my
      const dist = Math.hypot(dx, dy)
      if (dist >= RADIUS || dist === 0) return [x, y, 0]
      const falloff = (1 - dist / RADIUS) ** 2 * state.intensity
      return [x + (dx / dist) * PUSH * falloff, y + (dy / dist) * PUSH * falloff, falloff]
    }

    const draw = () => {
      const { width, height, dpr } = state
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, width, height)
      const offsetY = -(window.scrollY % GRID)

      // Base grid: every line as one path (distorted near the pointer).
      ctx.beginPath()
      for (let x = 0; x <= width + GRID; x += GRID) {
        for (let y = -GRID; y <= height + GRID; y += STEP) {
          const [px, py] = displace(x, y + offsetY)
          if (y === -GRID) ctx.moveTo(px, py)
          else ctx.lineTo(px, py)
        }
      }
      for (let y = offsetY - GRID; y <= height + GRID; y += GRID) {
        for (let x = 0; x <= width + GRID; x += STEP) {
          const [px, py] = displace(x, y)
          if (x === 0) ctx.moveTo(px, py)
          else ctx.lineTo(px, py)
        }
      }
      ctx.strokeStyle = colors.line
      ctx.lineWidth = 1
      ctx.stroke()

      // Glow: re-stroke only the segments near the pointer in the accent colour.
      if (state.intensity > 0.01) {
        ctx.lineWidth = 1.25
        const segment = (x1, y1, x2, y2) => {
          const [ax, ay, fa] = displace(x1, y1)
          const [bx, by, fb] = displace(x2, y2)
          const glow = Math.max(fa, fb)
          if (glow <= 0.01) return
          ctx.strokeStyle = `rgb(${colors.accent} / ${Math.min(0.7, glow * 0.9)})`
          ctx.beginPath()
          ctx.moveTo(ax, ay)
          ctx.lineTo(bx, by)
          ctx.stroke()
        }
        const x0 = Math.floor((state.mx - RADIUS) / GRID) * GRID
        const y0 = Math.floor((state.my - RADIUS - offsetY) / GRID) * GRID + offsetY
        for (let x = Math.max(0, x0); x <= state.mx + RADIUS; x += GRID) {
          for (let y = state.my - RADIUS; y < state.my + RADIUS; y += STEP) segment(x, y, x, y + STEP)
        }
        for (let y = y0; y <= state.my + RADIUS; y += GRID) {
          for (let x = state.mx - RADIUS; x < state.mx + RADIUS; x += STEP) segment(x, y, x + STEP, y)
        }
      }

      // Dots at the intersections.
      for (let x = 0; x <= width + GRID; x += GRID) {
        for (let y = offsetY; y <= height + GRID; y += GRID) {
          const [px, py, glow] = displace(x, y)
          ctx.fillStyle = glow > 0.01 ? `rgb(${colors.accent} / ${0.35 + glow * 0.6})` : colors.dot
          ctx.beginPath()
          ctx.arc(px, py, DOT + glow * 1.2, 0, Math.PI * 2)
          ctx.fill()
        }
      }
    }

    // Animation loop: runs only while the pointer effect is easing; stops when settled.
    const tick = () => {
      state.mx += (state.tx - state.mx) * FOLLOW
      state.my += (state.ty - state.my) * FOLLOW
      state.intensity += (state.target - state.intensity) * FADE
      draw()
      const settled =
        Math.abs(state.target - state.intensity) < 0.002 &&
        Math.abs(state.tx - state.mx) < 0.3 &&
        Math.abs(state.ty - state.my) < 0.3
      frame = settled ? 0 : requestAnimationFrame(tick)
    }
    const wake = () => {
      if (!frame) frame = requestAnimationFrame(tick)
    }

    const resize = () => {
      state.dpr = Math.min(window.devicePixelRatio || 1, 2)
      state.width = window.innerWidth
      state.height = window.innerHeight
      canvas.width = Math.round(state.width * state.dpr)
      canvas.height = Math.round(state.height * state.dpr)
      draw()
    }

    const onMove = (event) => {
      if (event.pointerType !== 'mouse') return
      if (state.intensity < 0.01) {
        // Jump the smoothed pointer to the entry point instead of sweeping across the screen.
        state.mx = event.clientX
        state.my = event.clientY
      }
      state.tx = event.clientX
      state.ty = event.clientY
      state.target = 1
      wake()
    }
    const onLeave = () => {
      state.target = 0
      wake()
    }
    let scrollFrame = 0
    const onScroll = () => {
      if (frame || scrollFrame) return
      scrollFrame = requestAnimationFrame(() => {
        scrollFrame = 0
        draw()
      })
    }

    drawRef.current = () => {
      readColors()
      draw()
    }
    readColors()
    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('scroll', onScroll, { passive: true })
    if (interactive) {
      window.addEventListener('pointermove', onMove, { passive: true })
      document.documentElement.addEventListener('pointerleave', onLeave)
      window.addEventListener('blur', onLeave)
    }
    return () => {
      cancelAnimationFrame(frame)
      cancelAnimationFrame(scrollFrame)
      window.removeEventListener('resize', resize)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('blur', onLeave)
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
