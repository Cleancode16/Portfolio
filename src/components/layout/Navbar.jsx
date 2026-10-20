import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { Command, Menu, X } from 'lucide-react'
import { sections } from '../../data/navigation'
import { activeSectionState, commandPaletteState, mobileMenuState } from '../../state/ui'
import { gsap, prefersReducedMotion } from '../../lib/motion'
import ThemeToggle from './ThemeToggle'

const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent)

export default function Navbar() {
  const active = useRecoilValue(activeSectionState)
  const [menuOpen, setMenuOpen] = useRecoilState(mobileMenuState)
  const setPaletteOpen = useSetRecoilState(commandPaletteState)
  const [scrolled, setScrolled] = useState(false)
  const listRef = useRef(null)
  const pillRef = useRef(null)
  const menuButtonRef = useRef(null)
  const sheetRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Slide the active-section pill under the current desktop link.
  useLayoutEffect(() => {
    const list = listRef.current
    const pill = pillRef.current
    if (!list || !pill) return undefined

    const place = (animate) => {
      const link = list.querySelector(`[data-section="${active}"]`)
      if (!link || link.offsetWidth === 0) {
        gsap.set(pill, { opacity: 0 })
        return
      }
      const vars = { x: link.offsetLeft, width: link.offsetWidth, opacity: 1 }
      if (animate && !prefersReducedMotion()) gsap.to(pill, { ...vars, duration: 0.35, ease: 'power3.out', overwrite: true })
      else gsap.set(pill, vars)
    }

    place(true)
    const onResize = () => place(false)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [active])

  // Mobile sheet: close on Escape, move focus into it when opened.
  useEffect(() => {
    if (!menuOpen) return undefined
    const sheet = sheetRef.current
    sheet?.querySelector('a')?.focus()
    const items = sheet ? sheet.querySelectorAll('li') : []
    if (items.length && !prefersReducedMotion()) {
      gsap.fromTo(
        items,
        { opacity: 0, y: -6 },
        { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out', stagger: 0.03, overwrite: true },
      )
    }
    const onKey = (event) => {
      if (event.key === 'Escape') {
        setMenuOpen(false)
        menuButtonRef.current?.focus()
      }
    }
    const onResize = () => window.innerWidth >= 1280 && setMenuOpen(false)
    window.addEventListener('keydown', onKey)
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('resize', onResize)
    }
  }, [menuOpen, setMenuOpen])

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4">
      <nav
        aria-label="Primary"
        className={`glass pointer-events-auto mx-auto max-w-shell rounded-2xl transition-shadow duration-300 ease-apple ${
          scrolled || menuOpen ? 'shadow-soft' : 'shadow-none'
        }`}
      >
        <div className="flex h-14 items-center justify-between gap-3 pl-4 pr-2 sm:pl-5">
          <a
            href="#home"
            className="flex items-center gap-2 text-[0.9375rem] font-semibold tracking-tight text-ink"
            onClick={() => setMenuOpen(false)}
          >
            <span
              aria-hidden="true"
              className="grid h-7 w-7 place-items-center rounded-lg bg-ink font-mono text-[0.6875rem] font-semibold text-canvas"
            >
              DB
            </span>
            <span>
              Devasani <span className="text-muted">Bharath</span>
            </span>
          </a>

          <ul ref={listRef} className="relative hidden items-center xl:flex">
            <li
              ref={pillRef}
              aria-hidden="true"
              className="pointer-events-none absolute left-0 top-0 h-full rounded-full bg-ink/[0.07] opacity-0"
            />
            {sections.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  data-section={section.id}
                  aria-current={active === section.id ? 'true' : undefined}
                  className={`block rounded-full px-3 py-1.5 text-[0.8125rem] transition-colors duration-300 ${
                    active === section.id ? 'text-ink' : 'text-muted hover:text-ink'
                  }`}
                >
                  {section.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setPaletteOpen(true)}
              aria-label="Open command menu"
              aria-keyshortcuts={isMac ? 'Meta+K' : 'Control+K'}
              title={`Command menu (${isMac ? '⌘' : 'Ctrl'} K)`}
              className="hidden h-9 items-center gap-1.5 rounded-full px-3 text-[0.75rem] text-muted transition duration-300 hover:bg-ink/[0.06] hover:text-ink sm:inline-flex"
            >
              <Command aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={1.75} />
              <span className="font-mono">K</span>
            </button>
            <ThemeToggle />
            <button
              ref={menuButtonRef}
              type="button"
              className="grid h-9 w-9 place-items-center rounded-full text-ink/80 transition hover:bg-ink/[0.06] hover:text-ink xl:hidden"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? (
                <X aria-hidden="true" className="h-5 w-5" strokeWidth={1.75} />
              ) : (
                <Menu aria-hidden="true" className="h-5 w-5" strokeWidth={1.75} />
              )}
            </button>
          </div>
        </div>

        <div
          id="mobile-menu"
          ref={sheetRef}
          className={`grid transition-[grid-template-rows] duration-[400ms] ease-apple xl:hidden ${
            menuOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
          }`}
          inert={menuOpen ? undefined : ''}
        >
          <div className="overflow-hidden">
            <ul className="border-t border-line/60 px-2 pb-3 pt-2">
              {sections.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    onClick={() => setMenuOpen(false)}
                    aria-current={active === section.id ? 'true' : undefined}
                    className={`flex items-center justify-between rounded-xl px-3 py-3 text-[1.0625rem] transition-colors ${
                      active === section.id ? 'bg-ink/[0.06] text-ink' : 'text-ink/80 hover:bg-ink/[0.04]'
                    }`}
                  >
                    {section.label}
                    {active === section.id && <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent" />}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  )
}
