import { Section } from './ui'

export function Placeholder({ title, note }: { title: string; note: string }) {
  return (
    <Section>
      <p className="gs-eyebrow">Goodness OS</p>
      <h1>{title}</h1>
      <p className="gs-lede" style={{ maxWidth: 640, marginTop: 14 }}>
        {note}
      </p>
      <p className="gs-muted gs-small" style={{ marginTop: 24 }}>
        This surface is scaffolded — it is filled in by a later phase of the
        build plan.
      </p>
    </Section>
  )
}
