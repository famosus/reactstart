import { contactEmail, submitProjectSectionId } from '@/features/landing/constants'

export function LandingFooter() {
  return (
    <footer className="border-t border-slate-200/70">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-slate-500 sm:flex-row">
        <p className="text-xs font-medium uppercase tracking-[0.36em] text-slate-400 [font-family:'SFMono-Regular','Menlo','Monaco','Consolas',monospace]">REACTSTART</p>
        <nav className="flex items-center gap-5">
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="transition hover:text-slate-900"
          >
            GitHub
          </a>
          <a
            href={`mailto:${contactEmail}`}
            className="transition hover:text-slate-900"
          >
            Contact
          </a>
          <a
            href={`#${submitProjectSectionId}`}
            className="transition hover:text-slate-900"
          >
            Add a Project
          </a>
        </nav>
        <p className="text-xs text-slate-400">Things that started with React.</p>
      </div>
    </footer>
  )
}
