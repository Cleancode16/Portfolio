// Live competitive-programming stats, fetched server-side (LeetCode and CodeChef
// block browser cross-origin requests) and cached in memory for an hour.
// Shared by the Vercel function (api/cp-stats.js) and the Vite dev/preview middleware.
//
// Sources:
//   Codeforces  official public API (user.rating)
//   LeetCode    public GraphQL endpoint used by its own profile pages (unofficial)
//   CodeChef    rating history embedded in the public profile page (no official API)
// Each source fails independently; a failure returns { error } for that platform only.

const HANDLES = {
  leetcode: 'cleancode16',
  codechef: 'devasanibharat',
  codeforces: 'cleancode08',
}
const TIMEOUT_MS = 9000
const CACHE_MS = 60 * 60 * 1000
const UA = 'Mozilla/5.0 (portfolio stats; +https://github.com/Cleancode16)'

let cache = null

async function fetchWithTimeout(url, options = {}) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
  try {
    const response = await fetch(url, { ...options, signal: controller.signal })
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    return response
  } finally {
    clearTimeout(timer)
  }
}

function summarise(platform, handle, url, history, contests) {
  const ratings = history.map((point) => point.rating)
  return {
    platform,
    handle,
    url,
    contests: contests ?? history.length,
    currentRating: ratings.length ? ratings[ratings.length - 1] : null,
    maxRating: ratings.length ? Math.max(...ratings) : null,
    history,
  }
}

async function codeforces() {
  const handle = HANDLES.codeforces
  const response = await fetchWithTimeout(`https://codeforces.com/api/user.rating?handle=${handle}`)
  const json = await response.json()
  if (json.status !== 'OK' || !Array.isArray(json.result)) throw new Error('Unexpected Codeforces response')
  const history = json.result.map((entry) => ({
    date: entry.ratingUpdateTimeSeconds * 1000,
    rating: entry.newRating,
    contest: entry.contestName,
  }))
  return summarise('Codeforces', handle, `https://codeforces.com/profile/${handle}`, history)
}

async function leetcode() {
  const handle = HANDLES.leetcode
  const query = `query ($u: String!) {
    userContestRanking(username: $u) { attendedContestsCount rating }
    userContestRankingHistory(username: $u) { attended rating contest { title startTime } }
  }`
  const response = await fetchWithTimeout('https://leetcode.com/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Referer: `https://leetcode.com/u/${handle}/`, 'User-Agent': UA },
    body: JSON.stringify({ query, variables: { u: handle } }),
  })
  const json = await response.json()
  const data = json?.data
  if (!data || !Array.isArray(data.userContestRankingHistory)) throw new Error('Unexpected LeetCode response')
  const history = data.userContestRankingHistory
    .filter((entry) => entry.attended)
    .map((entry) => ({
      date: entry.contest.startTime * 1000,
      rating: Math.round(entry.rating),
      contest: entry.contest.title,
    }))
  return summarise(
    'LeetCode',
    handle,
    `https://leetcode.com/u/${handle}/`,
    history,
    data.userContestRanking?.attendedContestsCount,
  )
}

async function codechef() {
  const handle = HANDLES.codechef
  const response = await fetchWithTimeout(`https://www.codechef.com/users/${handle}`, { headers: { 'User-Agent': UA } })
  const html = await response.text()
  const match = html.match(/var all_rating = (\[[\s\S]*?\]);/)
  if (!match) throw new Error('CodeChef rating data not found')
  const entries = JSON.parse(match[1])
  const history = entries
    .map((entry) => ({
      date: Date.UTC(Number(entry.getyear), Number(entry.getmonth) - 1, Number(entry.getday)),
      rating: Number(entry.rating),
      contest: entry.name || entry.code,
    }))
    .filter((point) => Number.isFinite(point.rating) && Number.isFinite(point.date))
    .sort((a, b) => a.date - b.date)
  return summarise('CodeChef', handle, `https://www.codechef.com/users/${handle}`, history)
}

const SOURCES = [
  ['leetcode', 'LeetCode', leetcode],
  ['codechef', 'CodeChef', codechef],
  ['codeforces', 'Codeforces', codeforces],
]

export async function getCpStats(now = Date.now()) {
  if (cache && now - cache.at < CACHE_MS) return cache.body

  const settled = await Promise.allSettled(SOURCES.map(([, , load]) => load()))
  const platforms = settled.map((result, i) => {
    const [, name] = SOURCES[i]
    if (result.status === 'fulfilled') return result.value
    console.error(`[cp-stats] ${name} unavailable:`, result.reason?.message)
    return { platform: name, error: 'unavailable' }
  })

  const body = { fetchedAt: new Date(now).toISOString(), platforms }
  // Only cache when at least one platform succeeded, so a transient outage retries on the next request.
  if (platforms.some((p) => !p.error)) cache = { at: now, body }
  return body
}

export async function handleCpStats({ method }) {
  if (method !== 'GET') {
    return { status: 405, body: { error: 'Method not allowed.' }, headers: { Allow: 'GET' } }
  }
  const body = await getCpStats()
  return {
    status: 200,
    body,
    // Let Vercel's edge cache serve it for an hour and revalidate in the background.
    headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' },
  }
}
