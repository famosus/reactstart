import { GitFork, Star } from 'lucide-react'

import { TagBadge } from '@/components/ui/TagBadge'
import type { GitHubRepoStats } from '@/lib/repositoryStats'
import type { Project } from '@/types/project'

type ProjectCardProps = {
  project: Project
  demoLabel?: string
  repoStats?: GitHubRepoStats | null
}

function formatCount(value: number): string {
  return value.toLocaleString()
}

export function ProjectCard({
  project,
  demoLabel = 'Live Demo',
  repoStats = null,
}: ProjectCardProps) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-slate-200/80 bg-white/70 p-6 shadow-sm shadow-slate-200/50 transition hover:-translate-y-0.5 hover:shadow-md hover:shadow-slate-200/70">
      {project.imageUrl ? (
        <div className="mb-4 overflow-hidden rounded-xl border border-slate-200/80 bg-slate-100">
          <img
            src={project.imageUrl}
            alt={`${project.name} thumbnail`}
            loading="lazy"
            className="h-36 w-full object-cover"
          />
        </div>
      ) : null}

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-slate-900">{project.name}</h3>
        <p className="text-sm leading-relaxed text-slate-600">{project.shortDescription}</p>
        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <TagBadge key={`${project.id}-${tag}`} label={tag} />
          ))}
        </div>
      </div>

      {repoStats ? (
        <div className="mt-4 flex flex-wrap items-center gap-2.5 text-[11px] text-slate-500">
          <span className="inline-flex items-center gap-1.5">
            <Star className="h-3.5 w-3.5" strokeWidth={1.75} />
            <span>{formatCount(repoStats.stars)} stars</span>
          </span>
          <span aria-hidden="true" className="h-3 w-px bg-slate-200" />
          <span className="inline-flex items-center gap-1.5">
            <GitFork className="h-3.5 w-3.5" strokeWidth={1.75} />
            <span>{formatCount(repoStats.forks)} forks</span>
          </span>
        </div>
      ) : null}

      <div className="mt-6 flex flex-wrap gap-3">
        {project.demoUrl ? (
          <a
            href={project.demoUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center rounded-full border border-slate-300 bg-white px-4 py-1.5 text-xs font-medium text-slate-800 transition hover:border-slate-400 hover:bg-slate-100"
          >
            {demoLabel}
          </a>
        ) : null}
        <a
          href={project.githubUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center rounded-full border border-transparent px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:text-slate-900"
        >
          GitHub
        </a>
      </div>
    </article>
  )
}
