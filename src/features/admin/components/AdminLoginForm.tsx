import { useState, type FormEvent } from 'react'

import type { AdminCredentials } from '@/lib/adminAuth'

type AdminLoginFormProps = {
  onSubmit: (credentials: AdminCredentials) => Promise<void>
  isSubmitting: boolean
  error: string | null
}

export function AdminLoginForm({ onSubmit, isSubmitting, error }: AdminLoginFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    void onSubmit({ email, password })
  }

  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white/90 p-6 shadow-sm sm:p-8">
      <h2 className="text-lg font-medium text-slate-900">Admin Login</h2>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">
        Sign in with your admin account to review and approve submitted projects.
      </p>

      <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
        <label className="grid gap-2 text-sm text-slate-600">
          <span className="font-medium text-slate-700">Email</span>
          <input
            required
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-400"
          />
        </label>

        <label className="grid gap-2 text-sm text-slate-600">
          <span className="font-medium text-slate-700">Password</span>
          <input
            required
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-400"
          />
        </label>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 inline-flex items-center justify-center rounded-full border border-slate-300 bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Signing in...' : 'Open Admin Gateway'}
        </button>
      </form>

      {error ? <p className="mt-4 text-sm text-rose-700">{error}</p> : null}
    </section>
  )
}
