import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { claimProfile } from '../data/actions'
import { hasSupabase } from '../lib/env'
import type { OSModel } from '../data/os'

const AVATAR_GRADIENTS: Record<string, string> = {
  green: 'linear-gradient(135deg, #4DC86A 0%, #1B7A34 100%)',
  blue: 'linear-gradient(135deg, #1976D2 0%, #1565C0 100%)',
  teal: 'linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%)',
}

/**
 * Sign-in-lite, built from the sign-in half of `My Goodness.dc.html`. The prototype lets a reviewer
 * step into any passport to try member flows; real authentication replaces it as soon as Supabase
 * is configured, so this only ever renders under the local driver.
 */
export function IdentityPicker({ os, note }: { os: OSModel; note?: string }) {
  const [query, setQuery] = useState('')
  const needle = query.trim().toLowerCase()
  const options = os.people
    .filter((p) => !needle || p.fullName.toLowerCase().includes(needle))
    .slice(0, 12)

  // With real accounts configured, a passport is never picked from a list — it is signed into.
  if (hasSupabase) {
    return (
      <div className="gs-signin-card">
        <div className="gs-signin-card__label">Sign in</div>
        <p
          style={{
            margin: '0 0 14px',
            fontSize: 13,
            color: 'var(--gs-ink-50)',
          }}
        >
          {note ?? 'Sign in to continue'} — your Goodness Passport is tied to
          your account, so hours, credentials and giving stay yours.
        </p>
        <Link to="/me" className="gs-btn gs-btn--primary gs-btn--sm">
          Go to sign in
        </Link>
      </div>
    )
  }

  return (
    <div className="gs-signin-card">
      <div className="gs-signin-card__label">{note ?? 'Sign in as'}</div>
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search your name…"
        aria-label="Search your name"
        className="gs-signin-card__search"
      />
      <div className="gs-signin-card__list">
        {options.map((person) => (
          <button
            key={person.id}
            type="button"
            className="gs-signin-option"
            onClick={() => claimProfile(person.slug)}
          >
            <span
              className="gs-mark"
              style={{
                width: 36,
                height: 36,
                fontSize: 12,
                background:
                  AVATAR_GRADIENTS[person.avatarColor] ??
                  AVATAR_GRADIENTS.green!,
              }}
            >
              {person.initials}
            </span>
            <span style={{ flex: 1, minWidth: 0 }}>
              <span style={{ display: 'block', fontSize: 14, fontWeight: 700 }}>
                {person.fullName}
              </span>
              <span
                style={{
                  display: 'block',
                  fontSize: 11,
                  color: 'var(--gs-ink-40)',
                }}
              >
                {person.roleTitle} · {person.goodnessId}
              </span>
            </span>
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: 'var(--gs-green-deep)',
              }}
            >
              Sign in →
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
