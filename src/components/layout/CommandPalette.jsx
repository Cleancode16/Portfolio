import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { ArrowUpRight, CornerDownLeft, FolderGit2, Hash, Moon, Search, Sun } from 'lucide-react'
import { sections } from '../../data/navigation'
import { projects } from '../../data/projects'
import { profile } from '../../data/profile'
import { commandPaletteState, mobileMenuState } from '../../state/ui'
import { useThemeToggle } from '../../hooks/useThemeToggle'
import { gsap, prefersReducedMotion } from '../../lib/motion'

function scrollToSection(id) {
  const target = document.getElementById(id)
  if (!target) return
  target.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' })
  window.history.replaceState(null, '', `#${id}`)
}

export default function CommandPalette() {
  const [open, setOpen] = useRecoilState(commandPaletteState)
  const setMenuOpen = useSetRecoilState(mobileMenuState)
  const [theme, toggleTheme] = useThemeToggle()
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef(null)
  const panelRef = useRef(null)
  const returnFocusRef = useRef(null)

  const commands = useMemo(
    () => [
      ...sections.map((section) => ({
        id: `go-${section.id}`,
        group: 'Go to',
        label: section.label,
        icon: Hash,
        run: () => scrollToSection(section.id),
      })),
      {
        id: 'toggle-theme',
        group: 'Actions',
        label: theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme',
        icon: theme === 'dark' ? Sun : Moon,
        run: toggleTheme,
      },
      {
        id: 'github',
        group: 'Actions',
        label: 'Open GitHub profile',
        icon: ArrowUpRight,
        run: () => window.open(profile.github, '_blank', 'noopener,noreferrer'),
      },
      ...projects.map((project) => ({
        id: `repo-${project.id}`,
        group: 'Source code',
        label: project.name,
        icon: FolderGit2,
        run: () => window.open(project.repo, '_blank', 'noopener,noreferrer'),
      })),
    ],
    [theme, toggleTheme],
  )

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    const matches = q
      ? commands.filter((command) => `${command.group} ${command.label}`.toLowerCase().includes(q))
      : commands
    return matches.map((command, index) => ({
      ...command,
      showGroup: index === 0 || matches[index - 1].group !== command.group,
    }))
  }, [commands, query])

  const close = useCallback(() => {
    setOpen(false)
    setQuery('')
    setActiveIndex(0)
  }, [setOpen])

  // Global shortcut: Cmd/Ctrl + K toggles the palette.
  useEffect(() => {
    const onKey = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setMenuOpen(false)
        setOpen((value) => !value)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [setOpen, setMenuOpen])

  // Escape closes the palette wherever focus is (not only in the search field).
  useEffect(() => {
    if (!open) return undefined
    const onKey = (event) => {
      if (event.key !== 'Escape') return
      event.preventDefault()
      close()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, close])

  // Focus management and scroll lock while open.
  useLayoutEffect(() => {
    if (!open) return undefined
    const panel = panelRef.current
    returnFocusRef.current = document.activeElement
    inputRef.current?.focus()
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    if (!prefersReducedMotion() && panel) {
      gsap.fromTo(
        panel,
        { opacity: 0, y: -8, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: 'power3.out' },
      )
    }
    return () => {
      document.body.style.overflow = previousOverflow
      if (panel) gsap.killTweensOf(panel)
      returnFocusRef.current?.focus?.()
    }
  }, [open])

  if (!open) return null

  const runCommand = (command) => {
    close()
    // Let the dialog unmount and focus return before acting.
    window.requestAnimationFrame(() => command.run())
  }

  const onKeyDown = (event) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActiveIndex((index) => (results.length ? (index + 1) % results.length : 0))
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveIndex((index) => (results.length ? (index - 1 + results.length) % results.length : 0))
    } else if (event.key === 'Enter') {
      event.preventDefault()
      if (results[activeIndex]) runCommand(results[activeIndex])
    } else if (event.key === 'Tab') {
      // The input is the only focus stop; options are chosen with the arrow keys.
      event.preventDefault()
    }
  }

  const activeId = results[activeIndex] ? `command-${results[activeIndex].id}` : undefined

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center px-4 pt-[12vh]">
      <div aria-hidden="true" className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" onClick={close} />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Command menu"
        className="glass relative w-full max-w-lg overflow-hidden rounded-2xl shadow-lift"
      >
        <div className="flex items-center gap-3 border-b border-line/60 px-4">
          <Search aria-hidden="true" className="h-4 w-4 flex-none text-muted" strokeWidth={1.75} />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value)
              setActiveIndex(0)
            }}
            onKeyDown={onKeyDown}
            role="combobox"
            aria-expanded="true"
            aria-controls="command-list"
            aria-activedescendant={activeId}
            aria-autocomplete="list"
            aria-label="Search sections and actions"
            placeholder="Jump to a section or action…"
            className="h-14 w-full bg-transparent text-[1rem] text-ink placeholder:text-subtle focus:outline-none"
          />
          <button
            type="button"
            onClick={close}
            aria-label="Close command menu"
            className="hidden flex-none rounded-md border border-line px-1.5 py-0.5 font-mono text-[0.6875rem] text-muted transition-colors hover:text-ink sm:block"
          >
            esc
          </button>
        </div>

        <ul id="command-list" role="listbox" aria-label="Commands" className="max-h-[min(24rem,60vh)] overflow-y-auto p-2">
          {results.length === 0 && <li className="px-3 py-8 text-center text-[0.9375rem] text-muted">No results</li>}
          {results.map((command, index) => {
            const Icon = command.icon
            const active = index === activeIndex
            return (
              <li key={command.id} role="presentation">
                {command.showGroup && (
                  <p role="presentation" className="px-3 pb-1.5 pt-3 font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-muted">
                    {command.group}
                  </p>
                )}
                <div
                  id={`command-${command.id}`}
                  role="option"
                  aria-selected={active}
                  onMouseMove={() => setActiveIndex(index)}
                  onClick={() => runCommand(command)}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-[0.9375rem] ${
                    active ? 'bg-ink/[0.07] text-ink' : 'text-ink/80'
                  }`}
                >
                  <Icon aria-hidden="true" className="h-4 w-4 flex-none text-muted" strokeWidth={1.75} />
                  <span className="flex-1 truncate">{command.label}</span>
                  {active && <CornerDownLeft aria-hidden="true" className="h-3.5 w-3.5 text-muted" strokeWidth={1.75} />}
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
