import { submissionFilters } from '@/features/admin/constants'
import type { SubmissionFilter, SubmissionStats } from '@/features/admin/types'

type SubmissionFiltersProps = {
  activeFilter: SubmissionFilter
  onFilterChange: (value: SubmissionFilter) => void
  stats: SubmissionStats
}

function getFilterCount(filter: SubmissionFilter, stats: SubmissionStats): number {
  if (filter === 'all') {
    return stats.total
  }

  return stats[filter]
}

export function SubmissionFilters({
  activeFilter,
  onFilterChange,
  stats,
}: SubmissionFiltersProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {submissionFilters.map((filter) => {
        const isActive = filter.value === activeFilter
        const count = getFilterCount(filter.value, stats)

        return (
          <button
            key={filter.value}
            type="button"
            onClick={() => onFilterChange(filter.value)}
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition ${
              isActive
                ? 'border-slate-900 bg-slate-900 text-white'
                : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-100'
            }`}
          >
            <span>{filter.label}</span>
            <span className="text-xs opacity-80">{count}</span>
          </button>
        )
      })}
    </div>
  )
}
