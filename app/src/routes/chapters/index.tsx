import { createFileRoute } from '@tanstack/react-router'
import { Placeholder } from '../../components/Placeholder'

export const Route = createFileRoute('/chapters/')({
  component: () => (
    <Placeholder
      title="Chapters"
      note="The network — district, university and community chapters."
    />
  ),
})
