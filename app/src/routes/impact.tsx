import { createFileRoute } from '@tanstack/react-router'
import { Placeholder } from '../components/Placeholder'

export const Route = createFileRoute('/impact')({
  component: () => (
    <Placeholder
      title="Impact"
      note="What we delivered and what changed, with evidence."
    />
  ),
})
