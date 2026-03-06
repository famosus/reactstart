import { submitProjectSectionId } from '@/features/landing/constants'
import { Section } from '@/shared/ui/Section'

export function SubmitProjectSection() {
  return (
    <Section
      id={submitProjectSectionId}
      centered
      title="Submit a React Project"
      description="Know an interesting React app? Add it to the directory."
      className="rounded-2xl border border-slate-200/80 bg-white/70 p-8 sm:p-10"
    >
      <button
        type="button"
        className="inline-flex items-center rounded-full border border-slate-300/80 bg-white px-6 py-2.5 text-sm font-medium text-slate-800 shadow-sm transition hover:border-slate-400 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
      >
        Add a Project
      </button>
    </Section>
  )
}
