import { useCallback, useMemo, useState } from 'react'

import {
  getProjectForEdit,
  updateProjectForEdit,
  type AdminProjectEditorValues,
} from '@/lib/adminProjects'
import type { SubmissionReview } from '@/types/admin'

export type ProjectEditorField =
  | 'name'
  | 'shortDescription'
  | 'fullDescription'
  | 'githubUrl'
  | 'demoUrl'
  | 'imageUrl'

type UseProjectEditorOptions = {
  onSaved?: () => Promise<void> | void
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }

  return 'Unexpected editor error.'
}

export function useProjectEditor(options: UseProjectEditorOptions = {}) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeSubmissionId, setActiveSubmissionId] = useState<string | null>(null)
  const [form, setForm] = useState<AdminProjectEditorValues | null>(null)

  const closeEditor = useCallback(() => {
    setIsOpen(false)
    setIsLoading(false)
    setIsSaving(false)
    setError(null)
    setForm(null)
  }, [])

  const openEditor = useCallback(async (submission: SubmissionReview) => {
    if (submission.status !== 'approved') {
      return
    }

    if (!submission.projectId) {
      setError('This approved submission is not linked to a project yet. Re-approve to generate it.')
      return
    }

    setActiveSubmissionId(submission.id)
    setIsOpen(true)
    setIsLoading(true)
    setError(null)

    try {
      const project = await getProjectForEdit(submission.projectId)
      setForm(project)
    } catch (projectError) {
      setError(getErrorMessage(projectError))
    } finally {
      setIsLoading(false)
      setActiveSubmissionId(null)
    }
  }, [])

  const updateField = useCallback((field: ProjectEditorField, value: string) => {
    setForm((current) => {
      if (!current) {
        return current
      }

      return {
        ...current,
        [field]: value,
      }
    })
  }, [])

  const setFeatured = useCallback((value: boolean) => {
    setForm((current) => {
      if (!current) {
        return current
      }

      return {
        ...current,
        isFeatured: value,
      }
    })
  }, [])

  const saveEditor = useCallback(async () => {
    if (!form) {
      return
    }

    setIsSaving(true)
    setError(null)

    try {
      await updateProjectForEdit(form)
      await options.onSaved?.()
      closeEditor()
    } catch (saveError) {
      setError(getErrorMessage(saveError))
    } finally {
      setIsSaving(false)
    }
  }, [form, options, closeEditor])

  return useMemo(
    () => ({
      isOpen,
      isLoading,
      isSaving,
      error,
      form,
      activeSubmissionId,
      openEditor,
      closeEditor,
      updateField,
      setFeatured,
      saveEditor,
    }),
    [
      isOpen,
      isLoading,
      isSaving,
      error,
      form,
      activeSubmissionId,
      openEditor,
      closeEditor,
      updateField,
      setFeatured,
      saveEditor,
    ],
  )
}
