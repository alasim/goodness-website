import { createClient } from '@supabase/supabase-js'
import type { SupabaseClient } from '@supabase/supabase-js'
import { hasSupabase, supabaseAnonKey, supabaseUrl } from './env'

let client: SupabaseClient | null = null

/** Null when the app is running on the local driver — every caller must handle that. */
export function getSupabase(): SupabaseClient | null {
  if (!hasSupabase) return null
  if (!client) {
    client = createClient(supabaseUrl as string, supabaseAnonKey as string, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  }
  return client
}
