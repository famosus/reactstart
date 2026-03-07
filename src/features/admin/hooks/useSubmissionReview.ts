import { useCallback, useEffect, useMemo, useState } from 'react'

import { getSubmissionsForReview, updateSubmissionStatus } from '@/lib/adminReview'
import type { SubmissionReview } from '@/types/admin'
import type { SubmissionStatus } from '@/types/project'

import type { SubmissionFilter, SubmissionLoadState } from '@/features/admin/types'
import {
  calculateSubmissionStats,
  emptySubmissionStats,
} from '@/features/admin/utils/submissionStats'

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }

  return 'Unexpected submissions error.'
}

export function useSubmissionReview(enabled: boolean) {
  const [filter, setFilter] = useState<SubmissionFilter>('pending')
  const [submissions, setSubmissions] = useState<SubmissionReview[]>([])
  const [stats, setStats] = useState(emptySubmissionStats)
  const [state, setState] = useState<SubmissionLoadState>('idle')
  const [error, setError] = useState<string | null>(null)
  const [activeSubmissionId, setActiveSubmissionId] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (!enabled) {
      return
    }

    setState('loading')
    setError(null)

    try {
      const [filteredData, allData] = await Promise.all([
        getSubmissionsForReview({ status: filter }),
        getSubmissionsForReview({ status: 'all' }),
      ])

      setSubmissions(filteredData)
      setStats(calculateSubmissionStats(allData))
      setState('ready')
    } catch (loadError) {
      setError(getErrorMessage(loadError))
      setState('error')
    }
  }, [enabled, filter])

  useEffect(() => {
    if (!enabled) {
      setSubmissions([])
      setStats(emptySubmissionStats)
      setState('idle')
      setError(null)
      setActiveSubmissionId(null)
      return
    }

    void load()
  }, [enabled, load])

  const changeStatus = useCallback(
    async (submissionId: string, status: SubmissionStatus) => {
      if (!enabled) {
        return
      }

      setActiveSubmissionId(submissionId)
      setError(null)

      try {
        await updateSubmissionStatus({ submissionId, status })
        await load()
      } catch (actionError) {
        setError(getErrorMessage(actionError))
      } finally {
        setActiveSubmissionId(null)
      }
    },
    [enabled, load],
  )

  return useMemo(
    () => ({
      filter,
      setFilter,
      submissions,
      stats,
      state,
      isLoading: state === 'loading',
      error,
      activeSubmissionId,
      refresh: load,
      changeStatus,
    }),
    [
      filter,
      submissions,
      stats,
      state,
      error,
      activeSubmissionId,
      load,
      changeStatus,
    ],
  )
}
