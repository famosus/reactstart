type TagBadgeProps = {
  label: string
}

export function TagBadge({ label }: TagBadgeProps) {
  return (
    <span className="rounded-full border border-slate-200 bg-slate-100/70 px-2.5 py-1 text-xs font-medium text-slate-600">
      {label}
    </span>
  )
}
