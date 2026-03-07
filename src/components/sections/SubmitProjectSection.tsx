import { SubmitProjectForm } from '@/components/ui/SubmitProjectForm'
import { Section } from '@/components/ui/Section'
import { submitProjectSectionId } from '@/data/siteContent'

export function SubmitProjectSection() {
  return (
    <Section
      id={submitProjectSectionId}
      centered
      title="Submit a React Project"
      description="Know an interesting React app? Add it to the directory."
      className="rounded-2xl border border-slate-200/80 bg-white/70 p-8 sm:p-10"
    >
      <SubmitProjectForm />
    </Section>
  )
}
