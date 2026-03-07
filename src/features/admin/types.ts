import type { SubmissionStatus } from '@/types/project'

export type AdminAuthStatus =
  | 'checking'
  | 'signed_out'
  | 'authenticated'
  | 'forbidden'
  | 'error'

export type SubmissionFilter = SubmissionStatus | 'all'

export type SubmissionLoadState = 'idle' | 'loading' | 'ready' | 'error'

export type SubmissionStats = {
  total: number
  pending: number
  approved: number
  rejected: number
}
