import { requireAdmin } from '@/lib/adminGuard'
import { redirect } from 'next/navigation'
import AdminSidebar from './AdminSidebar'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Check authorization on the server side
  const { error } = await requireAdmin()
  
  if (error) {
    // Check if the error is 401 (Unauthorized - Not logged in)
    if (error.status === 401) {
      redirect('/')
    }
    // Otherwise it's 403 (Forbidden - Logged in but not an admin)
    redirect('/dashboard')
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Client-side Sidebar for Active Navigation */}
      <AdminSidebar />

      {/* Content */}
      <main className="ml-56 flex-1 p-8">{children}</main>
    </div>
  )
}