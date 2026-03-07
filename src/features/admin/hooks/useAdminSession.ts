import { useCallback, useEffect, useMemo, useState } from 'react'
import type { Session } from '@supabase/supabase-js'

import type { AdminCredentials } from '@/lib/adminAuth'
import {
  isCurrentUserAdmin,
  onAdminAuthStateChange,
  signInAdminWithPassword,
  signOutAdmin,
} from '@/lib/adminAuth'
import { getSupabaseClient } from '@/lib/supabase'

import type { AdminAuthStatus } from '@/features/admin/types'

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }

  return 'Unexpected authentication error.'
}

export function useAdminSession() {
  const [status, setStatus] = useState<AdminAuthStatus>('checking')
  const [session, setSession] = useState<Session | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const resolveSession = useCallback(async (sessionCandidate: Session | null) => {
    setSession(sessionCandidate)

    if (!sessionCandidate) {
      setStatus('signed_out')
      setError(null)
      return
    }

    try {
      const isAdmin = await isCurrentUserAdmin()
      if (isAdmin) {
        setStatus('authenticated')
        setError(null)
        return
      }

      setStatus('forbidden')
      setError('This account can sign in but is not on the admin allowlist.')
    } catch (authError) {
      setStatus('error')
      setError(getErrorMessage(authError))
    }
  }, [])

  const refresh = useCallback(async () => {
    setStatus('checking')

    try {
      const client = getSupabaseClient()
      const {
        data: { session: currentSession },
        error: sessionError,
      } = await client.auth.getSession()

      if (sessionError) {
        throw sessionError
      }

      await resolveSession(currentSession)
    } catch (refreshError) {
      setStatus('error')
      setError(getErrorMessage(refreshError))
      setSession(null)
    }
  }, [resolveSession])

  useEffect(() => {
    let mounted = true

    async function bootstrap() {
      try {
        const client = getSupabaseClient()
        const {
          data: { session: currentSession },
          error: sessionError,
        } = await client.auth.getSession()

        if (sessionError) {
          throw sessionError
        }

        if (!mounted) {
          return
        }

        await resolveSession(currentSession)
      } catch (bootstrapError) {
        if (!mounted) {
          return
        }

        setStatus('error')
        setError(getErrorMessage(bootstrapError))
        setSession(null)
      }
    }

    void bootstrap()

    let unsubscribe: (() => void) | null = null

    try {
      const { data } = onAdminAuthStateChange((_event, nextSession) => {
        if (!mounted) {
          return
        }

        void resolveSession(nextSession)
      })

      unsubscribe = () => {
        data.subscription.unsubscribe()
      }
    } catch (subscriptionError) {
      if (mounted) {
        setStatus('error')
        setError(getErrorMessage(subscriptionError))
      }
    }

    return () => {
      mounted = false
      unsubscribe?.()
    }
  }, [resolveSession])

  const signIn = useCallback(
    async (credentials: AdminCredentials) => {
      setIsSubmitting(true)
      setError(null)

      try {
        const nextSession = await signInAdminWithPassword(credentials)
        setSession(nextSession)
        setStatus('authenticated')
      } catch (signInError) {
        setSession(null)
        setStatus('signed_out')
        setError(getErrorMessage(signInError))
      } finally {
        setIsSubmitting(false)
      }
    },
    [],
  )

  const signOut = useCallback(async () => {
    setIsSubmitting(true)

    try {
      await signOutAdmin()
      setSession(null)
      setStatus('signed_out')
      setError(null)
    } catch (signOutError) {
      setError(getErrorMessage(signOutError))
    } finally {
      setIsSubmitting(false)
    }
  }, [])

  return useMemo(
    () => ({
      status,
      session,
      error,
      isSubmitting,
      isAuthenticated: status === 'authenticated',
      signIn,
      signOut,
      refresh,
    }),
    [status, session, error, isSubmitting, signIn, signOut, refresh],
  )
}
