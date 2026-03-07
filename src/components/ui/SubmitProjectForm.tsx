import { useState, type ChangeEvent, type FormEvent } from 'react'

import { submitProject } from '@/lib/submissions'
import type { ProjectSubmissionInput } from '@/types/project'

type FormState = ProjectSubmissionInput & {
  demoUrl: string
  submitterEmail: string
}

type SubmissionState = {
  status: 'idle' | 'submitting' | 'success' | 'error'
  message: string | null
}

const initialFormState: FormState = {
  projectName: '',
  githubUrl: '',
  demoUrl: '',
  description: '',
  submitterEmail: '',
}

function isValidUrl(value: string) {
  try {
    new URL(value)
    return true
  } catch {
    return false
  }
}

export function SubmitProjectForm() {
  const [form, setForm] = useState<FormState>(initialFormState)
  const [submissionState, setSubmissionState] = useState<SubmissionState>({
    status: 'idle',
    message: null,
  })

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const validateForm = () => {
    if (!form.projectName.trim()) {
      return 'Project name is required.'
    }

    if (!form.githubUrl.trim() || !isValidUrl(form.githubUrl)) {
      return 'Please enter a valid GitHub repository URL.'
    }

    if (form.demoUrl.trim() && !isValidUrl(form.demoUrl)) {
      return 'Please enter a valid live demo URL.'
    }

    if (!form.description.trim()) {
      return 'Short description is required.'
    }

    if (form.submitterEmail.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.submitterEmail)) {
      return 'Please enter a valid email address.'
    }

    return null
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const validationError = validateForm()
    if (validationError) {
      setSubmissionState({ status: 'error', message: validationError })
      return
    }

    setSubmissionState({ status: 'submitting', message: null })

    try {
      await submitProject({
        projectName: form.projectName.trim(),
        githubUrl: form.githubUrl.trim(),
        demoUrl: form.demoUrl.trim() || null,
        description: form.description.trim(),
        submitterEmail: form.submitterEmail.trim() || null,
      })

      setForm(initialFormState)
      setSubmissionState({
        status: 'success',
        message: 'Thanks — your project was submitted for review.',
      })
    } catch (error) {
      setSubmissionState({
        status: 'error',
        message:
          error instanceof Error
            ? error.message
            : 'Something went wrong while submitting. Please try again.',
      })
    }
  }

  return (
    <form className="mx-auto grid w-full max-w-2xl gap-4 text-left" onSubmit={handleSubmit}>
      <label className="grid gap-2 text-sm text-slate-600">
        <span className="font-medium text-slate-700">Project name</span>
        <input
          required
          name="projectName"
          value={form.projectName}
          onChange={handleChange}
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
        />
      </label>

      <label className="grid gap-2 text-sm text-slate-600">
        <span className="font-medium text-slate-700">GitHub repository</span>
        <input
          required
          name="githubUrl"
          value={form.githubUrl}
          onChange={handleChange}
          placeholder="https://github.com/..."
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
        />
      </label>

      <label className="grid gap-2 text-sm text-slate-600">
        <span className="font-medium text-slate-700">Live demo URL</span>
        <input
          name="demoUrl"
          value={form.demoUrl}
          onChange={handleChange}
          placeholder="https://..."
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
        />
      </label>

      <label className="grid gap-2 text-sm text-slate-600">
        <span className="font-medium text-slate-700">Short description</span>
        <textarea
          required
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={4}
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
        />
      </label>

      <label className="grid gap-2 text-sm text-slate-600">
        <span className="font-medium text-slate-700">Your email (optional)</span>
        <input
          name="submitterEmail"
          value={form.submitterEmail}
          onChange={handleChange}
          placeholder="you@example.com"
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
        />
      </label>

      <div className="pt-2">
        <button
          type="submit"
          disabled={submissionState.status === 'submitting'}
          className="inline-flex items-center rounded-full border border-slate-300/80 bg-white px-6 py-2.5 text-sm font-medium text-slate-800 shadow-sm transition hover:border-slate-400 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submissionState.status === 'submitting' ? 'Submitting...' : 'Add a Project'}
        </button>
      </div>

      {submissionState.message ? (
        <p
          className={`text-sm ${
            submissionState.status === 'success' ? 'text-emerald-700' : 'text-rose-700'
          }`}
        >
          {submissionState.message}
        </p>
      ) : null}
    </form>
  )
}
