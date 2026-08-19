import { createFileRoute } from '@tanstack/react-router'
import { Placeholder } from '../../components/Placeholder'

export const Route = createFileRoute('/missions/$missionId')({
  component: () => (
    <Placeholder
      title="Mission"
      note="Mission detail, roles and contribution flow."
    />
  ),
})
