import { createFileRoute } from '@tanstack/react-router'
import { Placeholder } from '../../components/Placeholder'

export const Route = createFileRoute('/chapters/start')({
  component: () => (
    <Placeholder
      title="Start a chapter"
      note="Bring Goodness Society to your city."
    />
  ),
})
