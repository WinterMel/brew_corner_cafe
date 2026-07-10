import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function AdminMenuPage() {
  const supabase = await createClient()

  const { data: menuItems, error } = await supabase
    .from('menu_items')
    .select('*, categories(name)')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Supabase error:', error)
    return <p className="text-red-600">Something went wrong loading the menu.</p>
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-stone-900">Menu Management</h1>
        <Link
          href="/dashboard/menu/new"
          className="bg-stone-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-stone-700 transition-colors"
        >
          + Add Item
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-stone-50 border-b border-stone-200">
            <tr>
              <th className="px-4 py-3 text-sm font-semibold text-stone-600">Name</th>
              <th className="px-4 py-3 text-sm font-semibold text-stone-600">Category</th>
              <th className="px-4 py-3 text-sm font-semibold text-stone-600">Price</th>
              <th className="px-4 py-3 text-sm font-semibold text-stone-600">Available</th>
              <th className="px-4 py-3 text-sm font-semibold text-stone-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {menuItems.map((item) => (
              <tr key={item.id} className="hover:bg-stone-50">
                <td className="px-4 py-3 font-medium text-stone-900">{item.name}</td>
                <td className="px-4 py-3 text-stone-600">{item.categories?.name ?? 'Uncategorized'}</td>
                <td className="px-4 py-3 text-stone-600">₱{item.price}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.is_available
                        ? 'bg-green-100 text-green-700'
                        : 'bg-stone-200 text-stone-600'
                    }`}
                  >
                    {item.is_available ? 'Available' : 'Unavailable'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/dashboard/menu/${item.id}/edit`}
                    className="text-stone-900 font-medium hover:underline"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}