import { Section } from './ui'

export function LoadingState({
  label = 'Loading the record…',
}: {
  label?: string
}) {
  return (
    <Section>
      <p className="gs-muted">{label}</p>
    </Section>
  )
}

export function ErrorState({ error }: { error: Error }) {
  return (
    <Section>
      <div className="gs-banner gs-banner--warn">
        <strong>We could not load this from the record.</strong> {error.message}
      </div>
    </Section>
  )
}
