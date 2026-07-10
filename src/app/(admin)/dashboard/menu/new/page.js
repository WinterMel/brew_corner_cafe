'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function NewMenuItemPage() {
  const [categories, setCategories] = useState([])
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [isAvailable, setIsAvailable] = useState(true)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function fetchCategories() {
      const { data, error } = await supabase.from('categories').select('*')
      if (error) {
        console.error('Error fetching categories:', error)
        return
      }
      setCategories(data)
      if (data.length > 0) setCategoryId(data[0].id)
    }
    fetchCategories()
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.from('menu_items').insert({
      name,
      description,
      price: parseFloat(price),
      category_id: categoryId,
      is_available: isAvailable,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push('/dashboard/menu')
    router.refresh()
  }

  return (
    <div>
      <h1>Add Menu Item</h1>
      <form onSubmit={handleSubmit}>
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

        <button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Add Item'}
        </button>
      </form>
    </div>
  )
}