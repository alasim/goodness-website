import { useState } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { useOS } from '../hooks/useOS'
import { LoadingState } from '../components/LoadingState'
import { PageHero } from '../components/PageHero'
import { Banner, Section } from '../components/ui'
import { submitApplication } from '../data/actions'

export const Route = createFileRoute('/join')({
  head: () => ({
    meta: [
      { title: 'Join as a volunteer — Goodness Society' },
      {
        name: 'description',
        content:
          'Thirty seconds to start. Tell us what you can do and where, and we will match you to a real mission.',
      },
    ],
  }),
  component: Join,
})

function Join() {
  const { os } = useOS()
  const [sent, setSent] = useState(false)
  const [busy, setBusy] = useState(false)

  if (!os) return <LoadingState />

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    setBusy(true)
    try {
      await submitApplication({
        fullName: String(form.get('fullName') ?? ''),
        email: String(form.get('email') ?? '') || null,
        phone: String(form.get('phone') ?? '') || null,
        city: String(form.get('city') ?? '') || null,
        chapterId: String(form.get('chapterId') ?? '') || null,
        programSlug: String(form.get('programSlug') ?? '') || null,
        roleTitle: String(form.get('roleTitle') ?? '') || null,
        skills: String(form.get('skills') ?? '') || null,
        availability: String(form.get('availability') ?? '') || null,
        why: String(form.get('why') ?? '') || null,
        experience: String(form.get('experience') ?? '') || null,
      })
      setSent(true)
    } finally {
      setBusy(false)
    }
  }

  if (sent) {
    return (
      <Section>
        <p className="gs-eyebrow">Application received</p>
        <h1 style={{ marginBottom: 16 }}>
          Thank you — that is the hard part done
        </h1>
        <p className="gs-lede" style={{ maxWidth: 620 }}>
          A people lead reviews every application by hand. When you are approved
          you get a Goodness ID, a passport of your own, and a match to a
          mission that actually needs what you can do.
        </p>
        <div className="gs-row" style={{ marginTop: 22 }}>
          <Link to="/missions" className="gs-btn gs-btn--primary">
            See what is open now
          </Link>
          <Link to="/chapters" className="gs-btn gs-btn--ghost">
            Find your chapter
          </Link>
        </div>
      </Section>
    )
  }

  return (
    <>
      <PageHero
        eyebrow="Join"
        title="Thirty seconds to start"
        lede="One meaningful Saturday is how most of our team began. Tell us what you can do and where you are — we will match you to a mission that needs it."
      />

      <Section tight>
        <form
          className="gs-stack"
          style={{ gap: 16, maxWidth: 680 }}
          onSubmit={(e) => void submit(e)}
        >
          <div className="gs-grid gs-grid--2">
            <Field label="Full name" name="fullName" required />
            <Field label="Email" name="email" type="email" required />
            <Field label="Phone" name="phone" />
            <Field label="City" name="city" required />
          </div>

          <label className="gs-stack" style={{ gap: 6 }}>
            <span className="gs-small" style={{ fontWeight: 600 }}>
              Chapter
            </span>
            <select name="chapterId" defaultValue="">
              <option value="">I am not sure yet</option>
              {os.chapters.map((chapter) => (
                <option key={chapter.id} value={chapter.id}>
                  {chapter.name}
                </option>
              ))}
            </select>
          </label>

          <label className="gs-stack" style={{ gap: 6 }}>
            <span className="gs-small" style={{ fontWeight: 600 }}>
              Where would you like to contribute?
            </span>
            <select name="programSlug" defaultValue="">
              <option value="">Wherever I am most useful</option>
              {os.programs
                .filter((p) => !p.isOperations)
                .map((program) => (
                  <option key={program.slug} value={program.slug}>
                    {program.name}
                  </option>
                ))}
            </select>
          </label>

          <div className="gs-grid gs-grid--2">
            <Field
              label="What role suits you?"
              name="roleTitle"
              placeholder="Trainer, coach, photographer…"
            />
            <Field
              label="Availability"
              name="availability"
              placeholder="Weekends, evenings…"
            />
          </div>

          <Field
            label="Skills (comma separated)"
            name="skills"
            placeholder="Facilitation, Python, Photography"
          />

          <label className="gs-stack" style={{ gap: 6 }}>
            <span className="gs-small" style={{ fontWeight: 600 }}>
              Why do you want to volunteer?
            </span>
            <textarea name="why" rows={3} />
          </label>

          <label className="gs-stack" style={{ gap: 6 }}>
            <span className="gs-small" style={{ fontWeight: 600 }}>
              Any relevant experience
            </span>
            <textarea name="experience" rows={3} />
          </label>

          <Banner variant="info">
            Your phone number, email and address are used by our people team
            only. They never appear on your public passport — the public
            surfaces cannot read them at all.
          </Banner>

          <button
            type="submit"
            className="gs-btn gs-btn--primary"
            disabled={busy}
            style={{ alignSelf: 'flex-start' }}
          >
            {busy ? 'Sending…' : 'Send my application'}
          </button>
        </form>
      </Section>
    </>
  )
}

function Field({
  label,
  name,
  type = 'text',
  required,
  placeholder,
}: {
  label: string
  name: string
  type?: string
  required?: boolean
  placeholder?: string
}) {
  return (
    <label className="gs-stack" style={{ gap: 6 }}>
      <span className="gs-small" style={{ fontWeight: 600 }}>
        {label}
        {required ? ' *' : ''}
      </span>
      <input
        type={type}
        name={name}
        required={required}
        placeholder={placeholder}
      />
    </label>
  )
}
