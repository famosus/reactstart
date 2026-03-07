export type GitHubRepoStats = {
  stars: number
  forks: number
}

type ParsedGitHubRepo = {
  owner: string
  repo: string
}

const repoStatsCache = new Map<string, Promise<GitHubRepoStats | null>>()

function parseGitHubRepo(repoUrl: string): ParsedGitHubRepo | null {
  try {
    const url = new URL(repoUrl)
    if (url.hostname !== 'github.com' && !url.hostname.endsWith('.github.com')) {
      return null
    }

    const [owner, repoRaw] = url.pathname.split('/').filter(Boolean)
    if (!owner || !repoRaw) {
      return null
    }

    const repo = repoRaw.replace(/\.git$/i, '')
    if (!repo) {
      return null
    }

    return { owner, repo }
  } catch {
    return null
  }
}

async function fetchGitHubRepoStats(owner: string, repo: string): Promise<GitHubRepoStats | null> {
  const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
    headers: {
      Accept: 'application/vnd.github+json',
    },
  })

  if (!response.ok) {
    return null
  }

  const payload = (await response.json()) as {
    stargazers_count?: unknown
    forks_count?: unknown
  }

  if (typeof payload.stargazers_count !== 'number' || typeof payload.forks_count !== 'number') {
    return null
  }

  return {
    stars: payload.stargazers_count,
    forks: payload.forks_count,
  }
}

export function getGitHubRepoStatsFromUrl(repoUrl: string): Promise<GitHubRepoStats | null> {
  const parsed = parseGitHubRepo(repoUrl)
  if (!parsed) {
    return Promise.resolve(null)
  }

  const cacheKey = `${parsed.owner}/${parsed.repo}`.toLowerCase()
  const cached = repoStatsCache.get(cacheKey)
  if (cached) {
    return cached
  }

  const request = fetchGitHubRepoStats(parsed.owner, parsed.repo).catch(() => null)
  repoStatsCache.set(cacheKey, request)
  return request
}
