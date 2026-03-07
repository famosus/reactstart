import { getSupabaseClient } from '@/lib/supabase'
import type { Workspace, WorkspaceStatus } from '@/types/admin'

type WorkspaceRow = {
  id: string
  user_id: string
  project_id: string | null
  repository_id: string | null
  branch_name: string | null
  status: WorkspaceStatus
  preview_url: string | null
  created_at: string
}

export type CreateWorkspaceInput = {
  projectId?: string | null
  repositoryId?: string | null
  branchName?: string | null
  previewUrl?: string | null
}

function mapWorkspaceRow(row: WorkspaceRow): Workspace {
  return {
    id: row.id,
    userId: row.user_id,
    projectId: row.project_id,
    repositoryId: row.repository_id,
    branchName: row.branch_name,
    status: row.status,
    previewUrl: row.preview_url,
    createdAt: row.created_at,
  }
}

async function requireUserId(): Promise<string> {
  const client = getSupabaseClient()
  const {
    data: { session },
    error,
  } = await client.auth.getSession()

  if (error) {
    throw error
  }

  if (!session?.user.id) {
    throw new Error('Authentication required.')
  }

  return session.user.id
}

export async function getMyWorkspaces(): Promise<Workspace[]> {
  const userId = await requireUserId()
  const client = getSupabaseClient()

  const { data, error } = await client
    .from('workspaces')
    .select('id, user_id, project_id, repository_id, branch_name, status, preview_url, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    throw error
  }

  return ((data ?? []) as WorkspaceRow[]).map(mapWorkspaceRow)
}

export async function createWorkspace(input: CreateWorkspaceInput = {}): Promise<Workspace> {
  const userId = await requireUserId()
  const client = getSupabaseClient()

  const { data, error } = await client
    .from('workspaces')
    .insert([
      {
        user_id: userId,
        project_id: input.projectId ?? null,
        repository_id: input.repositoryId ?? null,
        branch_name: input.branchName ?? null,
        preview_url: input.previewUrl ?? null,
      },
    ])
    .select('id, user_id, project_id, repository_id, branch_name, status, preview_url, created_at')
    .single()

  if (error) {
    throw error
  }

  return mapWorkspaceRow(data as WorkspaceRow)
}

export async function updateWorkspaceStatus(
  workspaceId: string,
  status: WorkspaceStatus,
  previewUrl?: string | null,
): Promise<void> {
  const userId = await requireUserId()
  const client = getSupabaseClient()

  const payload: {
    status: WorkspaceStatus
    preview_url?: string | null
  } = { status }

  if (previewUrl !== undefined) {
    payload.preview_url = previewUrl
  }

  const { error } = await client
    .from('workspaces')
    .update(payload)
    .eq('id', workspaceId)
    .eq('user_id', userId)

  if (error) {
    throw error
  }
}
