import { createFileRoute } from '@tanstack/react-router'
import { Section } from '../components/ui'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  return (
    <Section>
      <p className="gs-eyebrow">Goodness Society</p>
      <h1>Goodness, organized.</h1>
      <p className="gs-lede" style={{ maxWidth: 620, marginTop: 16 }}>
        The full home experience lands in phase P3, once the data layer is live.
      </p>
    </Section>
  )
}
