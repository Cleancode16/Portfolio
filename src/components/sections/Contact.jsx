import { useEffect, useRef, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { ArrowRight, CircleAlert, CircleCheck, LoaderCircle, LockKeyhole, RotateCcw, Send } from 'lucide-react'
import SectionHeading from '../ui/SectionHeading'
import { useScrollReveal } from '../../hooks/useScrollReveal'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)+$/
const REQUEST_TIMEOUT_MS = 20000

const rules = {
  name: {
    required: 'Please enter your name.',
    validate: (value) => value.trim().length >= 2 || 'Please enter your name.',
    maxLength: { value: 80, message: 'Please keep your name under 80 characters.' },
  },
  email: {
    required: 'Please enter your email address.',
    pattern: { value: EMAIL_PATTERN, message: 'Please enter a valid email address.' },
    maxLength: { value: 254, message: 'Please enter a valid email address.' },
  },
  subject: {
    maxLength: { value: 120, message: 'Please keep the subject under 120 characters.' },
  },
  message: {
    required: 'Please write a message.',
    validate: (value) => value.trim().length >= 10 || 'Please write at least 10 characters.',
    maxLength: { value: 5000, message: 'Please keep your message under 5000 characters.' },
  },
}

function Field({ id, label, optional, error, children, hint }) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <label htmlFor={id} className="text-[0.875rem] font-medium text-ink">
          {label}
        </label>
        {optional && <span className="text-[0.75rem] text-muted">Optional</span>}
        {hint}
      </div>
      <div className="mt-2">{children}</div>
      {error && (
        <p id={`${id}-error`} className="mt-2 flex items-center gap-1.5 text-[0.8125rem] text-danger">
          <CircleAlert aria-hidden="true" className="h-3.5 w-3.5 flex-none" strokeWidth={2} />
          {error}
        </p>
      )}
    </div>
  )
}

