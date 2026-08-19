import { createFileRoute } from '@tanstack/react-router'
import { Placeholder } from '../components/Placeholder'

export const Route = createFileRoute('/join')({
  component: () => (
    <Placeholder title="Join as a volunteer" note="Thirty seconds to start." />
  ),
})
