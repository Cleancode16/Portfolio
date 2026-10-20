import { ArrowUp, ArrowUpRight } from 'lucide-react'
import { profile } from '../../data/profile'
import { sections } from '../../data/navigation'

export default function Footer() {
  return (
    <footer className="border-t border-line/60">
      <div className="shell flex flex-col gap-10 py-12 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm">
          <p className="text-[0.9375rem] font-semibold tracking-tight text-ink">{profile.name}</p>
          <p className="mt-2 text-[0.875rem] leading-relaxed text-muted">
            Full-stack developer and Computer Science student in {profile.location}.
          </p>
        </div>

        <nav aria-label="Footer" className="grid grid-cols-2 gap-x-10 gap-y-2.5 text-[0.875rem] sm:grid-cols-3">
          {sections.map((section) => (
            <a key={section.id} href={`#${section.id}`} className="text-muted transition hover:text-ink">
              {section.label}
            </a>
          ))}
          <a
            href={profile.github}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-muted transition hover:text-ink"
          >
            GitHub
            <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={1.75} />
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </nav>
      </div>

      <div className="shell flex flex-col gap-3 border-t border-line/60 py-6 text-[0.8125rem] text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} {profile.name}. Built with React, Tailwind CSS, Recoil and GSAP.
        </p>
        <a href="#home" className="inline-flex items-center gap-1.5 transition hover:text-ink">
          <ArrowUp aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={1.75} />
          Back to top
        </a>
      </div>
    </footer>
  )
}
