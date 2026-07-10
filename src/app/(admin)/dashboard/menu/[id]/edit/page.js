import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import EditMenuItemForm from './EditMenuItemForm'

export default async function EditMenuItemPage({ params }) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: item, error: itemError }, { data: categories, error: catError }] =
    await Promise.all([
      supabase.from('menu_items').select('*').eq('id', id).single(),
      supabase.from('categories').select('*'),
    ])

  if (itemError || !item) {
    notFound()
  }

  return <EditMenuItemForm item={item} categories={categories ?? []} />
}