import './illustration.css'

const MONO = 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace'

// Express + Mongoose + Socket.io route shown on the monitor, as [color class, text] tokens per line.
const CODE = [
  [['c-purple', 'import'], ['c-text', ' express '], ['c-purple', 'from'], ['c-green', " 'express'"]],
  [['c-purple', 'const'], ['c-text', ' router = express.'], ['c-blue', 'Router'], ['c-text', '()']],
  [],
  [['c-text', 'router.'], ['c-blue', 'post'], ['c-text', '('], ['c-green', "'/orders'"], ['c-text', ', auth,']],
  [['c-purple', '  async'], ['c-text', ' (req, res) => {']],
  [['c-purple', '    const'], ['c-text', ' order = '], ['c-purple', 'await'], ['c-text', ' Order.'], ['c-blue', 'create'], ['c-text', '({']],
  [['c-text', '      user: req.user.id,']],
  [['c-text', '      items: req.body.items,']],
  [['c-text', '    })']],
  [['c-text', '    io.'], ['c-blue', 'emit'], ['c-text', '('], ['c-green', "'order:created'"], ['c-text', ', order)']],
  [['c-text', '    res.'], ['c-blue', 'status'], ['c-text', '('], ['c-amber', '201'], ['c-text', ').'], ['c-blue', 'json'], ['c-text', '(order)']],
  [['c-text', '  })']],
  [['c-purple', 'export default'], ['c-text', ' router']],
]
const CODE_TOP = 36
const CODE_GAP = 10.8
const GUTTER = 24

// Monitor on the left of the desk (screen area inside the bezel).
const SCREEN = { x: 32, y: 66, w: 276, h: 180 }

// Laptop on the right runs the test → build → deploy loop.
const TERMINAL = [
  ['c-cyan', '$ npm test'],
  ['c-green', '✓ all tests passed'],
  ['c-cyan', '$ npm run build'],
  ['c-green', '✓ build complete'],
  ['c-cyan', '$ git push origin'],
  ['c-green', '✓ deployed'],
]

/**
 * A developer at his desk, seen from behind in a flat illustration style: an
 * API route on the monitor, a test/build/deploy terminal on the laptop, left
 * hand on the keyboard, right hand on the laptop. Colors come from CSS
 * variables so the scene follows the site theme.
 */
