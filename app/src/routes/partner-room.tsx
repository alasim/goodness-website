import { createFileRoute } from '@tanstack/react-router'
import { Placeholder } from '../components/Placeholder'

export const Route = createFileRoute('/partner-room')({
  component: () => (
    <Placeholder title="Partner Room" note="Your partnership dashboard." />
  ),
})
