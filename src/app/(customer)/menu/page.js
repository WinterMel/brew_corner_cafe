import { Fraunces, Public_Sans } from 'next/font/google'
import { createClient } from '@/lib/supabase/server'
import MenuItemCard from '@/components/customer/MenuItemCard'

const display = Fraunces({
  subsets: ['latin'],
  weight: ['500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-display',
})

const body = Public_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-body',
})

export default async function MenuPage() {
  const supabase = await createClient()

  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('id')

  const { data: items } = await supabase
    .from('menu_items')
    .select('*')
    .eq('is_available', true)
    .order('name')

  const itemsByCategory =
    categories
      ?.map((cat) => ({
        ...cat,
        items: items?.filter((item) => item.category_id === cat.id) ?? [],
      }))
      .filter((cat) => cat.items.length > 0) ?? []

  return (
    <div className={`${display.variable} ${body.variable} bg-[#F7F2E7] min-h-screen`}>
      <div className="max-w-5xl mx-auto px-6 py-16">
        <p className="font-[family-name:var(--font-body)] text-xs tracking-[0.2em] uppercase text-[#3F6355] mb-3">
          Jaro, Iloilo City
        </p>
        <h1 className="font-[family-name:var(--font-display)] text-4xl sm:text-5xl italic text-[#2B2420] mb-3">
          The Menu
        </h1>
        <p className="font-[family-name:var(--font-body)] text-[#5c5248] max-w-md mb-14">
          Brewed to order, ready in 20–30 minutes. Pickup or delivery around Jaro.
        </p>

        {itemsByCategory.length === 0 ? (
          <p className="font-[family-name:var(--font-body)] text-[#5c5248]">
            No items available right now — check back soon.
          </p>
        ) : (
          itemsByCategory.map((cat) => (
            <section key={cat.id} className="mb-16">
              <div className="flex items-center gap-3 mb-6">
                <h2 className="font-[family-name:var(--font-display)] text-2xl text-[#2B2420] whitespace-nowrap">
                  {cat.name}
                </h2>
                <div className="flex-1 border-t border-dashed border-[#3E2C22]/25" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {cat.items.map((item) => (
                  <MenuItemCard key={item.id} item={item} />
                ))}
              </div>
            </section>
          ))
        )}
      </div>
    </div>
  )
}