import { featuredTags, mockProjects } from '@/data/mockProjects'
import { getSupabaseClient, isSupabaseConfigured } from '@/lib/supabase'
import type { Project, ProjectStatus } from '@/types/project'

type ProjectRow = {
  id: string
  name: string
  slug: string
  short_description: string
  full_description: string | null
  github_url: string
  demo_url: string | null
  image_url: string | null
  is_featured: boolean
  status: ProjectStatus
  created_at: string
}

type ProjectTagRow = {
  project_id: string
  tag: string
}

function mapProjectRow(row: ProjectRow, tags: string[]): Project {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    shortDescription: row.short_description,
    fullDescription: row.full_description,
    githubUrl: row.github_url,
    demoUrl: row.demo_url,
    imageUrl: row.image_url,
    isFeatured: row.is_featured,
    status: row.status,
    createdAt: row.created_at,
    tags,
  }
}

async function getProjectTags(projectIds: string[]): Promise<Record<string, string[]>> {
  if (!projectIds.length) {
    return {}
  }

  const client = getSupabaseClient()
  const { data, error } = await client
    .from('project_tags')
    .select('project_id, tag')
    .in('project_id', projectIds)
    .order('created_at', { ascending: true })

  if (error) {
    throw error
  }

  return (data ?? []).reduce<Record<string, string[]>>((acc, row) => {
    const tagRow = row as ProjectTagRow
    acc[tagRow.project_id] ??= []
    acc[tagRow.project_id].push(tagRow.tag)
    return acc
  }, {})
}

async function loadProjects(options?: { featuredOnly?: boolean }): Promise<Project[]> {
  if (!isSupabaseConfigured) {
    return mockProjects.filter((project) =>
      options?.featuredOnly ? project.isFeatured : project.status === 'published',
    )
  }

  const client = getSupabaseClient()
  let query = client
    .from('projects')
    .select('*')
    .eq('status', 'published')
    .order('created_at', { ascending: false })

  if (options?.featuredOnly) {
    query = query.eq('is_featured', true)
  }

  const { data, error } = await query

  if (error) {
    throw error
  }

  const rows = (data ?? []) as ProjectRow[]
  const tagsByProject = await getProjectTags(rows.map((row) => row.id))

  return rows.map((row) => mapProjectRow(row, tagsByProject[row.id] ?? []))
}

export async function getFeaturedProjects(): Promise<Project[]> {
  return loadProjects({ featuredOnly: true })
}

export async function getPublishedProjects(): Promise<Project[]> {
  return loadProjects()
}

export function getFeaturedTags(): string[] {
  return featuredTags
}
