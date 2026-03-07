import { Section } from '@/components/ui/Section'
import { WorkspacePreview } from '@/components/ui/WorkspacePreview'

export function ComingLaterSection() {
  return (
    <Section
      title="Coming Later"
      description="ReactStart is exploring ways to instantly open React projects in a browser workspace for learning and contribution."
      className="rounded-2xl border border-dashed border-slate-200/80 bg-white/50 p-8 sm:p-10"
    >
      <div className="space-y-6">
        <p className="max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
          One command to open a React project and start building instantly.
        </p>
        <WorkspacePreview />
      </div>
    </Section>
  )
}
