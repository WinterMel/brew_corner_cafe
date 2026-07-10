'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function EditMenuItemForm({ item, categories }) {
  const [name, setName] = useState(item.name)
  const [description, setDescription] = useState(item.description ?? '')
  const [price, setPrice] = useState(item.price)
  const [categoryId, setCategoryId] = useState(item.category_id)
  const [isAvailable, setIsAvailable] = useState(item.is_available)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const router = useRouter()
  const supabase = createClient()

  async function handleUpdate(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase
      .from('menu_items')
      .update({
        name,
        description,
        price: parseFloat(price),
        category_id: categoryId,
        is_available: isAvailable,
      })
      .eq('id', item.id)

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push('/dashboard/menu')
    router.refresh()
  }

  async function handleDelete() {
    const confirmed = window.confirm(
      `Delete "${item.name}"? This cannot be undone.`
    )
    if (!confirmed) return

    setDeleting(true)
    setError(null)

    const { error } = await supabase
      .from('menu_items')
      .delete()
      .eq('id', item.id)

    if (error) {
      setError(error.message)
      setDeleting(false)
      return
    }

    router.push('/dashboard/menu')
    router.refresh()
  }

  return (
    <div>
      <h1>Edit Menu Item</h1>
      <form onSubmit={handleUpdate}>
        <div>
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="price">Price (₱)</label>
          <input
            id="price"
            type="number"
            step="0.01"
            min="0"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="category">Category</label>
          <select
            id="category"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              checked={isAvailable}
              onChange={(e) => setIsAvailable(e.target.checked)}
            />
            Available
          </label>
        </div>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <button type="submit" disabled={loading || deleting}>
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>

      <button
        onClick={handleDelete}
        disabled={loading || deleting}
        style={{ marginTop: '1rem', color: 'red' }}
      >
        {deleting ? 'Deleting...' : 'Delete Item'}
      </button>
    </div>
  )
}