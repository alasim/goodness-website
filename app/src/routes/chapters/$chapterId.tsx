import { createFileRoute } from '@tanstack/react-router'
import { Placeholder } from '../../components/Placeholder'

export const Route = createFileRoute('/chapters/$chapterId')({
  component: () => (
    <Placeholder
      title="Chapter"
      note="A chapter's people, missions, impact and capital."
    />
  ),
})
