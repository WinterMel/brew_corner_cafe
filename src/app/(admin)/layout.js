import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default function AdminLayout({ children }) {
  async function handleLogout() {
    'use server'
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/admin-login')
  }

  return (
    <div className="flex min-h-screen bg-stone-100">
      <aside className="w-56 bg-stone-900 text-stone-100 flex flex-col p-4">
        <h2 className="text-lg font-bold mb-8 tracking-tight">Brew Corner</h2>
        <nav className="flex flex-col gap-1 flex-1">
          <Link
            href="/dashboard"
            className="px-3 py-2 rounded-md hover:bg-stone-700 transition-colors"
          >
            Order Queue
          </Link>
          <Link
            href="/dashboard/menu"
            className="px-3 py-2 rounded-md hover:bg-stone-700 transition-colors"
          >
            Menu Management
          </Link>
        </nav>
        <form action={handleLogout}>
          <button
            type="submit"
            className="w-full text-left px-3 py-2 rounded-md text-red-300 hover:bg-stone-700 hover:text-red-200 transition-colors"
          >
            Log Out
          </button>
        </form>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  )
}