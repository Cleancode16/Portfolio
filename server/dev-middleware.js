// Connect-style middleware so `npm run dev` and `npm run preview` serve
// /api/contact with the same logic as the deployed Vercel function.
import { handleContact, MAX_BODY_BYTES } from './contact.js'
import { handleCpStats } from './cp-stats.js'

function readJson(req) {
  return new Promise((resolve, reject) => {
    let size = 0
    const chunks = []
    req.on('data', (chunk) => {
      size += chunk.length
      if (size > MAX_BODY_BYTES) {
        reject(Object.assign(new Error('Payload too large'), { status: 413 }))
        req.destroy()
        return
      }
      chunks.push(chunk)
    })
    req.on('end', () => {
      try {
        const raw = Buffer.concat(chunks).toString('utf8')
        resolve(raw ? JSON.parse(raw) : null)
      } catch {
        resolve(null)
      }
    })
    req.on('error', reject)
  })
}

export function contactApiMiddleware(env) {
  return async (req, res) => {
    let body = null
    try {
      if (req.method === 'POST') body = await readJson(req)
    } catch (error) {
      res.statusCode = error.status || 400
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ ok: false, error: 'Invalid request.' }))
      return
    }

    const result = await handleContact({
      method: req.method,
      body,
      ip: req.socket?.remoteAddress,
      origin: req.headers.origin,
      contentType: req.headers['content-type'],
      env,
    })

    res.statusCode = result.status
    res.setHeader('Content-Type', 'application/json')
    res.setHeader('Cache-Control', 'no-store')
    for (const [key, value] of Object.entries(result.headers || {})) res.setHeader(key, value)
    res.end(JSON.stringify(result.body))
  }
}

// GET /api/cp-stats in `vite dev` / `vite preview`, same logic as the Vercel function.
export function cpStatsMiddleware() {
  return async (req, res) => {
    const result = await handleCpStats({ method: req.method })
    res.statusCode = result.status
    res.setHeader('Content-Type', 'application/json')
    for (const [key, value] of Object.entries(result.headers || {})) res.setHeader(key, value)
    res.end(JSON.stringify(result.body))
  }
}
