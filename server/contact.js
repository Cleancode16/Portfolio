// Server-side contact-form handling shared by the Vercel function (api/contact.js)
// and the local Vite dev/preview middleware (server/dev-middleware.js).
//
// Configuration comes only from server environment variables:
//   CONTACT_TO_EMAIL    private destination inbox (never sent to the browser)
//   RESEND_API_KEY      Resend API key
//   CONTACT_FROM_EMAIL  verified sender, e.g. "Portfolio <contact@yourdomain.com>"
//   ALLOWED_ORIGINS     optional comma-separated list of origins allowed to post

const LIMITS = {
  name: { min: 2, max: 80 },
  email: { max: 254 },
  subject: { max: 120 },
  message: { min: 10, max: 5000 },
}

// Basic spam protection: a submission arriving faster than this after the
// form was opened is almost certainly automated.
const MIN_FILL_TIME_MS = 2500
const RATE_LIMIT = { windowMs: 10 * 60 * 1000, max: 5 }
const MAX_LINKS = 5
const DEFAULT_FROM = 'Portfolio Contact <onboarding@resend.dev>'
const RESEND_ENDPOINT = 'https://api.resend.com/emails'
const PROVIDER_TIMEOUT_MS = 10000

const EMAIL_PATTERN = /^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)+$/

// Best-effort, per-instance limiter. Serverless instances do not share memory,
// so this slows down abuse from a single client rather than enforcing a global cap.
const attempts = new Map()

function isRateLimited(key, now = Date.now()) {
  for (const [k, entry] of attempts) {
    if (now - entry.start > RATE_LIMIT.windowMs) attempts.delete(k)
  }
  const entry = attempts.get(key)
  if (!entry) {
    attempts.set(key, { start: now, count: 1 })
    return false
  }
  entry.count += 1
  return entry.count > RATE_LIMIT.max
}

// Removes control characters (keeping newlines and tabs only where allowed),
// normalizes line endings and trims.
function clean(value, { multiline = false } = {}) {
  if (typeof value !== 'string') return ''
  let text = value.normalize('NFC').replace(/\r\n?/g, '\n')
  text = multiline
    ? text.replace(/[^\P{Cc}\n\t]/gu, '')
    : text.replace(/\p{Cc}/gu, ' ').replace(/\s+/g, ' ')
  return text.trim()
}

export function validateContact(input) {
  const data = {
    name: clean(input?.name),
    email: clean(input?.email).toLowerCase(),
    subject: clean(input?.subject),
    message: clean(input?.message, { multiline: true }).replace(/\n{4,}/g, '\n\n\n'),
  }
  const errors = {}

  if (data.name.length < LIMITS.name.min) errors.name = 'Please enter your name.'
  else if (data.name.length > LIMITS.name.max) errors.name = `Please keep your name under ${LIMITS.name.max} characters.`

  if (!data.email) errors.email = 'Please enter your email address.'
  else if (data.email.length > LIMITS.email.max || !EMAIL_PATTERN.test(data.email))
    errors.email = 'Please enter a valid email address.'

  if (data.subject.length > LIMITS.subject.max)
    errors.subject = `Please keep the subject under ${LIMITS.subject.max} characters.`

  if (data.message.length < LIMITS.message.min)
    errors.message = `Please write at least ${LIMITS.message.min} characters.`
  else if (data.message.length > LIMITS.message.max)
    errors.message = `Please keep your message under ${LIMITS.message.max} characters.`
  else if ((data.message.match(/https?:\/\//gi) || []).length > MAX_LINKS)
    errors.message = 'Your message contains too many links.'

  return { data, errors }
}

function isSpam(input) {
  // Honeypot: the "website" field is visually hidden; people never fill it in.
  if (typeof input?.website === 'string' && input.website.trim() !== '') return true
  const elapsed = Number(input?.elapsedMs)
  return Number.isFinite(elapsed) && elapsed >= 0 && elapsed < MIN_FILL_TIME_MS
}

function originAllowed(origin, env) {
  const allowed = (env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean)
  if (allowed.length === 0 || !origin) return true
  return allowed.includes(origin)
}

async function sendWithResend(data, env) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), PROVIDER_TIMEOUT_MS)
  const subjectLine = `Portfolio message from ${data.name}${data.subject ? `: ${data.subject}` : ''}`

  // Plain text only: the visitor's input is never rendered as HTML.
  const text = [
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    `Subject: ${data.subject || '(none)'}`,
    '',
    data.message,
    '',
    '--',
    'Sent from the contact form on your portfolio. Reply directly to respond to the sender.',
  ].join('\n')

  try {
    const response = await fetch(RESEND_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: env.CONTACT_FROM_EMAIL || DEFAULT_FROM,
        to: [env.CONTACT_TO_EMAIL],
        reply_to: data.email,
        subject: subjectLine.slice(0, 200),
        text,
      }),
      signal: controller.signal,
    })
    if (!response.ok) {
      const detail = await response.text().catch(() => '')
      console.error(`[contact] Resend rejected the message (${response.status}): ${detail.slice(0, 300)}`)
      return false
    }
    const result = await response.json().catch(() => ({}))
    return Boolean(result?.id)
  } catch (error) {
    console.error('[contact] Resend request failed:', error?.name === 'AbortError' ? 'timeout' : error?.message)
    return false
  } finally {
    clearTimeout(timer)
  }
}

/**
 * Framework-agnostic handler.
 * @returns {Promise<{ status: number, body: object, headers?: object }>}
 */
export async function handleContact({ method, body, ip, origin, contentType, env }) {
  if (method !== 'POST') {
    return { status: 405, body: { ok: false, error: 'Method not allowed.' }, headers: { Allow: 'POST' } }
  }
  if (!contentType || !contentType.toLowerCase().includes('application/json')) {
    return { status: 415, body: { ok: false, error: 'Unsupported content type.' } }
  }
  if (!originAllowed(origin, env)) {
    return { status: 403, body: { ok: false, error: 'This request is not allowed.' } }
  }
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { status: 400, body: { ok: false, error: 'Invalid request.' } }
  }
  if (isRateLimited(ip || 'unknown')) {
    return {
      status: 429,
      body: { ok: false, error: 'Too many messages in a short time. Please try again in a few minutes.' },
      headers: { 'Retry-After': String(RATE_LIMIT.windowMs / 1000) },
    }
  }

  const { data, errors } = validateContact(body)
  if (Object.keys(errors).length > 0) {
    return { status: 422, body: { ok: false, error: 'Please check the highlighted fields.', fields: errors } }
  }

  // Silently accept bot submissions so automated senders get no useful signal.
  if (isSpam(body)) {
    return { status: 200, body: { ok: true } }
  }

  if (!env.RESEND_API_KEY || !env.CONTACT_TO_EMAIL) {
    const missing = ['RESEND_API_KEY', 'CONTACT_TO_EMAIL'].filter((key) => !env[key])
    console.error(`[contact] Email delivery is not configured. Missing: ${missing.join(', ')}`)
    return {
      status: 503,
      body: { ok: false, error: 'The contact form is temporarily unavailable. Please try again later.' },
    }
  }

  const delivered = await sendWithResend(data, env)
  if (!delivered) {
    return {
      status: 502,
      body: { ok: false, error: 'Your message could not be delivered right now. Please try again shortly.' },
    }
  }
  return { status: 200, body: { ok: true } }
}

export const MAX_BODY_BYTES = 16 * 1024
