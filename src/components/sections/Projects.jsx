import { useRef } from 'react'
import { ArrowUpRight } from 'lucide-react'
import SectionHeading from '../ui/SectionHeading'
import ProjectRow from '../projects/ProjectRow'
import { projects } from '../../data/projects'
import { profile } from '../../data/profile'
import { useScrollReveal } from '../../hooks/useScrollReveal'

const featured = projects.filter((project) => project.featured)
const more = projects.filter((project) => !project.featured)

export default function Projects() {
  const scope = useRef(null)
  useScrollReveal(scope)

  return (
    <section id="projects" ref={scope} aria-labelledby="projects-title" className="section-pad">
      <div className="shell">
        <SectionHeading
          id="projects-title"
          eyebrow="Featured projects"
          title="Products I’ve designed and built."
          intro="Six projects across real-time systems, collaboration, AI-assisted applications and backend architecture. Open a case study for the problem, the approach and the engineering decisions."
        />
        <div className="mt-12 sm:mt-16">
          {featured.map((project, index) => (
            <ProjectRow key={project.id} project={project} index={index} />
          ))}
        </div>

        <div className="pt-16 sm:pt-20">
          <h3 className="text-headline text-ink" data-reveal>
            More projects
          </h3>
          {/* items-start: cards keep their natural height. */}
          <div className="mt-12 grid items-start gap-x-8 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
            {more.map((project, index) => (
              <ProjectRow key={project.id} project={project} index={featured.length + index} variant="compact" />
            ))}
          </div>
        </div>

        <div className="mt-16 pt-10">
          <a href={profile.github} target="_blank" rel="noreferrer" className="link-arrow">
            More on GitHub
            <ArrowUpRight aria-hidden="true" className="h-4 w-4" strokeWidth={2} />
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </div>
      </div>
    </section>
  )
}
