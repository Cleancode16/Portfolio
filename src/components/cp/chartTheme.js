import { useMemo } from 'react'
import { useRecoilValue } from 'recoil'
import { themeState } from '../../state/ui'

// Restrained per-platform accents, tuned for at least 3:1 contrast against each theme's panel.
export const PLATFORM_COLORS = {
  light: { LeetCode: '#c27803', CodeChef: '#8a6a52', Codeforces: '#1a6fc4' },
  dark: { LeetCode: '#f2a93b', CodeChef: '#c4a185', Codeforces: '#4ea3ef' },
}

// Recharts writes colors into SVG attributes, where CSS variables are unreliable,
// so the theme tokens are resolved to concrete rgb() strings for the active theme.
export function useChartTheme() {
  const theme = useRecoilValue(themeState)
  return useMemo(() => {
    const styles = getComputedStyle(document.documentElement)
    const token = (name, alpha = 1) => `rgb(${styles.getPropertyValue(`--${name}`).trim()} / ${alpha})`
    return {
      theme,
      ink: token('ink'),
      muted: token('muted'),
      grid: token('line', 0.6),
      cursor: token('ink', 0.04),
      surface: token('surface'),
      platforms: PLATFORM_COLORS[theme] ?? PLATFORM_COLORS.light,
    }
  }, [theme])
}
