export type ProjectStatus = 'draft' | 'published'
export type SubmissionStatus = 'pending' | 'approved' | 'rejected'

export type Project = {
  id: string
  name: string
  slug: string
  shortDescription: string
  fullDescription: string | null
  githubUrl: string
  demoUrl: string | null
  imageUrl: string | null
  isFeatured: boolean
  status: ProjectStatus
  createdAt: string
  tags: string[]
}

export type ProjectSubmissionInput = {
  projectName: string
  githubUrl: string
  demoUrl?: string | null
  description: string
  submitterEmail?: string | null
}

export type Submission = {
  id: string
  projectName: string
  githubUrl: string
  demoUrl: string | null
  description: string
  submitterEmail: string | null
  status: SubmissionStatus
  createdAt: string
}
