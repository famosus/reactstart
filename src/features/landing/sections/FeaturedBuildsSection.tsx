import { FeaturedTags } from '@/features/landing/components/FeaturedTags'
import { ProjectGrid } from '@/features/landing/components/ProjectGrid'
import { featuredProjects, featuredTags } from '@/features/landing/data/projects'
import { Section } from '@/shared/ui/Section'

export function FeaturedBuildsSection() {
  return (
    <Section
      title="Featured React Builds"
      description="Interesting open-source apps and experiments built with React."
    >
      <FeaturedTags tags={featuredTags} />
      <ProjectGrid projects={featuredProjects} columns={2} />
    </Section>
  )
}
