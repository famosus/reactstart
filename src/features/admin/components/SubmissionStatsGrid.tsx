import type { SubmissionStats } from '@/features/admin/types'

type SubmissionStatsGridProps = {
  stats: SubmissionStats
}

export function SubmissionStatsGrid({ stats }: SubmissionStatsGridProps) {
  return (
    <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <article className="rounded-xl border border-slate-200/80 bg-white/80 p-4">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Total</p>
        <p className="mt-2 text-2xl font-semibold text-slate-900">{stats.total}</p>
      </article>
      <article className="rounded-xl border border-slate-200/80 bg-white/80 p-4">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Pending</p>
        <p className="mt-2 text-2xl font-semibold text-amber-700">{stats.pending}</p>
      </article>
      <article className="rounded-xl border border-slate-200/80 bg-white/80 p-4">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Approved</p>
        <p className="mt-2 text-2xl font-semibold text-emerald-700">{stats.approved}</p>
      </article>
      <article className="rounded-xl border border-slate-200/80 bg-white/80 p-4">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Rejected</p>
        <p className="mt-2 text-2xl font-semibold text-rose-700">{stats.rejected}</p>
      </article>
    </section>
  )
}
