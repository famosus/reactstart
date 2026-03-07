import {
  AdminLoginForm,
  AdminTopBar,
  ProjectEditModal,
  SubmissionFilters,
  SubmissionReviewList,
  SubmissionStatsGrid,
} from '@/features/admin/components'
import { useAdminSession, useProjectEditor, useSubmissionReview } from '@/features/admin/hooks'

export function AdminPage() {
  const { status, session, error, isSubmitting, isAuthenticated, signIn, signOut, refresh } =
    useAdminSession()

  const review = useSubmissionReview(isAuthenticated)
  const projectEditor = useProjectEditor({ onSaved: review.refresh })

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50 text-slate-900">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-gradient-to-br from-sky-100/70 via-white to-slate-100/70 blur-3xl" />
      </div>

      <main className="relative mx-auto w-full max-w-6xl space-y-6 px-6 py-8 sm:py-10">
        <AdminTopBar
          userEmail={session?.user.email}
          onSignOut={signOut}
          isBusy={isSubmitting || review.activeSubmissionId !== null}
          showSignOut={Boolean(session)}
        />

        {status === 'checking' ? (
          <section className="rounded-2xl border border-slate-200/80 bg-white/80 p-8 text-sm text-slate-600">
            Checking admin session...
          </section>
        ) : null}

        {status === 'signed_out' || status === 'error' ? (
          <AdminLoginForm onSubmit={signIn} isSubmitting={isSubmitting} error={error} />
        ) : null}

        {status === 'forbidden' ? (
          <section className="space-y-4 rounded-2xl border border-amber-200 bg-amber-50/70 p-6">
            <h2 className="text-lg font-medium text-amber-900">Access denied</h2>
            <p className="text-sm text-amber-800">{error ?? 'This account is not configured as an admin.'}</p>
            <button
              type="button"
              onClick={() => void signOut()}
              className="inline-flex items-center rounded-full border border-amber-300 bg-white px-4 py-2 text-sm font-medium text-amber-800 transition hover:bg-amber-100"
            >
              Return to login
            </button>
          </section>
        ) : null}

        {status === 'authenticated' ? (
          <section className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200/80 bg-white/75 p-4">
              <SubmissionFilters
                activeFilter={review.filter}
                onFilterChange={review.setFilter}
                stats={review.stats}
              />
              <button
                type="button"
                onClick={() => {
                  void Promise.all([refresh(), review.refresh()])
                }}
                disabled={review.isLoading || isSubmitting}
                className="inline-flex items-center rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Refresh
              </button>
            </div>

            <SubmissionStatsGrid stats={review.stats} />

            <SubmissionReviewList
              submissions={review.submissions}
              isLoading={review.isLoading}
              error={review.error}
              activeSubmissionId={review.activeSubmissionId}
              activeEditSubmissionId={projectEditor.activeSubmissionId}
              onRetry={review.refresh}
              onStatusChange={review.changeStatus}
              onEditProject={projectEditor.openEditor}
            />
          </section>
        ) : null}
      </main>

      <ProjectEditModal
        isOpen={projectEditor.isOpen}
        isLoading={projectEditor.isLoading}
        isSaving={projectEditor.isSaving}
        error={projectEditor.error}
        form={projectEditor.form}
        onClose={projectEditor.closeEditor}
        onSave={projectEditor.saveEditor}
        onFieldChange={projectEditor.updateField}
        onFeaturedChange={projectEditor.setFeatured}
      />
    </div>
  )
}
