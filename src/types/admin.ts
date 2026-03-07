import type { SubmissionStatus } from '@/types/project'

export type RepositoryProvider = 'github' | 'gitlab'

export type WorkspaceStatus = 'provisioning' | 'ready' | 'stopped' | 'failed'

export type Repository = {
  id: string
  projectId: string | null
  provider: RepositoryProvider
  repoUrl: string
  owner: string
  repoName: string
  defaultBranch: string | null
  createdAt: string
  updatedAt: string
}

export type SubmissionReview = {
  id: string
  projectName: string
  githubUrl: string
  demoUrl: string | null
  description: string
  submitterEmail: string | null
  status: SubmissionStatus
  createdAt: string
  projectId: string | null
  repositoryId: string | null
  repository: Repository | null
}

export type Workspace = {
  id: string
  userId: string
  projectId: string | null
  repositoryId: string | null
  branchName: string | null
  status: WorkspaceStatus
  previewUrl: string | null
  createdAt: string
}
