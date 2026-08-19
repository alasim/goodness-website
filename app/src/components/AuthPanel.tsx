import { useState } from 'react'
import { getSupabase } from '../lib/supabase'
import { Banner } from './ui'

/**
 * Real authentication, used whenever Supabase is configured. A magic link keeps the barrier at
 * "an email address you control" — the same 30-second promise the join flow makes.
 */
export function AuthPanel() {
  const [email, setEmail] = useState('')
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>(
    'idle',
  )
  const [message, setMessage] = useState('')

  const send = async (e: React.FormEvent) => {
    e.preventDefault()
    const client = getSupabase()
    if (!client) return
    setState('sending')
    const { error } = await client.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo:
          typeof window !== 'undefined'
            ? `${window.location.origin}/me`
            : undefined,
      },
    })
    if (error) {
      setState('error')
      setMessage(error.message)
    } else {
      setState('sent')
    }
  }

  return (
    <div className="gs-card gs-card--flat gs-stack">
      <p className="gs-eyebrow">Sign in</p>
      <h3 style={{ fontSize: 20 }}>Your Goodness Passport</h3>
      <p className="gs-small gs-muted">
        Sign in with your email and we will send you a link. Your hours,
        credentials and giving stay attached to you, not to a device.
      </p>
      {state === 'sent' ? (
        <Banner>
          Check your inbox — the link signs you straight into this page.
        </Banner>
      ) : (
        <form
          className="gs-row"
          style={{ gap: 8 }}
          onSubmit={(e) => void send(e)}
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            aria-label="Email address"
            style={{ flex: 1, minWidth: 200 }}
          />
          <button
            type="submit"
            className="gs-btn gs-btn--primary"
            disabled={state === 'sending'}
          >
            {state === 'sending' ? 'Sending…' : 'Send link'}
          </button>
        </form>
      )}
      {state === 'error' ? <Banner variant="warn">{message}</Banner> : null}
    </div>
  )
}

export function SignOutButton() {
  return (
    <button
      type="button"
      className="gs-btn gs-btn--ghost gs-btn--sm"
      onClick={() => void getSupabase()?.auth.signOut()}
    >
      Sign out
    </button>
  )
}
