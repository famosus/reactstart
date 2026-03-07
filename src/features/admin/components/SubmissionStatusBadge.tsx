import type { SubmissionStatus } from '@/types/project'

type SubmissionStatusBadgeProps = {
  status: SubmissionStatus
}

const statusStyles: Record<SubmissionStatus, string> = {
  pending: 'border-amber-200 bg-amber-50 text-amber-700',
  approved: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  rejected: 'border-rose-200 bg-rose-50 text-rose-700',
}

export function SubmissionStatusBadge({ status }: SubmissionStatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium capitalize ${statusStyles[status]}`}
    >
      {status}
    </span>
  )
}
