import { useEffect, useState } from 'react'

import { ProjectCardSkeleton } from '@/components/ui/ProjectCardSkeleton'
import { ProjectGrid } from '@/components/ui/ProjectGrid'
import { Section } from '@/components/ui/Section'
import { getPublishedProjects } from '@/lib/projects'
import type { Project } from '@/types/project'

export function BrowseProjectsSection() {
  const [projects, setProjects] = useState<Project[]>([])
  const [status, setStatus] = useState<'loading' | 'success' | 'empty' | 'error'>('loading')

  useEffect(() => {
    let active = true

    async function loadProjects() {
      try {
        setStatus('loading')
        const data = await getPublishedProjects()
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
      title="Browse React Projects"
      description="Open-source React apps you can explore and build on. A growing index designed to scale from a handful of projects to hundreds."
    >
      {status === 'loading' ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <ProjectCardSkeleton key={index} />
          ))}
        </div>
      ) : null}

      {status === 'success' ? <ProjectGrid projects={projects} columns={3} demoLabel="Demo" /> : null}

      {status === 'empty' ? (
        <p className="text-sm text-slate-500">No React projects have been added yet.</p>
      ) : null}

      {status === 'error' ? (
        <p className="text-sm text-slate-500">Unable to load projects right now.</p>
      ) : null}
    </Section>
  )
}
