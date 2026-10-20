import {
  siBootstrap,
  siC,
  siCodechef,
  siCodeforces,
  siCplusplus,
  siCss,
  siExpress,
  siGit,
  siGithub,
  siHtml5,
  siJavascript,
  siJsonwebtokens,
  siLeetcode,
  siMongodb,
  siNextdotjs,
  siNodedotjs,
  siOpenjdk,
  siReact,
  siRecoil,
  siRender,
  siSocketdotio,
  siTailwindcss,
  siTypescript,
  siVercel,
} from 'simple-icons'
import { Binary, Boxes, Cpu, Database, Network, Table2, Webhook } from 'lucide-react'

const BRAND = {
  siBootstrap,
  siC,
  siCodechef,
  siCodeforces,
  siCplusplus,
  siCss,
  siExpress,
  siGit,
  siGithub,
  siHtml5,
  siJavascript,
  siJsonwebtokens,
  siLeetcode,
  siMongodb,
  siNextdotjs,
  siNodedotjs,
  siOpenjdk,
  siReact,
  siRecoil,
  siRender,
  siSocketdotio,
  siTailwindcss,
  siTypescript,
  siVercel,
}

const CONCEPT = { Binary, Boxes, Cpu, Database, Network, Table2, Webhook }

const GRAPHITE = 'linear-gradient(180deg, #3a3a3e 0%, #1c1c1f 100%)'
const SYSTEM_GRAY = 'linear-gradient(180deg, #8e8e96 0%, #5f5f66 100%)'

function luminance(hex) {
  const [r, g, b] = [0, 2, 4].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/** Colors for an app-style icon: brand fill, with a legible glyph color. */
function palette(icon) {
  if (!icon) return { background: SYSTEM_GRAY, glyph: '#ffffff' }
  const lum = luminance(icon.hex)
  if (lum < 0.03) return { background: GRAPHITE, glyph: '#ffffff' } // black brand marks
  const base = `#${icon.hex}`
  return {
    background: `linear-gradient(180deg, color-mix(in srgb, ${base} 82%, white) 0%, ${base} 100%)`,
    fallback: base,
    glyph: lum > 0.45 ? '#1d1d1f' : '#ffffff',
  }
}

/**
 * macOS-style app icon (squircle) for a technology. Decorative: the visible
 * label next to it names the technology.
 */
export default function TechIcon({ icon, className = '' }) {
  const brand = BRAND[icon]
  const Concept = CONCEPT[icon]
  const { background, fallback, glyph } = palette(brand)

  return (
    <span
      aria-hidden="true"
      className={`relative grid place-items-center overflow-hidden rounded-[23%] ${className}`}
      style={{
        backgroundColor: fallback,
        backgroundImage: background,
        boxShadow:
          'inset 0 0 0 0.5px rgb(255 255 255 / 0.22), inset 0 1px 0 rgb(255 255 255 / 0.25), 0 1px 2px rgb(var(--shadow) / 0.18), 0 8px 18px -8px rgb(var(--shadow) / 0.45)',
      }}
    >
      {/* Soft top gloss */}
      <span className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent" />
      {brand ? (
        <svg viewBox="0 0 24 24" className="relative h-[52%] w-[52%]" fill={glyph}>
          <path d={brand.path} />
        </svg>
      ) : (
        Concept && <Concept className="relative h-[50%] w-[50%]" color={glyph} strokeWidth={1.75} />
      )}
    </span>
  )
}
