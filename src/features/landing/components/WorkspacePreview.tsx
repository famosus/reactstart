import { useWorkspacePreview } from '@/features/landing/hooks/useWorkspacePreview'

const terminalCommand = 'react start dev'
const statusLines = [
  'installing dependencies...',
  'starting dev server...',
  'workspace ready',
]

const fileTree = [
  { label: 'src', active: false, depth: 0 },
  { label: 'App.tsx', active: true, depth: 1 },
  { label: 'components', active: false, depth: 1 },
  { label: 'WorkspacePreview.tsx', active: false, depth: 2 },
  { label: 'package.json', active: false, depth: 0 },
]

const codeLines = [
  { indent: 0, width: 'w-24', tone: 'bg-slate-300' },
  { indent: 1, width: 'w-40', tone: 'bg-sky-200' },
  { indent: 1, width: 'w-52', tone: 'bg-slate-200' },
  { indent: 2, width: 'w-36', tone: 'bg-emerald-200' },
  { indent: 1, width: 'w-48', tone: 'bg-slate-200' },
  { indent: 0, width: 'w-20', tone: 'bg-slate-300' },
]

export function WorkspacePreview() {
  const { previewRef, typedText, visibleStatuses } = useWorkspacePreview(
    terminalCommand,
    statusLines.length,
  )

  return (
    <div
      ref={previewRef}
      className="overflow-hidden rounded-[1.9rem] border border-slate-200/80 bg-white/85 shadow-[0_24px_70px_-30px_rgba(15,23,42,0.24)] backdrop-blur-sm"
    >
      <div className="border-b border-slate-200/80 bg-white/90 px-5 py-3.5 sm:px-6">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-200" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-200" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-200" />
        </div>
      </div>

      <div className="grid gap-px bg-slate-200/80 lg:grid-cols-[240px_minmax(0,1fr)] lg:min-h-[31rem]">
        <aside className="bg-slate-50/90 p-5 sm:p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
            Project Files
          </p>
          <div className="mt-5 space-y-2.5">
            {fileTree.map((item) => (
              <div
                key={`${item.label}-${item.depth}`}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm ${
                  item.active ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'
                }`}
                style={{ marginLeft: `${item.depth * 14}px` }}
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    item.active ? 'bg-sky-300' : 'bg-slate-300'
                  }`}
                />
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </aside>

        <div className="bg-white/95">
          <div className="border-b border-slate-200/80 px-5 py-4 sm:px-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-slate-800">App.tsx</p>
                <p className="mt-1 text-xs text-slate-500">
                  Future browser workspace preview
                </p>
              </div>
              <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-medium text-slate-500">
                Live sandbox
              </span>
            </div>
          </div>

          <div className="space-y-7 px-5 py-6 sm:px-6 sm:py-7">
            <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_280px]">
              <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-5 sm:p-6">
                <div className="space-y-4">
                  {codeLines.map((line, index) => (
                    <div
                      key={`${line.width}-${index}`}
                      className="flex items-center gap-3"
                      style={{ paddingLeft: `${line.indent * 18}px` }}
                    >
                      <span className="w-5 text-right text-[11px] text-slate-300">
                        {index + 1}
                      </span>
                      <span
                        className={`h-2.5 rounded-full ${line.width} ${line.tone}`}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200/80 bg-gradient-to-b from-sky-50 to-white p-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                  Preview
                </p>
                <div className="mt-4 space-y-4 rounded-2xl border border-white/80 bg-white/90 p-5 shadow-sm">
                  <div className="h-3 w-16 rounded-full bg-slate-200" />
                  <div className="h-9 w-44 rounded-full bg-slate-900/90" />
                  <div className="h-2.5 w-full rounded-full bg-slate-100" />
                  <div className="h-2.5 w-5/6 rounded-full bg-slate-100" />
                  <div className="h-2.5 w-2/3 rounded-full bg-slate-100" />
                  <div className="flex gap-2 pt-3">
                    <div className="h-8 w-24 rounded-full bg-sky-100" />
                    <div className="h-8 w-20 rounded-full bg-slate-100" />
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-slate-950/[0.03] px-4 py-4 sm:px-5">
              <div className="flex min-h-6 items-center gap-2 text-sm text-slate-600">
                <span className="text-slate-400">$</span>
                <span className="font-medium text-slate-700">{typedText}</span>
                <span
                  className={`h-4 w-px bg-slate-400/80 ${
                    typedText.length === terminalCommand.length ? 'animate-pulse' : ''
                  }`}
                />
              </div>
              <div className="mt-3 min-h-[4.5rem] space-y-1.5 text-xs text-slate-500">
                {statusLines.map((line, index) => (
                  <p
                    key={line}
                    className={`transition-all duration-500 ${
                      index < visibleStatuses
                        ? 'translate-y-0 opacity-100'
                        : 'translate-y-1 opacity-0'
                    }`}
                  >
                    {line}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
