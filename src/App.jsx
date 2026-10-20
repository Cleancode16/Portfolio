import Navbar from './components/layout/Navbar'
import CommandPalette from './components/layout/CommandPalette'
import BootIntro from './components/intro/BootIntro'
import GridBackground from './components/layout/GridBackground'
import Footer from './components/layout/Footer'
import Hero from './components/hero/Hero'
import About from './components/sections/About'
import Projects from './components/sections/Projects'
import Skills from './components/sections/Skills'
import Experience from './components/sections/Experience'
import Education from './components/sections/Education'
import CompetitiveProgramming from './components/sections/CompetitiveProgramming'
import Contact from './components/sections/Contact'
import { sectionIds } from './data/navigation'
import { useRef } from 'react'
import { useScrollSpy } from './hooks/useScrollSpy'
import { useScrollTriggerRefresh } from './hooks/useScrollTriggerRefresh'

export default function App() {
  const mainRef = useRef(null)
  useScrollSpy(sectionIds)
  useScrollTriggerRefresh(mainRef)

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-full focus:bg-surface focus:px-4 focus:py-2 focus:text-ink focus:shadow-lift"
      >
        Skip to content
      </a>
      <BootIntro />
      <GridBackground />
      <Navbar />
      <CommandPalette />
      <main id="main" ref={mainRef} tabIndex={-1} className="focus:outline-none">
        <Hero />
        <About />
        <Projects />
        <Skills />
        <Experience />
        <Education />
        <CompetitiveProgramming />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
