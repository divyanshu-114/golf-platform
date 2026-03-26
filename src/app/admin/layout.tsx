import { requireAdmin } from '@/lib/adminGuard'
import { redirect } from 'next/navigation'
import AdminSidebar from './AdminSidebar'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Check authorization on the server side
  const { error } = await requireAdmin()
  
  if (error) {
    // If not logged in or not an admin, bounce back to the normal dashboard
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