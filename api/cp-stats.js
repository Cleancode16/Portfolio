// Vercel serverless function: GET /api/cp-stats
// Live rating history and contest counts from LeetCode, CodeChef and Codeforces.
import { handleCpStats } from '../server/cp-stats.js'

export default async function handler(req, res) {
  const result = await handleCpStats({ method: req.method })
  for (const [key, value] of Object.entries(result.headers || {})) res.setHeader(key, value)
  res.status(result.status).json(result.body)
}
