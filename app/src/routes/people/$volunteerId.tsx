import { createFileRoute } from '@tanstack/react-router'
import { Placeholder } from '../../components/Placeholder'

export const Route = createFileRoute('/people/$volunteerId')({
  component: () => (
    <Placeholder
      title="Goodness Passport"
      note="A volunteer's verified record."
    />
  ),
})
