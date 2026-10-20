export default function SectionHeading({ eyebrow, title, intro, id, align = 'start' }) {
  const centered = align === 'center'
  return (
    <header className={centered ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'}>
      <p className="eyebrow" data-reveal="soft">
        {eyebrow}
      </p>
      <h2 id={id} className="mt-4 text-title text-ink" data-reveal>
        {title}
      </h2>
      {intro && (
        <p
          className={`mt-6 max-w-prose text-lg leading-relaxed text-muted ${centered ? 'mx-auto' : ''}`}
          data-reveal="soft"
        >
          {intro}
        </p>
      )}
    </header>
  )
}
