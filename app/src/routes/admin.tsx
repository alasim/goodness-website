import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useOS } from '../hooks/useOS'
import { useCurrentPerson } from '../hooks/useCurrentPerson'
import { LoadingState } from '../components/LoadingState'
import { IdentityPicker } from '../components/IdentityPicker'
import { AuthPanel } from '../components/AuthPanel'
import { Banner, Section } from '../components/ui'
import { hasSupabase } from '../lib/env'
import { AdminOverview } from '../components/admin/AdminOverview'
import { AdminApplications, AdminPeople } from '../components/admin/AdminPeople'
import {
  AdminAttendance,
  AdminImpact,
  AdminMissions,
} from '../components/admin/AdminOperations'
import { AdminMoney } from '../components/admin/AdminMoney'
import {
  AdminAudit,
  AdminNetwork,
  AdminPartners,
} from '../components/admin/AdminNetwork'

const TABS = [
  { id: 'overview', label: 'Command' },
  { id: 'people', label: 'People' },
  { id: 'applications', label: 'Applications' },
  { id: 'missions', label: 'Missions' },
  { id: 'attendance', label: 'Attendance' },
  { id: 'impact', label: 'Impact' },
  { id: 'money', label: 'Money & approvals' },
  { id: 'partners', label: 'Partners' },
  { id: 'network', label: 'Network' },
  { id: 'audit', label: 'Audit' },
] as const

type TabId = (typeof TABS)[number]['id']

export const Route = createFileRoute('/admin')({
  validateSearch: (search: Record<string, unknown>) => ({
    tab: (TABS.some((t) => t.id === search.tab)
      ? (search.tab as TabId)
      : 'overview') satisfies TabId,
  }),
  head: () => ({
    meta: [
      { title: 'Mission Control — Goodness Society' },
      { name: 'robots', content: 'noindex' },
    ],
  }),
  component: MissionControl,
})

function MissionControl() {
  const { tab } = Route.useSearch()
  const navigate = useNavigate({ from: '/admin' })
  const { os } = useOS()
  const { person, loading } = useCurrentPerson()

  if (!os || loading) return <LoadingState />

  // With a backend live, the database decides: these role checks mirror the RLS policies so the
  // interface never offers an action the server would refuse.
  const roles = person
    ? os.data.memberRoles
        .filter((r) => r.profileId === person.id)
        .map((r) => r.role)
    : []
  const isStaff =
    !hasSupabase ||
    roles.some((role) =>
      [
        'hq_admin',
        'super_admin',
        'program_lead',
        'finance_lead',
        'partnerships_lead',
        'chapter_lead',
        'team_lead',
      ].includes(role),
    )

  if (hasSupabase && !person) {
    return (
      <Section>
        <p className="gs-eyebrow">Mission Control</p>
        <h1 style={{ marginBottom: 16 }}>Sign in to continue</h1>
        <div style={{ maxWidth: 520 }}>
          <AuthPanel />
        </div>
      </Section>
    )
  }

  if (!isStaff) {
    return (
      <Section>
        <p className="gs-eyebrow">Mission Control</p>
        <h1 style={{ marginBottom: 16 }}>This is the command centre</h1>
        <Banner variant="warn">
          Your account does not carry an operations role. Ask an administrator
          to grant one — and note that the database enforces this too, not just
          this page.
        </Banner>
      </Section>
    )
  }

  const go = (next: string) => void navigate({ search: { tab: next as TabId } })

  return (
    <>
      <section style={{ paddingTop: 34 }}>
        <div className="gs-wrap gs-stack" style={{ gap: 12 }}>
          <div className="gs-row gs-row--between">
            <div className="gs-stack" style={{ gap: 4 }}>
              <p className="gs-eyebrow">Mission Control</p>
              <h1 style={{ fontSize: 'clamp(26px, 3.4vw, 38px)' }}>
                What’s happening right now
              </h1>
            </div>
            {!hasSupabase ? (
              <span className="gs-pill gs-pill--amber">
                Prototype mode — no backend, full access
              </span>
            ) : (
              <span className="gs-pill gs-pill--green">
                {roles.join(', ') || 'operations'}
              </span>
            )}
          </div>

          <div className="gs-tabs" role="tablist">
            {TABS.map((item) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={tab === item.id}
                className={`gs-tab ${tab === item.id ? 'is-active' : ''}`}
                onClick={() => go(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <Section tight>
        {!person && !hasSupabase ? (
          <div style={{ maxWidth: 620, marginBottom: 24 }}>
            <IdentityPicker
              os={os}
              note="Act as a member (optional in prototype mode)"
            />
          </div>
        ) : null}

        {tab === 'overview' ? <AdminOverview os={os} onGo={go} /> : null}
        {tab === 'people' ? <AdminPeople os={os} /> : null}
        {tab === 'applications' ? <AdminApplications os={os} /> : null}
        {tab === 'missions' ? <AdminMissions os={os} /> : null}
        {tab === 'attendance' ? <AdminAttendance os={os} /> : null}
        {tab === 'impact' ? <AdminImpact os={os} /> : null}
        {tab === 'money' ? <AdminMoney os={os} /> : null}
        {tab === 'partners' ? <AdminPartners os={os} /> : null}
        {tab === 'network' ? <AdminNetwork os={os} /> : null}
        {tab === 'audit' ? <AdminAudit os={os} /> : null}
      </Section>
    </>
  )
}
