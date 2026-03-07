import type { AuthChangeEvent, Session } from '@supabase/supabase-js'

import { getSupabaseClient } from '@/lib/supabase'

export type AdminCredentials = {
  email: string
  password: string
}

const NOT_ADMIN_MESSAGE = 'Access denied. This account is not configured as an admin user.'

export async function isCurrentUserAdmin(): Promise<boolean> {
  const client = getSupabaseClient()
  const { data, error } = await client.rpc('is_admin')

  if (error) {
    throw error
  }

  return data === true
}

export async function signInAdminWithPassword({
  email,
  password,
}: AdminCredentials): Promise<Session> {
  const client = getSupabaseClient()
  const { data, error } = await client.auth.signInWithPassword({
    email: email.trim(),
    password,
  })

  if (error) {
    throw error
  }

  if (!data.session) {
    throw new Error('Admin login did not return an active session.')
  }

  const isAdmin = await isCurrentUserAdmin()
  if (!isAdmin) {
    await client.auth.signOut()
    throw new Error(NOT_ADMIN_MESSAGE)
  }

  return data.session
}

export async function requireAdminSession(): Promise<Session> {
  const client = getSupabaseClient()
  const {
    data: { session },
    error,
  } = await client.auth.getSession()

  if (error) {
    throw error
  }

  if (!session) {
    throw new Error('Admin authentication required.')
  }

  const isAdmin = await isCurrentUserAdmin()
  if (!isAdmin) {
    throw new Error(NOT_ADMIN_MESSAGE)
  }

  return session
}

export async function signOutAdmin(): Promise<void> {
  const client = getSupabaseClient()
  const { error } = await client.auth.signOut()

  if (error) {
    throw error
  }
}

export function onAdminAuthStateChange(
  callback: (event: AuthChangeEvent, session: Session | null) => void,
) {
  const client = getSupabaseClient()
  return client.auth.onAuthStateChange(callback)
}
