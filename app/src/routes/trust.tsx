import { createFileRoute } from '@tanstack/react-router'
import { Placeholder } from '../components/Placeholder'

export const Route = createFileRoute('/trust')({
  component: () => (
    <Placeholder
      title="Trust Ledger"
      note="Money received, allocated and spent — line by line."
    />
  ),
})
