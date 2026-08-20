import { createFileRoute, redirect } from '@tanstack/react-router'

/**
 * The design has no separate start-a-chapter page — the form lives at the foot of Chapters
 * (`Chapters.dc.html#start`). This route keeps older links working.
 */
export const Route = createFileRoute('/chapters/start')({
  beforeLoad: () => {
    throw redirect({ to: '/chapters', hash: 'start' })
  },
})
