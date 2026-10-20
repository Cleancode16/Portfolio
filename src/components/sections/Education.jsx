import { useRef } from 'react'
import SectionHeading from '../ui/SectionHeading'
import BentoCard from '../about/BentoCard'
import { EDUCATION_ILLUSTRATIONS as ILL } from '../education/illustrations'
import { certifications, education } from '../../data/profile'
import { useScrollReveal } from '../../hooks/useScrollReveal'

const [degree, intermediate, school] = education
const [smartCoder, dsaCourse] = certifications

// Bento layout: the degree spans two columns, then intermediate; second row holds
// high school and both certifications (3 → 2 → 1 columns).
const cards = [
  {
    key: 'degree',
    Illustration: ILL.Degree,
    span: 'md:col-span-2',
    kind: 'Education',
    title: degree.school,
    subtitle: degree.degree,
    meta: degree.period,
    result: degree.result,
  },
  {
    key: 'intermediate',
    Illustration: ILL.Intermediate,
    kind: 'Education',
    title: intermediate.school,
    subtitle: intermediate.degree,
    meta: intermediate.period,
    result: intermediate.result,
  },
  {
    key: 'school',
    Illustration: ILL.HighSchool,
    kind: 'Education',
    title: school.school,
    subtitle: school.degree,
    meta: school.period,
    result: school.result,
  },
  {
    key: 'smart-coder',
    Illustration: ILL.SmartCoder,
    kind: 'Certification',
    title: smartCoder.title,
    subtitle: smartCoder.issuer,
    meta: smartCoder.year,
  },
  {
    key: 'dsa',
    Illustration: ILL.DsaCourse,
    kind: 'Certification',
    title: dsaCourse.title,
    subtitle: dsaCourse.issuer,
  },
]

export default function Education() {
  const scope = useRef(null)
  useScrollReveal(scope)

  return (
    <section id="education" ref={scope} aria-labelledby="education-title" className="section-pad border-t border-line/60">
      <div className="shell">
        <SectionHeading
          id="education-title"
          align="center"
          eyebrow="Education & certifications"
          title="Academics and certifications."
        />

        {/* data-reveal on the wrapper keeps the entrance transform separate from the card's hover lift. */}
        <ul className="mt-16 grid gap-4 sm:mt-20 md:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {cards.map(({ key, Illustration, span = '', kind, title, subtitle, meta, result }) => (
            <li key={key} className={span} data-reveal>
              <BentoCard Illustration={Illustration}>
                <p className="eyebrow text-[0.6875rem]">{kind}</p>
                <h3 className="mt-2 text-[1.0625rem] font-semibold leading-snug tracking-tight text-ink">{title}</h3>
                <p className="mt-1 text-[0.9375rem] text-muted">{subtitle}</p>
                {(meta || result) && (
                  <div className="mt-auto flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 pt-4">
                    {meta && <span className="font-mono text-[0.75rem] text-muted">{meta}</span>}
                    {result && <span className="text-[0.9375rem] font-semibold text-ink">{result}</span>}
                  </div>
                )}
              </BentoCard>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
