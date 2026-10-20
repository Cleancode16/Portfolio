import { useRef } from 'react'
import SectionHeading from '../ui/SectionHeading'
import BentoCard from '../about/BentoCard'
import { ILLUSTRATIONS } from '../about/illustrations'
import { aboutCards } from '../../data/profile'
import { useScrollReveal } from '../../hooks/useScrollReveal'

export default function About() {
  const scope = useRef(null)
  useScrollReveal(scope)

  return (
    <section id="about" ref={scope} aria-labelledby="about-title" className="section-pad border-t border-line/60">
      <div className="shell">
        <SectionHeading
          id="about-title"
          align="center"
          eyebrow="About"
          title="How I think. How I build."
          intro="From first principles to reliable systems, I turn complex problems into thoughtful software."
        />

        {/* data-reveal sits on the wrapper so GSAP's entrance transform never fights the card's hover lift. */}
        <ul className="mt-16 grid gap-4 sm:mt-20 md:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {aboutCards.map((card) => (
            <li key={card.title} data-reveal>
              <BentoCard Illustration={ILLUSTRATIONS[card.illustration]} title={card.title} text={card.text} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
