/**
 * Driver selection. Supabase when it is configured, the seeded local record otherwise —
 * both return the identical `Dataset`, so nothing above this line knows which one is live.
 */
import { hasSupabase } from '../lib/env'
import { getSupabase } from '../lib/supabase'
import { applyOverlay, baseDataset, readOverlay } from './local'
import { loadSupabaseDataset } from './supabase-driver'
import type { Dataset } from '../lib/types'

export async function loadDataset(
  options: { withOverlay?: boolean } = {},
): Promise<Dataset> {
  if (hasSupabase) {
    const client = getSupabase()
    if (client) return loadSupabaseDataset(client)
  }
  const base = baseDataset()
  // The first render (server and hydration) deliberately ignores the browser overlay so that
  // server and client markup agree; the overlay is folded in immediately after mount.
  return options.withOverlay ? applyOverlay(base, readOverlay()) : base
}
