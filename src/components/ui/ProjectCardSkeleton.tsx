export function ProjectCardSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white/70 p-6 shadow-sm shadow-slate-200/40">
      <div className="space-y-4">
        <div className="h-5 w-32 rounded-full bg-slate-200" />
        <div className="h-3 w-full rounded-full bg-slate-100" />
        <div className="h-3 w-4/5 rounded-full bg-slate-100" />
        <div className="flex flex-wrap gap-2">
          <div className="h-6 w-16 rounded-full bg-slate-100" />
          <div className="h-6 w-20 rounded-full bg-slate-100" />
          <div className="h-6 w-14 rounded-full bg-slate-100" />
        </div>
      </div>
      <div className="mt-6 flex gap-3">
        <div className="h-8 w-24 rounded-full bg-slate-100" />
        <div className="h-8 w-20 rounded-full bg-slate-100" />
      </div>
    </div>
  )
}
