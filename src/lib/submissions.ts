import { getSupabaseClient } from '@/lib/supabase'
import type { ProjectSubmissionInput } from '@/types/project'

export async function submitProject(input: ProjectSubmissionInput): Promise<void> {
  const client = getSupabaseClient()
  const { error } = await client.from('submissions').insert([
    {
      project_name: input.projectName,
      github_url: input.githubUrl,
      demo_url: input.demoUrl ?? null,
      description: input.description,
      submitter_email: input.submitterEmail ?? null,
    },
  ])

  if (error) {
    throw error
  }
}
