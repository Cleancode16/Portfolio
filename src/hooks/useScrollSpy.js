import { useEffect } from 'react'
import { useSetRecoilState } from 'recoil'
import { activeSectionState } from '../state/ui'

/** Tracks which section crosses the upper-middle band of the viewport. */
export function useScrollSpy(ids) {
  const setActive = useSetRecoilState(activeSectionState)
  const key = ids.join('|')

  useEffect(() => {
    const sections = key
      .split('|')
      .map((id) => document.getElementById(id))
      .filter(Boolean)
    if (sections.length === 0) return undefined

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting)
        if (visible.length > 0) setActive(visible[0].target.id)
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: 0 },
    )
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [key, setActive])
}
