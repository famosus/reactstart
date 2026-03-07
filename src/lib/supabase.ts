import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL ?? '').trim()
const supabasePublicKey = (
  import.meta.env.VITE_SUPABASE_ANON_KEY ??
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ??
  ''
).trim()
const hasValidHttpUrl = /^https?:\/\//.test(supabaseUrl)

export const isSupabaseConfigured = Boolean(hasValidHttpUrl && supabasePublicKey)

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabasePublicKey, {
      global: {
        headers: {
          apikey: supabasePublicKey,
          Authorization: `Bearer ${supabasePublicKey}`,
        },
      },
    })
  : null

export function getSupabaseClient(): SupabaseClient {
  if (!supabase) {
    const missing = [
      hasValidHttpUrl ? null : 'VITE_SUPABASE_URL (must start with http/https)',
      supabasePublicKey ? null : 'VITE_SUPABASE_ANON_KEY',
    ]
      .filter(Boolean)
      .join(', ')

    throw new Error(`Supabase is not configured. Missing/invalid: ${missing}.`)
  }

  return supabase
}
