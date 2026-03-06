import { ProjectGrid } from './components/ProjectGrid'
import { Section } from './components/Section'
import { WorkspacePreview } from './components/WorkspacePreview'
import { browseProjects, featuredProjects } from './data/projects'

function App() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50 text-slate-900">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[38rem] w-[38rem] -translate-x-1/2 rounded-full bg-gradient-to-br from-sky-100/70 via-white to-emerald-100/60 blur-3xl" />
        <div className="absolute bottom-[-7rem] left-1/2 h-56 w-[32rem] -translate-x-1/2 rounded-full bg-slate-200/50 blur-3xl" />
      </div>

      <div className="relative">
        <main>
          <section className="px-6 pb-20 pt-20 sm:pb-24 sm:pt-24">
            <div className="mx-auto w-full max-w-2xl text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                ReactStart
              </p>
              <h1 className="mt-6 text-4xl font-medium tracking-tight text-slate-900 sm:text-5xl">
                Things that started with React.
              </h1>
              <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
                A small project exploring interesting React builds,
                experiments, and ideas.
              </p>
              <p className="mt-5 text-sm text-slate-500">
                Currently under development.
              </p>

              <div className="mt-10">
                <a
                  href="mailto:crypsouth@gmail.com"
                  className="inline-flex items-center rounded-full border border-slate-300/80 bg-white px-6 py-2.5 text-sm font-medium text-slate-800 shadow-sm transition hover:border-slate-400 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
                >
                  Contact
                </a>
              </div>

              <p className="mx-auto mt-5 max-w-lg text-sm text-slate-500">
                Interested in the project, collaboration, or the domain? Get in
                touch.
              </p>
            </div>
          </section>

          <div className="mx-auto w-full max-w-6xl space-y-20 px-6 pb-20 sm:space-y-24 sm:pb-24">
            <Section
              title="Featured React Builds"
              description="Interesting open-source apps and experiments built with React."
            >
              <ProjectGrid projects={featuredProjects} columns={2} />
            </Section>

            <Section
              title="Browse React Projects"
              description="A growing index designed to scale from a handful of projects to hundreds."
            >
              <ProjectGrid projects={browseProjects} columns={3} demoLabel="Demo" />
            </Section>

            <Section
              id="submit-project"
              centered
              title="Submit a React Project"
              description="Know an interesting React app? Add it to the directory."
              className="rounded-2xl border border-slate-200/80 bg-white/70 p-8 sm:p-10"
            >
              <button
                type="button"
                className="inline-flex items-center rounded-full border border-slate-300/80 bg-white px-6 py-2.5 text-sm font-medium text-slate-800 shadow-sm transition hover:border-slate-400 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
              >
                Submit Project
              </button>
            </Section>

            <Section
              title="Coming Later"
              description="ReactStart is exploring ways to instantly open React projects in a browser workspace for learning and contribution."
              className="rounded-2xl border border-dashed border-slate-200/80 bg-white/50 p-7 sm:p-8"
            >
              <WorkspacePreview />
            </Section>
          </div>
        </main>

        <footer className="border-t border-slate-200/70">
          <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-slate-500 sm:flex-row">
            <p className="text-sm font-medium text-slate-700">ReactStart</p>
            <nav className="flex items-center gap-5">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="transition hover:text-slate-900"
              >
                GitHub
              </a>
              <a
                href="mailto:crypsouth@gmail.com"
                className="transition hover:text-slate-900"
              >
                Contact
              </a>
              <a href="#submit-project" className="transition hover:text-slate-900">
                Submit Project
              </a>
            </nav>
            <p className="text-xs text-slate-400">Things that started with React.</p>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default App
