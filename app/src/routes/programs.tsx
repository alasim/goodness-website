import { createFileRoute } from '@tanstack/react-router'
import { Placeholder } from '../components/Placeholder'

export const Route = createFileRoute('/programs')({
  component: () => (
    <Placeholder
      title="Programs"
      note="Five areas of work, each with projects, missions and measured outcomes."
    />
  ),
})
