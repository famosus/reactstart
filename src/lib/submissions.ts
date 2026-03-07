import { getSupabaseClient } from '@/lib/supabase'
import type { ProjectSubmissionInput, Submission, SubmissionStatus } from '@/types/project'

type SubmissionRow = {
  id: string
  project_name: string
  github_url: string
  demo_url: string | null
  description: string
  submitter_email: string | null
  status: SubmissionStatus
  created_at: string
}

function mapSubmissionRow(row: SubmissionRow): Submission {
  return {
    id: row.id,
    projectName: row.project_name,
    githubUrl: row.github_url,
    demoUrl: row.demo_url,
    description: row.description,
    submitterEmail: row.submitter_email,
    status: row.status,
    createdAt: row.created_at,
  }
}

export async function submitProject(input: ProjectSubmissionInput): Promise<Submission[]> {
  const client = getSupabaseClient()
  const { data, error } = await client
    .from('submissions')
    .insert([
      {
        project_name: input.projectName,
        github_url: input.githubUrl,
        demo_url: input.demoUrl ?? null,
        description: input.description,
        submitter_email: input.submitterEmail ?? null,
      },
    ])
    .select()

  if (error) {
    throw error
  }

  return ((data ?? []) as SubmissionRow[]).map(mapSubmissionRow)
}
