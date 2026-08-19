import { createFileRoute } from '@tanstack/react-router'
import { Placeholder } from '../components/Placeholder'

export const Route = createFileRoute('/fund')({
  component: () => (
    <Placeholder
      title="Fund Impact"
      note="Fund an initiative — pooled contributions, reported collectively."
    />
  ),
})
