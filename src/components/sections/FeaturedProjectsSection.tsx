import { useEffect, useState } from 'react'

import { ProjectCardSkeleton } from '@/components/ui/ProjectCardSkeleton'
import { ProjectGrid } from '@/components/ui/ProjectGrid'
import { Section } from '@/components/ui/Section'
import { TagBadge } from '@/components/ui/TagBadge'
import { getFeaturedProjects, getFeaturedTags } from '@/lib/projects'
import type { Project } from '@/types/project'
import { useProjectRepoStats } from '@/hooks/useProjectRepoStats'

export function FeaturedProjectsSection() {
  const [projects, setProjects] = useState<Project[]>([])
  const [status, setStatus] = useState<'loading' | 'success' | 'empty' | 'error'>('loading')
  const { repoStatsByProjectId } = useProjectRepoStats(projects)

  useEffect(() => {
    let active = true

    async function loadProjects() {
      try {
        setStatus('loading')
        const data = await getFeaturedProjects()
        if (!active) {
          return
        }

        setProjects(data)
        setStatus(data.length ? 'success' : 'empty')
      } catch {
        if (!active) {
          return
        }

        setStatus('error')
      }
    }

    void loadProjects()

    return () => {
      active = false
    }
  }, [])

  return (
    <Section
      title="Featured React Builds"
      description="Interesting open-source apps and experiments built with React."
    >
      <div className="flex flex-wrap gap-2.5">
        {getFeaturedTags().map((tag) => (
          <TagBadge key={tag} label={tag} />
        ))}
      </div>

      {status === 'loading' ? (
        <div className="grid gap-5 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <ProjectCardSkeleton key={index} />
          ))}
        </div>
      ) : null}

      {status === 'success' ? (
        <ProjectGrid projects={projects} columns={2} repoStatsByProjectId={repoStatsByProjectId} />
      ) : null}

      {status === 'empty' ? (
        <p className="text-sm text-slate-500">No featured React builds yet.</p>
      ) : null}

      {status === 'error' ? (
        <p className="text-sm text-slate-500">Unable to load featured projects right now.</p>
      ) : null}
    </Section>
  )
}
