import { Moon, Sun } from 'lucide-react'
import { useThemeToggle } from '../../hooks/useThemeToggle'

export default function ThemeToggle() {
  const [theme, toggleTheme] = useThemeToggle()
  const isDark = theme === 'dark'
  const label = isDark ? 'Switch to light theme' : 'Switch to dark theme'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      className="relative grid h-9 w-9 place-items-center rounded-full text-ink/80 transition duration-300 ease-apple hover:bg-ink/[0.06] hover:text-ink"
    >
      <Sun
        aria-hidden="true"
        className={`absolute h-[18px] w-[18px] transition-[transform,opacity] duration-300 ease-apple ${
          isDark ? 'rotate-90 scale-50 opacity-0' : 'rotate-0 scale-100 opacity-100'
        }`}
        strokeWidth={1.75}
      />
      <Moon
        aria-hidden="true"
        className={`absolute h-[17px] w-[17px] transition-[transform,opacity] duration-300 ease-apple ${
          isDark ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-50 opacity-0'
        }`}
        strokeWidth={1.75}
      />
    </button>
  )
}
