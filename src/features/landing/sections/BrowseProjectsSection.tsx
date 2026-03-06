import { ProjectGrid } from '@/features/landing/components/ProjectGrid'
import { browseProjects } from '@/features/landing/data/projects'
import { Section } from '@/shared/ui/Section'

export function BrowseProjectsSection() {
  return (
    <Section
      title="Browse React Projects"
      description="Open-source React apps you can explore and build on. A growing index designed to scale from a handful of projects to hundreds."
    >
      <ProjectGrid projects={browseProjects} columns={3} demoLabel="Demo" />
    </Section>
  )
}
