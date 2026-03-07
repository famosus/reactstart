import type { SubmissionStats } from '@/features/admin/types'
import type { SubmissionReview } from '@/types/admin'

export const emptySubmissionStats: SubmissionStats = {
  total: 0,
  pending: 0,
  approved: 0,
  rejected: 0,
}

export function calculateSubmissionStats(submissions: SubmissionReview[]): SubmissionStats {
  return submissions.reduce<SubmissionStats>(
    (acc, submission) => {
      acc.total += 1
      acc[submission.status] += 1
      return acc
    },
    { ...emptySubmissionStats },
  )
}
