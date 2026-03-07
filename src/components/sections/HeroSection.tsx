import { contactEmail } from '@/data/siteContent'

export function HeroSection() {
  return (
    <section className="px-6 pb-20 pt-20 sm:pb-24 sm:pt-24">
      <div className="mx-auto w-full max-w-2xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
          ReactStart
        </p>
        <h1 className="mt-6 text-4xl font-medium tracking-tight text-slate-900 sm:text-5xl">
          Things that started with React.
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-slate-700 sm:text-xl">
          Explore open-source React apps and experiments.
        </p>
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
          A small project exploring interesting React builds, experiments, and
          ideas.
        </p>
        <p className="mt-5 text-sm text-slate-500">Currently under development.</p>

        <div className="mt-10">
          <a
            href={`mailto:${contactEmail}`}
            className="inline-flex items-center rounded-full border border-slate-300/80 bg-white px-6 py-2.5 text-sm font-medium text-slate-800 shadow-sm transition hover:border-slate-400 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
          >
            Contact
          </a>
        </div>

        <p className="mx-auto mt-5 max-w-lg text-sm text-slate-500">
          Interested in the project, collaboration, or the domain? Get in touch.
        </p>
      </div>
    </section>
  )
}
