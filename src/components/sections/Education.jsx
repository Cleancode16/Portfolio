import { useRef } from 'react'
import { ArrowUpRight, Award, GraduationCap } from 'lucide-react'
import SectionHeading from '../ui/SectionHeading'
import BentoCard from '../about/BentoCard'
import { EDUCATION_ILLUSTRATIONS as ILL } from '../education/illustrations'
import { certifications, education } from '../../data/profile'
import { useScrollReveal } from '../../hooks/useScrollReveal'

const [degree, intermediate, school] = education
const [smartCoder, dsaCourse] = certifications

const EDUCATION_CARDS = [
  { key: 'degree', Illustration: ILL.Campus, title: degree.school, subtitle: degree.degree, meta: degree.period, result: degree.result },
  { key: 'intermediate', Illustration: ILL.Mpc, title: intermediate.school, subtitle: intermediate.degree, meta: intermediate.period, result: intermediate.result },
  { key: 'school', Illustration: ILL.Book, title: school.school, subtitle: school.degree, meta: school.period, result: school.result },
]

const CERTIFICATION_CARDS = [
  { key: 'smart-coder', Illustration: ILL.SmartCoder, title: smartCoder.title, subtitle: smartCoder.issuer, meta: smartCoder.year, url: smartCoder.url },
  { key: 'dsa', Illustration: ILL.DsaCourse, title: dsaCourse.title, subtitle: dsaCourse.issuer, url: dsaCourse.url },
]

function Group({ icon: Icon, title, cards }) {
  return (
    <div>
      <h3 className="flex items-center gap-2.5 text-headline text-ink" data-reveal>
        <Icon aria-hidden="true" className="h-6 w-6 text-accent" strokeWidth={1.75} />
        {title}
      </h3>
      {/* Square bento cards; data-reveal on the wrapper keeps the entrance transform off the hover lift. */}
      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
        {cards.map(({ key, Illustration, title: cardTitle, subtitle, meta, result, url }) => (
          <li key={key} data-reveal>
            <BentoCard Illustration={Illustration} square>
              <h4 className="text-[1.0625rem] font-semibold leading-snug tracking-tight text-ink">{cardTitle}</h4>
              <p className="mt-1 text-[0.9375rem] text-muted">{subtitle}</p>
              {(meta || result) && (
                <div className="mt-3 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  {meta && <span className="font-mono text-[0.75rem] text-muted">{meta}</span>}
                  {result && <span className="text-[0.9375rem] font-semibold text-ink">{result}</span>}
                </div>
              )}
              {url && (
                <a href={url} target="_blank" rel="noopener noreferrer" className="link-arrow mt-4 text-[0.9375rem]">
                  View certificate
                  <ArrowUpRight aria-hidden="true" className="h-4 w-4" strokeWidth={2} />
                  <span className="sr-only"> for {cardTitle} (opens in a new tab)</span>
                </a>
              )}
            </BentoCard>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function Education() {
  const scope = useRef(null)
  useScrollReveal(scope)

  return (
    <section id="education" ref={scope} aria-labelledby="education-title" className="section-pad">
      <div className="shell">
        <SectionHeading
          id="education-title"
          align="center"
          eyebrow="Education & certifications"
          title="Academics and certifications."
        />
        <div className="mt-16 space-y-20 sm:mt-20">
          <Group icon={GraduationCap} title="Education" cards={EDUCATION_CARDS} />
          <Group icon={Award} title="Certifications" cards={CERTIFICATION_CARDS} />
        </div>
      </div>
    </section>
  )
}
