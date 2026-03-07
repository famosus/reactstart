import { ProjectCard } from '@/components/ui/ProjectCard'
import type { Project } from '@/types/project'

type ProjectGridProps = {
  projects: Project[]
  columns?: 2 | 3
  demoLabel?: string
}

const gridColumns: Record<NonNullable<ProjectGridProps['columns']>, string> = {
  2: 'sm:grid-cols-2',
  3: 'sm:grid-cols-2 lg:grid-cols-3',
}

export function ProjectGrid({
  projects,
  columns = 3,
  demoLabel,
}: ProjectGridProps) {
  return (
    <div className={`grid gap-5 ${gridColumns[columns]}`}>
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} demoLabel={demoLabel} />
      ))}
    </div>
  )
}
