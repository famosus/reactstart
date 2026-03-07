import type { SubmissionFilter } from '@/features/admin/types'

export const submissionFilters: Array<{ label: string; value: SubmissionFilter }> = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Approved', value: 'approved' },
  { label: 'Rejected', value: 'rejected' },
]
