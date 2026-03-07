import { AdminPage } from '@/features/admin'
import { LandingPage } from '@/features/landing'

function isAdminRoute(pathname: string): boolean {
  return pathname === '/admin' || pathname.startsWith('/admin/')
}

function App() {
  const pathname = typeof window === 'undefined' ? '/' : window.location.pathname

  if (isAdminRoute(pathname)) {
    return <AdminPage />
  }

  return <LandingPage />
}

export default App
