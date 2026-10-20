import { useRef } from 'react'
import { Briefcase, Users } from 'lucide-react'
import SectionHeading from '../ui/SectionHeading'
import { experience } from '../../data/profile'
import { useScrollReveal } from '../../hooks/useScrollReveal'

const KIND_ICON = { Work: Briefcase, Community: Users }

export default function Experience() {
  const scope = useRef(null)
  useScrollReveal(scope)

  return (
    <section id="experience" ref={scope} aria-labelledby="experience-title" className="section-pad border-t border-line/60">
      <div className="shell">
        <SectionHeading
          id="experience-title"
          eyebrow="Experience"
          title="Where I’ve worked and taught."
        />

        <ol className="mt-16">
          {experience.map((item) => {
            const Icon = KIND_ICON[item.kind]
            return (
              <li
                key={item.role}
                className="grid gap-4 border-t border-line/70 py-10 md:grid-cols-12 md:gap-8"
                data-reveal
              >
                <div className="md:col-span-4">
                  <p className="inline-flex items-center gap-2 font-mono text-[0.75rem] text-muted">
                    <Icon aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={1.75} />
                    {item.kind}
                  </p>
                  <p className="mt-2 text-[0.9375rem] text-muted">{item.period}</p>
                </div>
                <div className="md:col-span-8">
                  <h3 className="text-[1.375rem] tracking-tight text-ink">{item.role}</h3>
                  <p className="mt-1 text-[0.9375rem] text-muted">{item.org}</p>
                  <ul className="mt-5 space-y-2.5">
                    {item.points.map((point) => (
                      <li key={point} className="flex gap-3 leading-relaxed text-ink/80">
                        <span aria-hidden="true" className="mt-[0.7rem] h-1 w-1 flex-none rounded-full bg-accent" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                  <ul className="mt-5 flex flex-wrap gap-1.5" aria-label="Skills used">
                    {item.tags.map((tag) => (
                      <li key={tag} className="mono-chip">
                        {tag}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
