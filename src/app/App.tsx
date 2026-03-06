import {
  BrowseProjectsSection,
  ComingLaterSection,
  FeaturedBuildsSection,
  HeroSection,
  LandingFooter,
  SubmitProjectSection,
} from '@/features/landing'

function App() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50 text-slate-900">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[38rem] w-[38rem] -translate-x-1/2 rounded-full bg-gradient-to-br from-sky-100/70 via-white to-emerald-100/60 blur-3xl" />
        <div className="absolute bottom-[-7rem] left-1/2 h-56 w-[32rem] -translate-x-1/2 rounded-full bg-slate-200/50 blur-3xl" />
      </div>

      <div className="relative">
        <main>
          <HeroSection />

          <div className="mx-auto w-full max-w-6xl space-y-20 px-6 pb-20 sm:space-y-24 sm:pb-24">
            <FeaturedBuildsSection />
            <BrowseProjectsSection />
            <SubmitProjectSection />
            <ComingLaterSection />
          </div>
        </main>

        <LandingFooter />
      </div>
    </div>
  )
}

export default App
