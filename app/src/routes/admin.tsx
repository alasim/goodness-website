import { createFileRoute } from '@tanstack/react-router'
import { Placeholder } from '../components/Placeholder'

export const Route = createFileRoute('/admin')({
  component: () => (
    <Placeholder title="Mission Control" note="The command centre." />
  ),
})
