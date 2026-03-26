import { requireAuth } from '@/lib/authGuard'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  // Check authorization on the server side
  const userId = await requireAuth()
  
  if (!userId) {
    // If not logged in, bounce back to the landing page
    redirect('/')
  }

  return <>{children}</>
}
