import { requireAdminSession } from '@/lib/adminAuth'
import { getSupabaseClient } from '@/lib/supabase'

type ProjectRow = {
  id: string
  name: string
  short_description: string
  full_description: string | null
  github_url: string
  demo_url: string | null
  image_url: string | null
  is_featured: boolean
}

export type AdminProjectEditorValues = {
  id: string
  name: string
  shortDescription: string
  fullDescription: string
  githubUrl: string
  demoUrl: string
  imageUrl: string
  isFeatured: boolean
}

function mapProjectRow(row: ProjectRow): AdminProjectEditorValues {
  return {
    id: row.id,
    name: row.name,
    shortDescription: row.short_description,
    fullDescription: row.full_description ?? '',
    githubUrl: row.github_url,
    demoUrl: row.demo_url ?? '',
    imageUrl: row.image_url ?? '',
    isFeatured: row.is_featured,
  }
}

export async function getProjectForEdit(projectId: string): Promise<AdminProjectEditorValues> {
  await requireAdminSession()

  const client = getSupabaseClient()
  const { data, error } = await client
    .from('projects')
    .select('id, name, short_description, full_description, github_url, demo_url, image_url, is_featured')
    .eq('id', projectId)
    .single()

  if (error) {
    throw error
  }

  return mapProjectRow(data as ProjectRow)
}

export async function updateProjectForEdit(values: AdminProjectEditorValues): Promise<void> {
  await requireAdminSession()

  const name = values.name.trim()
  const shortDescription = values.shortDescription.trim()
  const githubUrl = values.githubUrl.trim()

  if (!name) {
    throw new Error('Project name is required.')
  }

  if (!shortDescription) {
    throw new Error('Short description is required.')
  }

  if (!githubUrl) {
    throw new Error('GitHub URL is required.')
  }

  const client = getSupabaseClient()
  const { error } = await client
    .from('projects')
    .update({
      name,
      short_description: shortDescription,
      full_description: values.fullDescription.trim() || null,
      github_url: githubUrl,
      demo_url: values.demoUrl.trim() || null,
      image_url: values.imageUrl.trim() || null,
      is_featured: values.isFeatured,
    })
    .eq('id', values.id)

  if (error) {
    throw error
  }
}
