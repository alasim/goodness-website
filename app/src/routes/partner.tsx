import { createFileRoute } from '@tanstack/react-router'
import { Placeholder } from '../components/Placeholder'

export const Route = createFileRoute('/partner')({
  component: () => (
    <Placeholder
      title="Partner with us"
      note="Turn funding into participation."
    />
  ),
})
