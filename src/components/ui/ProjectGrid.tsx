import { ProjectCard } from '@/components/ui/ProjectCard'
import type { GitHubRepoStats } from '@/lib/repositoryStats'
import type { Project } from '@/types/project'

type ProjectGridProps = {
  projects: Project[]
  columns?: 2 | 3
  demoLabel?: string
  repoStatsByProjectId?: Record<string, GitHubRepoStats | null>
  thumbnailMode?: 'standard' | 'expanded'
}

const gridColumns: Record<NonNullable<ProjectGridProps['columns']>, string> = {
  2: 'md:grid-cols-2',
  3: 'sm:grid-cols-2 lg:grid-cols-3',
}

export function ProjectGrid({
  projects,
  columns = 3,
  demoLabel,
  repoStatsByProjectId,
  thumbnailMode = 'standard',
}: ProjectGridProps) {
  return (
    <div className={`grid gap-5 ${gridColumns[columns]}`}>
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          demoLabel={demoLabel}
          repoStats={repoStatsByProjectId?.[project.id] ?? null}
          thumbnailMode={thumbnailMode}
        />
      ))}
    </div>
  )
}
