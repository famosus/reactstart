import type { SupabaseClient } from '@supabase/supabase-js'

import { requireAdminSession } from '@/lib/adminAuth'
import { getSupabaseClient } from '@/lib/supabase'
import type { Repository, SubmissionReview } from '@/types/admin'
import type { SubmissionStatus } from '@/types/project'

type RepositoryRow = {
  id: string
  project_id: string | null
  provider: Repository['provider']
  repo_url: string
  owner: string
  repo_name: string
  default_branch: string | null
  created_at: string
  updated_at: string
}

type SubmissionRow = {
  id: string
  project_name: string
  github_url: string
  demo_url: string | null
  description: string
  submitter_email: string | null
  status: SubmissionStatus
  created_at: string
  project_id: string | null
  repository_id: string | null
}

type SubmissionDetailRow = Pick<
  SubmissionRow,
  'id' | 'project_name' | 'github_url' | 'demo_url' | 'description' | 'project_id' | 'repository_id'
>

type CreateProjectResult = {
  id: string
}

type SupabaseErrorLike = {
  code?: string
}

export type SubmissionReviewFilter = {
  status?: SubmissionStatus | 'all'
}

export type UpdateSubmissionStatusInput = {
  submissionId: string
  status: SubmissionStatus
  projectId?: string | null
}

function mapRepositoryRow(row: RepositoryRow): Repository {
  return {
    id: row.id,
    projectId: row.project_id,
    provider: row.provider,
    repoUrl: row.repo_url,
    owner: row.owner,
    repoName: row.repo_name,
    defaultBranch: row.default_branch,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function mapSubmissionRow(
  row: SubmissionRow,
  repositoriesById: ReadonlyMap<string, Repository>,
): SubmissionReview {
  return {
    id: row.id,
    projectName: row.project_name,
    githubUrl: row.github_url,
    demoUrl: row.demo_url,
    description: row.description,
    submitterEmail: row.submitter_email,
    status: row.status,
    createdAt: row.created_at,
    projectId: row.project_id,
    repositoryId: row.repository_id,
    repository: row.repository_id ? repositoriesById.get(row.repository_id) ?? null : null,
  }
}

function normalizeText(value: string | null | undefined): string {
  return value?.trim() ?? ''
}

function toSlug(value: string): string {
  const normalized = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-')

  return normalized || 'react-project'
}

async function createProjectFromSubmission(
  client: SupabaseClient,
  submission: SubmissionDetailRow,
): Promise<string> {
  const name = normalizeText(submission.project_name) || 'Untitled React Project'
  const description = normalizeText(submission.description)
  const githubUrl = normalizeText(submission.github_url)
  const demoUrl = normalizeText(submission.demo_url)
  const baseSlug = toSlug(name)

  for (let attempt = 0; attempt < 50; attempt += 1) {
    const slug = attempt === 0 ? baseSlug : `${baseSlug}-${attempt + 1}`

    const { data, error } = await client
      .from('projects')
      .insert([
        {
          name,
          slug,
          short_description: description || 'No description provided yet.',
          full_description: description || null,
          github_url: githubUrl,
          demo_url: demoUrl || null,
          image_url: null,
          is_featured: false,
          status: 'published',
        },
      ])
      .select('id')
      .single()

    if (!error) {
      const created = data as CreateProjectResult
      return created.id
    }

    const errorCode = (error as SupabaseErrorLike).code
    if (errorCode === '23505') {
      continue
    }

    throw error
  }

  throw new Error('Unable to generate a unique slug for this approved project.')
}

async function setProjectPublished(client: SupabaseClient, projectId: string): Promise<void> {
  const { error } = await client.from('projects').update({ status: 'published' }).eq('id', projectId)

  if (error) {
    throw error
  }
}

async function linkRepositoryToProjectInternal(
  client: SupabaseClient,
  repositoryId: string,
  projectId: string,
): Promise<void> {
  const { error } = await client
    .from('repositories')
    .update({ project_id: projectId })
    .eq('id', repositoryId)

  if (error) {
    throw error
  }
}

async function getRepositoriesByIds(repositoryIds: string[]): Promise<Map<string, Repository>> {
  if (!repositoryIds.length) {
    return new Map()
  }

  const client = getSupabaseClient()
  const { data, error } = await client
    .from('repositories')
    .select('id, project_id, provider, repo_url, owner, repo_name, default_branch, created_at, updated_at')
    .in('id', repositoryIds)

  if (error) {
    throw error
  }

  const rows = (data ?? []) as RepositoryRow[]
  return new Map(rows.map((row) => [row.id, mapRepositoryRow(row)]))
}

export async function getSubmissionsForReview(
  filter: SubmissionReviewFilter = {},
): Promise<SubmissionReview[]> {
  await requireAdminSession()

  const client = getSupabaseClient()
  let query = client
    .from('submissions')
    .select(
      'id, project_name, github_url, demo_url, description, submitter_email, status, created_at, project_id, repository_id',
    )
    .order('created_at', { ascending: false })

  if (filter.status && filter.status !== 'all') {
    query = query.eq('status', filter.status)
  }

  const { data, error } = await query

  if (error) {
    throw error
  }

  const rows = (data ?? []) as SubmissionRow[]
  const repositoryIds = Array.from(
    new Set(rows.map((row) => row.repository_id).filter((value): value is string => Boolean(value))),
  )
  const repositoriesById = await getRepositoriesByIds(repositoryIds)

  return rows.map((row) => mapSubmissionRow(row, repositoriesById))
}

export async function updateSubmissionStatus({
  submissionId,
  status,
  projectId,
}: UpdateSubmissionStatusInput): Promise<void> {
  await requireAdminSession()

  const client = getSupabaseClient()
  const { data: submissionData, error: submissionError } = await client
    .from('submissions')
    .select('id, project_name, github_url, demo_url, description, project_id, repository_id')
    .eq('id', submissionId)
    .single()

  if (submissionError) {
    throw submissionError
  }

  const submission = submissionData as SubmissionDetailRow
  let resolvedProjectId = projectId === undefined ? submission.project_id : projectId

  if (status === 'approved') {
    if (!resolvedProjectId) {
      resolvedProjectId = await createProjectFromSubmission(client, submission)
    } else {
      await setProjectPublished(client, resolvedProjectId)
    }
  }

  const { error } = await client
    .from('submissions')
    .update({ status, project_id: resolvedProjectId ?? null })
    .eq('id', submissionId)

  if (error) {
    throw error
  }

  if (status === 'approved' && resolvedProjectId && submission.repository_id) {
    await linkRepositoryToProjectInternal(client, submission.repository_id, resolvedProjectId)
  }
}

export async function getRepositoriesForReview(): Promise<Repository[]> {
  await requireAdminSession()

  const client = getSupabaseClient()
  const { data, error } = await client
    .from('repositories')
    .select('id, project_id, provider, repo_url, owner, repo_name, default_branch, created_at, updated_at')
    .order('updated_at', { ascending: false })

  if (error) {
    throw error
  }

  return ((data ?? []) as RepositoryRow[]).map(mapRepositoryRow)
}

export async function linkRepositoryToProject(
  repositoryId: string,
  projectId: string | null,
): Promise<void> {
  await requireAdminSession()

  const client = getSupabaseClient()
  const { error } = await client
    .from('repositories')
    .update({ project_id: projectId })
    .eq('id', repositoryId)

  if (error) {
    throw error
  }
}
