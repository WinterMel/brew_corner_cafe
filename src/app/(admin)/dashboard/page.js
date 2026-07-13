import Link from 'next/link'

const stats = [
  { label: 'Orders Today', value: '0' },
  { label: 'In Progress', value: '0' },
  { label: 'Completed', value: '0' },
  { label: 'Menu Items', value: '0' },
]

const quickLinks = [
  {
    href: '/dashboard/menu',
    title: 'Menu Management',
    description: 'Add, edit, or remove items from your menu.',
  },
  {
    href: '/dashboard/orders',
    title: 'Order Queue',
    description: 'Review and update incoming customer orders.',
  },
]

export default function DashboardPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-stone-900">Admin Dashboard</h1>
        <p className="text-sm text-stone-500 mt-1">
          Overview of today&apos;s café activity.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-lg shadow-sm p-5"
          >
            <p className="text-xs font-medium text-stone-500 uppercase tracking-wide">
              {stat.label}
            </p>
            <p className="text-3xl font-bold text-stone-900 mt-2">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-stone-200">
          <h2 className="text-lg font-semibold text-stone-900">Quick actions</h2>
        </div>
        <div className="divide-y divide-stone-100">
          {quickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block px-6 py-4 hover:bg-stone-50 transition-colors"
            >
              <p className="font-medium text-stone-900">{link.title}</p>
              <p className="text-sm text-stone-600 mt-0.5">{link.description}</p>
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-6 bg-stone-50 border border-stone-200 rounded-lg p-6 text-center">
        <p className="text-sm text-stone-600">
          Real-time metrics will appear here once the order pipeline is live.
        </p>
      </div>
    </div>
  )
}
