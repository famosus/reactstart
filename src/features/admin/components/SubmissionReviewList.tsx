import type { SubmissionReview } from '@/types/admin'
import type { SubmissionStatus } from '@/types/project'

import { formatDateTime, formatProvider } from '@/features/admin/utils/formatters'

import { SubmissionStatusBadge } from '@/features/admin/components/SubmissionStatusBadge'

type SubmissionReviewListProps = {
  submissions: SubmissionReview[]
  isLoading: boolean
  error: string | null
  activeSubmissionId: string | null
  onRetry: () => Promise<void>
  onStatusChange: (submissionId: string, status: SubmissionStatus) => Promise<void>
}

export function SubmissionReviewList({
  submissions,
  isLoading,
  error,
  activeSubmissionId,
  onRetry,
  onStatusChange,
}: SubmissionReviewListProps) {
  if (isLoading) {
    return (
      <section className="rounded-2xl border border-slate-200/80 bg-white/80 p-8 text-sm text-slate-600">
        Loading submissions...
      </section>
    )
  }

  if (error) {
    return (
      <section className="space-y-4 rounded-2xl border border-rose-200 bg-rose-50/70 p-6">
        <p className="text-sm text-rose-700">{error}</p>
        <button
          type="button"
          onClick={() => void onRetry()}
          className="inline-flex items-center rounded-full border border-rose-300 bg-white px-4 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-100"
        >
          Try again
        </button>
      </section>
    )
  }

  if (!submissions.length) {
    return (
      <section className="rounded-2xl border border-slate-200/80 bg-white/80 p-8 text-sm text-slate-600">
        No submissions found for this filter.
      </section>
    )
  }

  return (
    <section className="space-y-4">
      {submissions.map((submission) => {
        const isUpdating = activeSubmissionId === submission.id
        const repositoryLabel = submission.repository
          ? `${submission.repository.owner}/${submission.repository.repoName}`
          : null

        return (
          <article
            key={submission.id}
            className="rounded-2xl border border-slate-200/80 bg-white/85 p-5 shadow-sm sm:p-6"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-medium text-slate-900">{submission.projectName}</h3>
                <p className="mt-1 text-sm text-slate-500">Submitted {formatDateTime(submission.createdAt)}</p>
              </div>
              <SubmissionStatusBadge status={submission.status} />
            </div>

            <p className="mt-4 text-sm leading-relaxed text-slate-700">{submission.description}</p>

            <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-600">
              <a
                href={submission.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="transition hover:text-slate-900"
              >
                GitHub Repo
              </a>

              {submission.demoUrl ? (
                <a
                  href={submission.demoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="transition hover:text-slate-900"
                >
                  Live Demo
                </a>
              ) : null}

              {submission.submitterEmail ? (
                <a
                  href={`mailto:${submission.submitterEmail}`}
                  className="transition hover:text-slate-900"
                >
                  {submission.submitterEmail}
                </a>
              ) : null}

              {submission.repository ? (
                <span className="text-slate-500">
                  {formatProvider(submission.repository.provider)}: {repositoryLabel}
                </span>
              ) : null}
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <button
                type="button"
                disabled={isUpdating || submission.status === 'approved'}
                onClick={() => void onStatusChange(submission.id, 'approved')}
                className="rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Approve
              </button>

              <button
                type="button"
                disabled={isUpdating || submission.status === 'rejected'}
                onClick={() => void onStatusChange(submission.id, 'rejected')}
                className="rounded-full border border-rose-300 bg-rose-50 px-3 py-1.5 text-xs font-medium text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Reject
              </button>

              <button
                type="button"
                disabled={isUpdating || submission.status === 'pending'}
                onClick={() => void onStatusChange(submission.id, 'pending')}
                className="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Mark Pending
              </button>
            </div>
          </article>
        )
      })}
    </section>
  )
}
