import { useEffect, useState } from 'react'
import { hasSupabase } from '../lib/env'
import { getSupabase } from '../lib/supabase'
import { useClaimedProfileSlug, useOS } from './useOS'
import type { VolunteerView } from '../data/os'

/**
 * Who is using the product right now.
 *
 * With Supabase configured this is the authenticated user's profile. Without it, the prototype's
 * sign-in-lite applies: the visitor claims a passport and the session remembers it. Screens are
 * written against the resulting person, so they do not care which mode is live.
 */
export function useCurrentPerson(): {
  person: VolunteerView | null
  userId: string | null
  isSignedIn: boolean
  loading: boolean
} {
  const { os } = useOS()
  const claimedSlug = useClaimedProfileSlug()
  const [userId, setUserId] = useState<string | null>(null)
  const [profileId, setProfileId] = useState<string | null>(null)
  const [loading, setLoading] = useState(hasSupabase)

  useEffect(() => {
    if (!hasSupabase) return
    const client = getSupabase()
    if (!client) return
    let cancelled = false
    void client.auth.getUser().then(({ data }) => {
      if (!cancelled) {
        setUserId(data.user?.id ?? null)
        setLoading(false)
      }
    })
    const { data: sub } = client.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user.id ?? null)
    })
    return () => {
      cancelled = true
      sub.subscription.unsubscribe()
    }
  }, [])

  // The public passport view deliberately carries no user_id, so the link between an account and
  // a passport is read from the profile row itself — which row level security only ever returns
  // to its owner (or to staff).
  useEffect(() => {
    if (!hasSupabase || !userId) {
      setProfileId(null)
      return
    }
    const client = getSupabase()
    if (!client) return
    let cancelled = false
    void client
      .from('profiles')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle()
      .then(({ data }) => {
        if (!cancelled) setProfileId(data?.id ?? null)
      })
    return () => {
      cancelled = true
    }
  }, [userId])

  if (!os) return { person: null, userId, isSignedIn: false, loading }

  const person = hasSupabase
    ? profileId
      ? (os.personById.get(profileId) ?? null)
      : null
    : claimedSlug
      ? (os.personBySlug.get(claimedSlug) ?? null)
      : null

  return { person, userId, isSignedIn: Boolean(person), loading }
}
