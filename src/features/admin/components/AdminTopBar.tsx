type AdminTopBarProps = {
  userEmail?: string
  onSignOut: () => Promise<void>
  isBusy: boolean
  showSignOut?: boolean
}

export function AdminTopBar({ userEmail, onSignOut, isBusy, showSignOut = false }: AdminTopBarProps) {
  return (
    <header className="flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white/80 p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">ReactStart</p>
        <h1 className="mt-2 text-xl font-medium tracking-tight text-slate-900 sm:text-2xl">
          Admin Review Gateway
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Review community submissions and approve what gets listed publicly.
        </p>
      </div>

      {showSignOut ? (
        <div className="flex items-center gap-3">
          {userEmail ? <p className="text-xs text-slate-500 sm:text-sm">{userEmail}</p> : null}
          <button
            type="button"
            onClick={() => void onSignOut()}
            disabled={isBusy}
            className="inline-flex items-center rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Sign out
          </button>
        </div>
      ) : null}
    </header>
  )
}
