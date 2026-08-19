import { createFileRoute } from '@tanstack/react-router'
import { Placeholder } from '../components/Placeholder'

export const Route = createFileRoute('/transparency')({
  component: () => (
    <Placeholder title="Transparency" note="The yearly summary." />
  ),
})
