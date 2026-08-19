import { createFileRoute } from '@tanstack/react-router'
import { Placeholder } from '../../components/Placeholder'

export const Route = createFileRoute('/people/')({
  component: () => (
    <Placeholder title="People" note="The volunteers behind the work." />
  ),
})
