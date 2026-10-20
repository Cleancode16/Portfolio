// Vercel serverless function: POST /api/contact
// Configure CONTACT_TO_EMAIL, RESEND_API_KEY and CONTACT_FROM_EMAIL in the
// Vercel project's environment variables (see .env.example).
import { handleContact, MAX_BODY_BYTES } from '../server/contact.js'

function clientIp(req) {
  const forwarded = req.headers['x-forwarded-for']
  if (typeof forwarded === 'string' && forwarded) return forwarded.split(',')[0].trim()
  return req.headers['x-real-ip'] || req.socket?.remoteAddress || 'unknown'
}

export default async function handler(req, res) {
  const length = Number(req.headers['content-length'] || 0)
  if (length > MAX_BODY_BYTES) {
    res.status(413).json({ ok: false, error: 'Invalid request.' })
    return
  }

  // Vercel parses JSON bodies automatically; a malformed body arrives as a string or throws.
  let body
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
  } catch {
    body = null
  }

  const result = await handleContact({
    method: req.method,
    body,
    ip: clientIp(req),
    origin: req.headers.origin,
    host: req.headers['x-forwarded-host'] || req.headers.host,
    contentType: req.headers['content-type'],
    env: process.env,
  })

  res.setHeader('Cache-Control', 'no-store')
  for (const [key, value] of Object.entries(result.headers || {})) res.setHeader(key, value)
  res.status(result.status).json(result.body)
}
