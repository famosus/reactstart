import { type FormEvent } from 'react'

import type { AdminProjectEditorValues } from '@/lib/adminProjects'
import type { ProjectEditorField } from '@/features/admin/hooks/useProjectEditor'

type ProjectEditModalProps = {
  isOpen: boolean
  isLoading: boolean
  isSaving: boolean
  error: string | null
  form: AdminProjectEditorValues | null
  onClose: () => void
  onSave: () => Promise<void>
  onFieldChange: (field: ProjectEditorField, value: string) => void
  onFeaturedChange: (value: boolean) => void
}

export function ProjectEditModal({
  isOpen,
  isLoading,
  isSaving,
  error,
  form,
  onClose,
  onSave,
  onFieldChange,
  onFeaturedChange,
}: ProjectEditModalProps) {
  if (!isOpen) {
    return null
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    void onSave()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/35 p-4">
      <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-xl sm:p-7">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-medium text-slate-900">Edit Approved Project</h2>
            <p className="mt-1 text-sm text-slate-600">
              Update card content and optional thumbnail image URL.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-300 px-3 py-1 text-sm text-slate-600 transition hover:bg-slate-100"
          >
            Close
          </button>
        </div>

        {isLoading ? (
          <p className="mt-6 text-sm text-slate-600">Loading project data...</p>
        ) : null}

        {form ? (
          <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
            <label className="grid gap-2 text-sm text-slate-600">
              <span className="font-medium text-slate-700">Project name</span>
              <input
                required
                value={form.name}
                onChange={(event) => onFieldChange('name', event.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-400"
              />
            </label>

            <label className="grid gap-2 text-sm text-slate-600">
              <span className="font-medium text-slate-700">Short description</span>
              <textarea
                required
                rows={3}
                value={form.shortDescription}
                onChange={(event) => onFieldChange('shortDescription', event.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-400"
              />
            </label>

            <label className="grid gap-2 text-sm text-slate-600">
              <span className="font-medium text-slate-700">Full description</span>
              <textarea
                rows={4}
                value={form.fullDescription}
                onChange={(event) => onFieldChange('fullDescription', event.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-400"
              />
            </label>

            <label className="grid gap-2 text-sm text-slate-600">
              <span className="font-medium text-slate-700">GitHub URL</span>
              <input
                required
                value={form.githubUrl}
                onChange={(event) => onFieldChange('githubUrl', event.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-400"
              />
            </label>

            <label className="grid gap-2 text-sm text-slate-600">
              <span className="font-medium text-slate-700">Demo URL</span>
              <input
                value={form.demoUrl}
                onChange={(event) => onFieldChange('demoUrl', event.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-400"
              />
            </label>

            <label className="grid gap-2 text-sm text-slate-600">
              <span className="font-medium text-slate-700">Thumbnail image URL (admin only)</span>
              <input
                value={form.imageUrl}
                onChange={(event) => onFieldChange('imageUrl', event.target.value)}
                placeholder="https://..."
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-400"
              />
            </label>

            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={form.isFeatured}
                onChange={(event) => onFeaturedChange(event.target.checked)}
              />
              Show in Featured React Builds
            </label>

            {error ? <p className="text-sm text-rose-700">{error}</p> : null}

            <div className="mt-2 flex flex-wrap gap-2">
              <button
                type="submit"
                disabled={isSaving}
                className="rounded-full border border-slate-900 bg-slate-900 px-5 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-slate-300 bg-white px-5 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : null}
      </div>
    </div>
  )
}
