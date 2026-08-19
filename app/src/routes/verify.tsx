import { createFileRoute } from '@tanstack/react-router'
import { Placeholder } from '../components/Placeholder'

export const Route = createFileRoute('/verify')({
  component: () => (
    <Placeholder
      title="Verify a credential"
      note="Enter a reference to check a certificate."
    />
  ),
})
