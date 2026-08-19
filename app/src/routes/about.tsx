import { createFileRoute } from '@tanstack/react-router'
import { Placeholder } from '../components/Placeholder'

export const Route = createFileRoute('/about')({
  component: () => (
    <Placeholder
      title="About"
      note="Our story, mandate and how Goodness Society is governed."
    />
  ),
})
