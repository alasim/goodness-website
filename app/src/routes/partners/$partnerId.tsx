import { createFileRoute } from '@tanstack/react-router'
import { Placeholder } from '../../components/Placeholder'

export const Route = createFileRoute('/partners/$partnerId')({
  component: () => (
    <Placeholder title="Partner" note="A public partner profile." />
  ),
})
