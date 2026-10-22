// Browser fallback for Codeforces rating history. The Codeforces API allows
// cross-origin requests, so when /api/cp-stats comes back without Codeforces
// (its servers sometimes reject cloud IPs) the page fetches it directly.
// Mirrors codeforces() in server/cp-stats.js.

const HANDLE = 'cleancode08'

export async function fetchCodeforces(signal) {
  const response = await fetch(`https://codeforces.com/api/user.rating?handle=${HANDLE}`, { signal })
  if (!response.ok) throw new Error(`HTTP ${response.status}`)
  const json = await response.json()
  if (json.status !== 'OK' || !Array.isArray(json.result)) throw new Error('Unexpected Codeforces response')
  const history = json.result.map((entry) => ({
    date: entry.ratingUpdateTimeSeconds * 1000,
    rating: entry.newRating,
    contest: entry.contestName,
  }))
  const ratings = history.map((point) => point.rating)
  return {
    platform: 'Codeforces',
    handle: HANDLE,
    url: `https://codeforces.com/profile/${HANDLE}`,
    contests: history.length,
    currentRating: ratings.length ? ratings[ratings.length - 1] : null,
    maxRating: ratings.length ? Math.max(...ratings) : null,
    history,
  }
}
