function App() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50 text-slate-900">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[38rem] w-[38rem] -translate-x-1/2 rounded-full bg-gradient-to-br from-sky-100/70 via-white to-emerald-100/60 blur-3xl" />
        <div className="absolute bottom-[-7rem] left-1/2 h-56 w-[32rem] -translate-x-1/2 rounded-full bg-slate-200/50 blur-3xl" />
      </div>

      <div className="relative flex min-h-screen flex-col">
        <main className="flex flex-1 items-center px-6 py-20">
          <section className="mx-auto w-full max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
              ReactStart
            </p>
            <h1 className="mt-6 text-4xl font-medium tracking-tight text-slate-900 sm:text-5xl">
              Things that started with React.
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
              A small project exploring interesting React builds, experiments,
              and ideas.
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
          </section>
        </main>

        <footer className="border-t border-slate-200/70 px-6 py-5">
          <p className="text-center text-xs tracking-[0.18em] text-slate-400">
            reactstart.com
          </p>
        </footer>
      </div>
    </div>
  )
}

export default App