export default function Contact() {
  const scope = useRef(null)
  const startedAt = useRef(0)
  const successRef = useRef(null)
  const [status, setStatus] = useState('idle') // idle | submitting | success | error
  const [serverError, setServerError] = useState('')
  useScrollReveal(scope)

  const {
    register,
    handleSubmit,
    reset,
    setError,
    control,
    formState: { errors },
  } = useForm({
    mode: 'onTouched',
    defaultValues: { name: '', email: '', subject: '', message: '', website: '' },
  })

  useEffect(() => {
    startedAt.current = Date.now()
  }, [])

  useEffect(() => {
    if (status === 'success') successRef.current?.focus()
  }, [status])

  const messageLength = useWatch({ control, name: 'message' })?.length ?? 0

  const onSubmit = async (values) => {
    setStatus('submitting')
    setServerError('')
    const controller = new AbortController()
    const timer = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, elapsedMs: Date.now() - startedAt.current }),
        signal: controller.signal,
      })
      const result = await response.json().catch(() => null)

      if (response.ok && result?.ok) {
        setStatus('success')
        reset()
        return
      }
      if (result?.fields) {
        Object.entries(result.fields).forEach(([field, message]) => setError(field, { type: 'server', message }))
      }
      setServerError(result?.error || 'Something went wrong while sending your message. Please try again.')
      setStatus('error')
    } catch {
      setServerError('We could not reach the server. Check your connection and try again.')
      setStatus('error')
    } finally {
      window.clearTimeout(timer)
    }
  }

  const startOver = () => {
    startedAt.current = Date.now()
    setServerError('')
    setStatus('idle')
  }

  const fieldProps = (name) => ({
    id: `contact-${name}`,
    'aria-invalid': errors[name] ? 'true' : 'false',
    'aria-describedby': errors[name] ? `contact-${name}-error` : undefined,
    ...register(name, rules[name]),
  })

  const submitting = status === 'submitting'

  return (
    <section id="contact" ref={scope} aria-labelledby="contact-title" className="section-pad border-t border-line/60">
      <div className="shell grid gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <SectionHeading
            id="contact-title"
            eyebrow="Contact"
            title="Let’s build something together."
            intro="Have an opportunity, a project idea or a question about my work? Send a message and it will come straight to me. I’ll get back to you as soon as I can."
          />
          <ul className="mt-10 space-y-4 text-[0.9375rem] text-muted" data-reveal="soft">
            <li className="flex gap-3">
              <ArrowRight aria-hidden="true" className="mt-1 h-4 w-4 flex-none text-accent" strokeWidth={2} />
              Internships and full-time software engineering roles
            </li>
            <li className="flex gap-3">
              <ArrowRight aria-hidden="true" className="mt-1 h-4 w-4 flex-none text-accent" strokeWidth={2} />
              Full-stack and real-time web projects
            </li>
            <li className="flex gap-3">
              <ArrowRight aria-hidden="true" className="mt-1 h-4 w-4 flex-none text-accent" strokeWidth={2} />
              Hackathon teams and developer communities
            </li>
          </ul>
        </div>

        <div className="lg:col-span-7" data-reveal>
          <div className="rounded-4xl border border-line/70 bg-surface p-6 shadow-lift sm:p-10">
            {status === 'success' ? (
              <div className="flex min-h-[26rem] flex-col items-start justify-center" role="status">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-success/10">
                  <CircleCheck aria-hidden="true" className="h-6 w-6 text-success" strokeWidth={1.75} />
                </span>
                <h3 ref={successRef} tabIndex={-1} className="mt-6 text-headline text-ink focus:outline-none">
                  Message sent. Thank you!
                </h3>
                <p className="mt-3 max-w-prose text-muted">
                  Your message has been sent. I’ll reply to the email address you provided.
                </p>
                <button type="button" onClick={startOver} className="btn-secondary mt-8">
                  <RotateCcw aria-hidden="true" className="h-4 w-4" strokeWidth={2} />
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={(event) => handleSubmit(onSubmit)(event)} noValidate aria-describedby="contact-privacy" className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <Field id="contact-name" label="Full name" error={errors.name?.message}>
                    <input type="text" autoComplete="name" className="field" readOnly={submitting} {...fieldProps('name')} />
                  </Field>
                  <Field id="contact-email" label="Email" error={errors.email?.message}>
                    <input
                      type="email"
                      autoComplete="email"
                      inputMode="email"
                      spellCheck={false}
                      className="field"
                      readOnly={submitting}
                      {...fieldProps('email')}
                    />
                  </Field>
                </div>

                <Field id="contact-subject" label="Subject" optional error={errors.subject?.message}>
                  <input type="text" className="field" readOnly={submitting} {...fieldProps('subject')} />
                </Field>

                <Field
                  id="contact-message"
                  label="Message"
                  error={errors.message?.message}
                  hint={
                    <span className={`font-mono text-[0.75rem] ${messageLength > 5000 ? 'text-danger' : 'text-muted'}`}>
                      {messageLength}/5000
                    </span>
                  }
                >
                  <textarea rows={6} className="field min-h-[9rem] resize-y" readOnly={submitting} {...fieldProps('message')} />
                </Field>

                {/* Honeypot for bots: hidden from people and assistive technology. */}
                <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
                  <label htmlFor="contact-website">Website</label>
                  <input id="contact-website" type="text" tabIndex={-1} autoComplete="off" {...register('website')} />
                </div>

                {status === 'error' && serverError && (
                  <div
                    role="alert"
                    className="flex items-start gap-3 rounded-2xl border border-danger/30 bg-danger/[0.06] px-4 py-3 text-[0.9375rem] text-ink"
                  >
                    <CircleAlert aria-hidden="true" className="mt-0.5 h-4 w-4 flex-none text-danger" strokeWidth={2} />
                    <span>{serverError}</span>
                  </div>
                )}

                <div className="flex flex-col-reverse gap-4 pt-2 sm:flex-row sm:items-center sm:justify-between">
                  <p id="contact-privacy" className="flex items-center gap-2 text-[0.8125rem] text-muted">
                    <LockKeyhole aria-hidden="true" className="h-3.5 w-3.5 flex-none" strokeWidth={1.75} />
                    Your email is used only to reply to you.
                  </p>
                  <button type="submit" className="btn-primary disabled:cursor-not-allowed disabled:opacity-70" disabled={submitting}>
                    {submitting ? (
                      <>
                        <LoaderCircle aria-hidden="true" className="h-4 w-4 animate-spin" strokeWidth={2} />
                        Sending…
                      </>
                    ) : (
                      <>
                        {status === 'error' ? 'Try again' : 'Send message'}
                        <Send aria-hidden="true" className="h-4 w-4" strokeWidth={2} />
                      </>
                    )}
                  </button>
                </div>
                <p className="sr-only" aria-live="polite">
                  {submitting ? 'Sending your message.' : ''}
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
