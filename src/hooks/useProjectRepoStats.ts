import { useEffect, useState } from 'react'

import { getGitHubRepoStatsFromUrl, type GitHubRepoStats } from '@/lib/repositoryStats'
import type { Project } from '@/types/project'

type RepoStatsByProjectId = Record<string, GitHubRepoStats | null>

export function useProjectRepoStats(projects: Project[]) {
  const [repoStatsByProjectId, setRepoStatsByProjectId] = useState<RepoStatsByProjectId>({})
  const [isRepoStatsLoading, setIsRepoStatsLoading] = useState(false)

  useEffect(() => {
    let active = true

    async function loadStats() {
      if (!projects.length) {
        setRepoStatsByProjectId({})
        setIsRepoStatsLoading(false)
        return
      }

      setIsRepoStatsLoading(true)

      const entries = await Promise.all(
        projects.map(async (project) => {
          const stats = await getGitHubRepoStatsFromUrl(project.githubUrl)
          return [project.id, stats] as const
        }),
      )

      if (!active) {
        return
      }

      const next: RepoStatsByProjectId = {}
      for (const [projectId, stats] of entries) {
        next[projectId] = stats
      }

      setRepoStatsByProjectId(next)
      setIsRepoStatsLoading(false)
    }

    void loadStats()

    return () => {
      active = false
    }
  }, [projects])

  return {
    repoStatsByProjectId,
    isRepoStatsLoading,
  }
}