export default function CodingIllustration({ className = '' }) {
  const { x: sx, y: sy, w: sw, h: sh } = SCREEN
  const lastLineY = CODE_TOP + (CODE.length - 1) * CODE_GAP

  return (
    <svg viewBox="0 0 600 540" className={`workstation ${className}`} role="img" aria-labelledby="workstation-title">
      <title id="workstation-title">
        Illustration of a young man in an indigo shirt, seen from behind, typing at a desk with a monitor showing API
        code and a laptop running tests and a deploy
      </title>
      <defs>
        <linearGradient id="ws-sheen" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.07" />
          <stop offset="45%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <clipPath id="ws-screen">
          <rect x={sx} y={sy} width={sw} height={sh} rx="6" />
        </clipPath>
      </defs>


      {/* Desk */}
      <rect className="f-leg" x="44" y="378" width="12" height="162" rx="3" />
      <rect className="f-leg" x="544" y="378" width="12" height="162" rx="3" />
      <rect className="f-desk-edge" x="20" y="368" width="560" height="12" rx="4" />
      <rect className="f-desk" x="14" y="360" width="572" height="12" rx="5" />

      {/* Monitor on the left */}
      <path className="f-alu" d="M156 260 L184 260 L190 352 L150 352 Z" />
      <rect className="f-alu-dark" x="120" y="350" width="100" height="10" rx="5" />
      <rect className="f-bezel" x={sx - 12} y={sy - 12} width={sw + 24} height={sh + 26} rx="14" />
      <rect className="f-screen" x={sx} y={sy} width={sw} height={sh} rx="6" />

      <g clipPath="url(#ws-screen)">
        <g transform={`translate(${sx} ${sy})`}>
          <circle cx="12" cy="11" r="3.5" fill="#ff5f57" opacity="0.9" />
          <circle cx="24" cy="11" r="3.5" fill="#febc2e" opacity="0.9" />
          <circle cx="36" cy="11" r="3.5" fill="#28c840" opacity="0.9" />
          <text x="52" y="14" className="c-dim" fontSize="8" fontFamily={MONO}>
            routes/orders.js
          </text>
          <rect className="f-ui" x="0" y="21" width={sw} height="1" opacity="0.08" />

          <g fontSize="8.8" fontFamily={MONO}>
            {CODE.map((tokens, i) => (
              <g key={i}>
                <text x={GUTTER - 7} y={CODE_TOP + i * CODE_GAP} textAnchor="end" className="c-dim" opacity="0.6">
                  {i + 1}
                </text>
                <text x={GUTTER} y={CODE_TOP + i * CODE_GAP} xmlSpace="preserve" style={{ whiteSpace: 'pre' }}>
                  {tokens.map(([color, text], j) => (
                    <tspan key={j} className={color}>
                      {text}
                    </tspan>
                  ))}
                </text>
              </g>
            ))}
          </g>
          <rect className="cursor" x={GUTTER + 112} y={lastLineY - 7.5} width="1.6" height="9" rx="0.8" />
        </g>
        <rect x={sx} y={sy} width={sw} height={sh} fill="url(#ws-sheen)" />
      </g>

      {/* Keyboard in front of the monitor */}
      <rect className="f-alu" x="196" y="352" width="104" height="8" rx="3" />
      <rect className="f-alu-dark" x="202" y="354.5" width="92" height="1.5" rx="0.75" opacity="0.7" />

      {/* Laptop on the right, running the test → build → deploy loop */}
      <g>
        <rect className="f-bezel" x="446" y="246" width="128" height="98" rx="8" />
        <rect className="f-screen" x="452" y="252" width="116" height="86" rx="4" />
        {TERMINAL.map(([color, text], i) => (
          <text key={i} x="459" y={266 + i * 12.5} className={color} fontSize="7.6" fontFamily={MONO}>
            {text}
          </text>
        ))}
        <path className="f-alu" d="M432 344 L588 344 L582 354 L438 354 Z" />
        <rect className="f-alu-dark" x="490" y="344" width="40" height="3" rx="1.5" opacity="0.7" />
      </g>

      {/* Developer, seen from behind (flat illustration style) */}
      <g className="ws-person">
        {/* Soft contact shadows where the hands rest on the desk */}
        <ellipse className="f-floor" cx="238" cy="368" rx="20" ry="3" />
        <ellipse className="f-floor" cx="442" cy="368" rx="20" ry="3" />

        {/* Both forearms forward, hands resting on the desk on either side */}
        <path className="s-shirt" d="M272 302 C254 322 242 342 240 356" fill="none" strokeWidth="30" strokeLinecap="round" />
        <path className="s-shirt" d="M408 302 C426 322 438 342 440 356" fill="none" strokeWidth="30" strokeLinecap="round" />
        {/* Sleeve shading on the outer side, then cuffs */}
        <path className="s-shirt-shade" d="M258 314 C248 328 242 340 240 348" fill="none" strokeWidth="6" strokeLinecap="round" opacity="0.55" />
        <path className="s-shirt-shade" d="M422 314 C432 328 438 340 440 348" fill="none" strokeWidth="6" strokeLinecap="round" opacity="0.55" />
        <ellipse className="f-shirt-shade" cx="240" cy="355" rx="15" ry="6" />
        <ellipse className="f-shirt-shade" cx="440" cy="355" rx="15" ry="6" />
        {/* Hands flat on the desk, thumbs turned inward */}
        <ellipse className="f-skin" cx="238" cy="362" rx="13.5" ry="6.5" />
        <ellipse className="f-skin-shade" cx="250" cy="360" rx="5" ry="3" />
        <ellipse className="f-skin" cx="442" cy="362" rx="13.5" ry="6.5" />
        <ellipse className="f-skin-shade" cx="430" cy="360" rx="5" ry="3" />

        <g transform="translate(40 0)">
          {/* Shirt with side shading for volume */}
          <path className="f-shirt" d="M212 334 C212 294 244 272 276 268 L324 268 C356 272 388 294 388 334 L394 480 L206 480 Z" />
          <path className="f-shirt-shade" opacity="0.55" d="M212 334 C212 302 226 284 246 274 C236 302 232 344 236 480 L206 480 Z" />
          <path className="f-shirt-shade" opacity="0.55" d="M388 334 C388 302 374 284 354 274 C364 302 368 344 364 480 L394 480 Z" />
          <path className="s-shirt-shade" d="M300 300 L300 400" fill="none" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
          {/* Shoulder highlights */}
          <path className="s-shirt-hi" d="M236 292 C250 280 266 274 282 272" fill="none" strokeWidth="3" strokeLinecap="round" />
          <path className="s-shirt-hi" d="M364 292 C350 280 334 274 318 272" fill="none" strokeWidth="3" strokeLinecap="round" />

          {/* Neck with a shadow under the hairline, then the collar band */}
          <rect className="f-skin-shade" x="286" y="232" width="28" height="44" rx="9" />
          <ellipse className="f-skin-deep" cx="300" cy="240" rx="14" ry="5" />
          <path className="f-shirt-shade" d="M272 268 C282 282 318 282 328 268 L322 263 C313 273 287 273 278 263 Z" />

          {/* Ears with inner detail */}
          <ellipse className="f-skin-shade" cx="263" cy="214" rx="6" ry="10" />
          <ellipse className="f-skin" cx="338" cy="212" rx="7.5" ry="11.5" />
          <path className="s-skin-deep" d="M339 205 C343 209 343 216 339 220" fill="none" strokeWidth="1.6" strokeLinecap="round" />

          {/* Head */}
          <ellipse className="f-skin" cx="300" cy="204" rx="37" ry="41" />

          {/* Hair: a neat, formal short cut with a clean side part */}
          <path
            className="f-ink-dark"
            d="M264 214 C258 182 270 158 298 156 C326 154 343 172 338 206 C334 226 318 238 300 239 C282 239 268 230 264 214 Z"
          />
          <path className="s-hair-part" d="M282 160 C288 170 292 182 293 194" fill="none" strokeWidth="1.6" strokeLinecap="round" />
          <path className="s-hair-sheen" d="M296 162 C310 158 324 162 332 172" fill="none" strokeWidth="2.2" strokeLinecap="round" opacity="0.6" />

          {/* Chair back with a top highlight and lumbar line */}
          <rect className="f-ink-dark" x="220" y="404" width="160" height="136" rx="16" />
          <rect className="f-chair-edge" x="232" y="414" width="136" height="10" rx="5" opacity="0.5" />
          <path className="s-chair-line" d="M240 470 C270 462 330 462 360 470" fill="none" strokeWidth="2" strokeLinecap="round" />
        </g>
      </g>
    </svg>
  )
}
