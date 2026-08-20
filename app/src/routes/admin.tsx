import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { useOS } from '../hooks/useOS'
import type { ReactNode } from 'react'
import { useCurrentPerson } from '../hooks/useCurrentPerson'
import { LoadingState } from '../components/LoadingState'
import { IdentityPicker } from '../components/IdentityPicker'
import { AuthPanel } from '../components/AuthPanel'
import { Banner, Section } from '../components/ui'
import { hasSupabase } from '../lib/env'
import { AdminCommand } from '../components/admin/AdminCommand'
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

  const counts = {
    volunteers: os.stats.volunteers,
    applications: os.data.applications.filter((a) => a.status === 'pending')
      .length,
    missions: os.stats.liveMissions,
    attendance: os.data.assignments.filter((a) => a.state === 'submitted')
      .length,
    impact: os.impact.filter((r) => !r.published).length,
    money: os.finance.expenses.filter((e) => e.status === 'pending').length,
    partners: os.activePartners.length,
    network: os.formingChapters.length,
  }

  return (
    <div className="gs-mc">
      <aside className="gs-mc__rail">
        <Link to="/" className="gs-mc__brand">
          <span className="gs-mc__mark">G</span>
          <span>
            <span className="gs-mc__brandname">Mission Control</span>
            <span className="gs-mc__brandsub">Goodness OS</span>
          </span>
        </Link>

        <nav className="gs-mc__nav">
          <RailGroup label="Command">
            <RailButton
              label="Overview"
              active={tab === 'overview'}
              onClick={() => go('overview')}
            />
          </RailGroup>

          <RailGroup label="People">
            <RailButton
              label="Volunteers"
              badge={String(counts.volunteers)}
              active={tab === 'people'}
              onClick={() => go('people')}
            />
            <RailButton
              label="Applications"
              badge={String(counts.applications)}
              warn={counts.applications > 0}
              active={tab === 'applications'}
              onClick={() => go('applications')}
            />
          </RailGroup>

          <RailGroup label="Operations">
            <RailButton
              label="Missions"
              badge={String(counts.missions)}
              active={tab === 'missions'}
              onClick={() => go('missions')}
            />
            <RailButton
              label="Attendance"
              badge={String(counts.attendance)}
              warn={counts.attendance > 0}
              active={tab === 'attendance'}
              onClick={() => go('attendance')}
            />
            <RailButton
              label="Impact"
              badge={counts.impact ? `${counts.impact} draft` : 'Clear'}
              warn={counts.impact > 0}
              active={tab === 'impact'}
              onClick={() => go('impact')}
            />
          </RailGroup>

          <RailGroup label="Finance">
            <RailButton
              label="Money & approvals"
              badge={counts.money ? String(counts.money) : 'Clear'}
              warn={counts.money > 0}
              active={tab === 'money'}
              onClick={() => go('money')}
            />
            <RailLink to="/trust" label="Public Trust Ledger" />
          </RailGroup>

          <RailGroup label="Growth">
            <RailButton
              label="Partners"
              badge={String(counts.partners)}
              active={tab === 'partners'}
              onClick={() => go('partners')}
            />
            <RailButton
              label="Network"
              badge={counts.network ? `${counts.network} forming` : 'Stable'}
              active={tab === 'network'}
              onClick={() => go('network')}
            />
          </RailGroup>

          <RailGroup label="Trust">
            <RailLink to="/verify" label="Verify a credential" />
            <RailButton
              label="Audit Log"
              badge="Live"
              active={tab === 'audit'}
              onClick={() => go('audit')}
            />
          </RailGroup>
        </nav>

        <div className="gs-mc__who">
          <span className="gs-mc__whomark">
            {person ? person.initials : 'AD'}
          </span>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>
              {person ? person.fullName.split(' ')[0] : 'Admin'}
            </div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>
              {hasSupabase
                ? (roles[0] ?? 'operations').replace(/_/g, ' ')
                : 'Prototype access'}
            </div>
          </div>
        </div>
      </aside>

      <main className="gs-mc__main">
        {!person && !hasSupabase ? (
          <div style={{ maxWidth: 620, marginBottom: 24 }}>
            <IdentityPicker
              os={os}
              note="Act as a member (optional in prototype mode)"
            />
          </div>
        ) : null}

        {tab === 'overview' ? <AdminCommand os={os} onGo={go} /> : null}
        {tab === 'people' ? <AdminPeople os={os} /> : null}
        {tab === 'applications' ? <AdminApplications os={os} /> : null}
        {tab === 'missions' ? <AdminMissions os={os} /> : null}
        {tab === 'attendance' ? <AdminAttendance os={os} /> : null}
        {tab === 'impact' ? <AdminImpact os={os} /> : null}
        {tab === 'money' ? <AdminMoney os={os} /> : null}
        {tab === 'partners' ? <AdminPartners os={os} /> : null}
        {tab === 'network' ? <AdminNetwork os={os} /> : null}
        {tab === 'audit' ? <AdminAudit os={os} /> : null}
      </main>
    </div>
  )
}

/** A labelled block of rail buttons, as the design groups them. */
function RailGroup({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <div>
      <div className="gs-mc__grouplabel">{label}</div>
      {children}
    </div>
  )
}

function RailButton({
  label,
  badge,
  warn,
  active,
  onClick,
}: {
  label: string
  badge?: string
  warn?: boolean
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      className="gs-mc__navbtn"
      aria-current={active ? 'page' : undefined}
      onClick={onClick}
    >
      {label}
      {badge ? (
        <span className={`gs-mc__badge ${warn ? 'gs-mc__badge--warn' : ''}`}>
          {badge}
        </span>
      ) : null}
    </button>
  )
}

function RailLink({ to, label }: { to: string; label: string }) {
  return (
    <Link to={to} className="gs-mc__navlink">
      {label}
      <span style={{ marginLeft: 'auto', fontSize: 12 }}>↗</span>
    </Link>
  )
}
