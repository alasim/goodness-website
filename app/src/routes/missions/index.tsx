import { createFileRoute } from '@tanstack/react-router'
import { Placeholder } from '../../components/Placeholder'

export const Route = createFileRoute('/missions/')({
  component: () => (
    <Placeholder
      title="Missions"
      note="Every open mission, live capacity and how to join."
    />
  ),
})
