/**
 * Runtime configuration. With no Supabase credentials the app runs on the seeded local driver,
 * which is deliberate: the product must be demonstrable before a backend exists.
 */
const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export const supabaseUrl = url && url.length > 0 ? url : null
export const supabaseAnonKey = anonKey && anonKey.length > 0 ? anonKey : null
export const hasSupabase = Boolean(supabaseUrl && supabaseAnonKey)
export const driverName = hasSupabase ? 'supabase' : 'local'
