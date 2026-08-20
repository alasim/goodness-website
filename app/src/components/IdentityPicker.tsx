import { Link } from '@tanstack/react-router'
import { claimProfile } from '../data/actions'
import { hasSupabase } from '../lib/env'
import type { OSModel } from '../data/os'
import { Avatar } from './ui'

/**
 * Sign-in-lite. The prototype let a reviewer step into any passport to try member flows; that is
 * kept for the local driver and replaced by real authentication as soon as Supabase is configured.
 */
export function IdentityPicker({ os, note }: { os: OSModel; note?: string }) {
  if (hasSupabase) {
    return (
      <div className="gs-card gs-card--flat gs-stack">
        <p className="gs-eyebrow">Sign in</p>
        <h3 style={{ fontSize: 20 }}>{note ?? 'Sign in to continue'}</h3>
        <p className="gs-small gs-muted">
          Your Goodness Passport is tied to your account, so hours, credentials
          and giving stay yours.
        </p>
        <Link
          to="/me"
          className="gs-btn gs-btn--primary gs-btn--sm"
          style={{ alignSelf: 'flex-start' }}
        >
          Go to sign in
        </Link>
      </div>
    )
  }

  return (
    <div className="gs-card gs-card--flat gs-stack">
      <p className="gs-eyebrow">Sign in (prototype)</p>
      <h3 style={{ fontSize: 20 }}>{note ?? 'Continue as a member'}</h3>
      <p className="gs-small gs-muted">
        No backend is configured, so pick a passport to try the member
        experience. Everything you do is kept in this browser only.
      </p>
      <div className="gs-row" style={{ gap: 8, marginTop: 6 }}>
        {os.people.slice(0, 6).map((person) => (
          <button
            key={person.id}
            type="button"
            className="gs-chip"
            onClick={() => claimProfile(person.slug)}
            style={{ display: 'flex', alignItems: 'center', gap: 8 }}
          >
            <Avatar
              initials={person.initials}
              color={person.avatarColor}
              size="sm"
            />
            {person.fullName}
          </button>
        ))}
      </div>
    </div>
  )
}
