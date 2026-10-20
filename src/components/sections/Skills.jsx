import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import SectionHeading from '../ui/SectionHeading'
import Dock from '../skills/Dock'
import TechIcon from '../skills/TechIcon'
import { dockStack, skillGroups } from '../../data/profile'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { gsap, ScrollTrigger, prefersReducedMotion } from '../../lib/motion'

const FILTERS = [{ id: 'all', short: 'All' }, ...skillGroups]
const allItems = skillGroups.flatMap((group) => group.items)
const dockItems = dockStack.map((name) => allItems.find((item) => item.name === name)).filter(Boolean)

const tileIn = (targets) =>
  gsap.fromTo(
    targets,
    { opacity: 0, y: 14, scale: 0.94 },
    { opacity: 1, y: 0, scale: 1, duration: 0.55, ease: 'power3.out', stagger: 0.025, overwrite: true },
  )

export default function Skills() {
  const scope = useRef(null)
  const gridRef = useRef(null)
  const filterRef = useRef(null)
  const pillRef = useRef(null)
  const enteredRef = useRef(false)
  const [filter, setFilter] = useState('all')
  useScrollReveal(scope)

  const groups = useMemo(
    () => (filter === 'all' ? skillGroups : skillGroups.filter((group) => group.id === filter)),
    [filter],
  )

  // Launchpad entrance: tiles stagger in the first time the grid scrolls into view,
  // and again whenever the category filter changes.
  useLayoutEffect(() => {
    const grid = gridRef.current
    if (!grid || prefersReducedMotion()) return undefined
    const tiles = grid.querySelectorAll('[data-tile]')

    if (enteredRef.current) {
      const tween = tileIn(tiles)
      return () => tween.kill()
    }

    gsap.set(tiles, { opacity: 0, y: 14 })
    const trigger = ScrollTrigger.create({
      trigger: grid,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        enteredRef.current = true
        tileIn(grid.querySelectorAll('[data-tile]'))
      },
    })
    return () => trigger.kill()
  }, [filter])

  // Slide the segmented control's highlight to the active filter.
  useLayoutEffect(() => {
    const button = filterRef.current?.querySelector(`[data-filter="${filter}"]`)
    const pill = pillRef.current
    if (!button || !pill) return
    const vars = { x: button.offsetLeft, width: button.offsetWidth, opacity: 1 }
    if (prefersReducedMotion() || Number(gsap.getProperty(pill, 'opacity')) === 0) gsap.set(pill, vars)
    else gsap.to(pill, { ...vars, duration: 0.35, ease: 'power3.out', overwrite: true })
  }, [filter])

  return (
    <section id="skills" ref={scope} aria-labelledby="skills-title" className="section-pad border-t border-line/60">
      <div className="shell">
        <SectionHeading
          id="skills-title"
          eyebrow="Technical skills"
          title="The tools I reach for."
          intro="A practical toolkit for building complete web applications, grounded in core computer science."
        />

        <div className="mt-20" data-reveal>
          <Dock items={dockItems} />
        </div>

        <div className="mt-16 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" data-reveal="soft">
          <div
            ref={filterRef}
            role="group"
            aria-label="Filter technologies by category"
            className="glass relative mx-auto flex w-max gap-0.5 rounded-[10px] p-1"
          >
            <span
              ref={pillRef}
              aria-hidden="true"
              className="absolute left-0 top-1 h-[calc(100%-0.5rem)] rounded-[7px] bg-surface opacity-0 shadow-soft"
            />
            {FILTERS.map((item) => (
              <button
                key={item.id}
                type="button"
                data-filter={item.id}
                aria-pressed={filter === item.id}
                onClick={() => setFilter(item.id)}
                className={`relative whitespace-nowrap rounded-[7px] px-3.5 py-1.5 text-[0.8125rem] font-medium transition-colors duration-300 ${
                  filter === item.id ? 'text-ink' : 'text-muted hover:text-ink'
                }`}
              >
                {item.short}
              </button>
            ))}
          </div>
        </div>

        <div ref={gridRef} className="mt-12 space-y-12">
          {groups.map((group) => (
            <section key={group.id} aria-labelledby={`skills-${group.id}`}>
              <h3 id={`skills-${group.id}`} className="eyebrow flex items-center gap-3">
                {group.title}
                <span aria-hidden="true" className="h-px flex-1 bg-line/70" />
                <span className="font-mono normal-case tracking-normal">{group.items.length}</span>
              </h3>
              <ul className="mt-5 grid grid-cols-3 gap-x-2 gap-y-3 min-[420px]:grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8">
                {group.items.map((item) => (
                  <li key={item.name} data-tile>
                    <div className="group flex h-full flex-col items-center gap-2.5 rounded-2xl border border-transparent px-1.5 pb-3 pt-4 text-center transition-colors duration-300 ease-apple hover:border-line/70 hover:bg-surface/70">
                      <TechIcon
                        icon={item.icon}
                        className="h-14 w-14 transition-transform duration-300 ease-apple group-hover:-translate-y-0.5 group-hover:scale-[1.07] motion-reduce:group-hover:transform-none sm:h-16 sm:w-16"
                      />
                      <span className="text-[0.8125rem] leading-snug text-ink/85">{item.name}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </section>
  )
}
