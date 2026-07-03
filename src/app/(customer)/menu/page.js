import { createClient } from '@/lib/supabase/server'

export default async function MenuPage() {
  const supabase = await createClient()

  const { data: categories, error } = await supabase
    .from('categories')
    .select('*')

  if (error) {
    console.error('Supabase error:', error)
    return <p>Something went wrong loading the menu.</p>
  }

  return (
    <div>
      <h1>Menu</h1>
      <pre>{JSON.stringify(categories, null, 2)}</pre>
    </div>
  )
}