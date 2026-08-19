import { createFileRoute } from '@tanstack/react-router'
import { Placeholder } from '../components/Placeholder'

export const Route = createFileRoute('/studio')({
  component: () => (
    <Placeholder
      title="Share Studio"
      note="Evidence-backed cards worth sharing."
    />
  ),
})
