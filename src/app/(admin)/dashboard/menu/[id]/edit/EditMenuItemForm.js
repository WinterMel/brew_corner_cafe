'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function EditMenuItemForm({ item, categories }) {
  const [name, setName] = useState(item.name)
  const [description, setDescription] = useState(item.description ?? '')
  const [price, setPrice] = useState(item.price)
  const [categoryId, setCategoryId] = useState(item.category_id)
  const [isAvailable, setIsAvailable] = useState(item.is_available)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [currentImageUrl, setCurrentImageUrl] = useState(item.image_url ?? null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    if (!imagePreview) return
    return () => URL.revokeObjectURL(imagePreview)
  }, [imagePreview])

  async function handleUpdate(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    let imageUrl = currentImageUrl

    if (imageFile) {
      const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
      const MAX_BYTES = 5 * 1024 * 1024

      if (!ALLOWED_TYPES.includes(imageFile.type)) {
        setError('Please upload a JPG, PNG, WEBP, or GIF image.')
        setLoading(false)
        return
      }
      if (imageFile.size > MAX_BYTES) {
        setError('Image must be under 5 MB.')
        setLoading(false)
        return
      }

      const fileExt = imageFile.name.split('.').pop().toLowerCase()
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('menu_images')
        .upload(fileName, imageFile, {
          contentType: imageFile.type,
          cacheControl: '3600',
          upsert: false,
        })

      if (uploadError) {
        setError(uploadError.message)
        setLoading(false)
        return
      }

      const { data: urlData } = supabase.storage
        .from('menu_images')
        .getPublicUrl(fileName)

      imageUrl = urlData.publicUrl
    }

    const { error } = await supabase
      .from('menu_items')
      .update({
        name,
        description,
        price: parseFloat(price),
        category_id: categoryId,
        is_available: isAvailable,
        image_url: imageUrl,
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

  const inputClass =
    'w-full px-3 py-2 border border-stone-300 rounded-md text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-900 focus:border-stone-900 transition-colors'

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <Link
          href="/dashboard/menu"
          className="text-sm text-stone-600 hover:text-stone-900 hover:underline"
        >
          ← Back to menu
        </Link>
      </div>

      <h1 className="text-2xl font-bold text-stone-900 mb-6">Edit Menu Item</h1>

      <form
        onSubmit={handleUpdate}
        className="bg-white rounded-lg shadow-sm p-6 space-y-4"
      >
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-stone-700 mb-1"
          >
            Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className={inputClass}
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-stone-700 mb-1"
          >
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="price"
              className="block text-sm font-medium text-stone-700 mb-1"
            >
              Price (₱)
            </label>
            <input
              id="price"
              type="number"
              step="0.01"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              className={inputClass}
            />
          </div>

          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-stone-700 mb-1"
            >
              Category
            </label>
            <select
              id="category"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
              className={inputClass}
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="image" className="block text-sm font-medium text-stone-700 mb-1">
            Photo
          </label>
          {currentImageUrl && !imagePreview && (
            <div className="mb-2">
              <img
                src={currentImageUrl}
                alt={item.name}
                className="h-32 w-32 object-cover rounded-md border border-stone-200"
              />
              <p className="mt-1 text-xs text-stone-500">Current photo</p>
            </div>
          )}
          <input
            id="image"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={(e) => {
              const file = e.target.files[0] ?? null
              setImageFile(file)
              setImagePreview(file ? URL.createObjectURL(file) : null)
            }}
          />
          <p className="mt-1 text-xs text-stone-500">
            {imagePreview ? 'New photo selected (replaces current on save)' : 'Leave empty to keep current photo'}
          </p>
          {imagePreview && (
            <div className="mt-2">
              <img
                src={imagePreview}
                alt="Preview"
                className="h-32 w-32 object-cover rounded-md border border-stone-200"
              />
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 pt-1">
          <input
            id="isAvailable"
            type="checkbox"
            checked={isAvailable}
            onChange={(e) => setIsAvailable(e.target.checked)}
            className="h-4 w-4 rounded border-stone-300 text-stone-900 focus:ring-stone-900"
          />
          <label htmlFor="isAvailable" className="text-sm text-stone-700">
            Available for ordering
          </label>
        </div>

        {error && (
          <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2">
            {error}
          </p>
        )}

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={loading || deleting}
            className="bg-stone-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-stone-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
          <Link
            href="/dashboard/menu"
            className="px-4 py-2 rounded-md text-sm font-medium text-stone-700 hover:bg-stone-100 transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>

      <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
        <h2 className="text-sm font-semibold text-stone-900 mb-1">Danger zone</h2>
        <p className="text-sm text-stone-600 mb-4">
          Permanently remove this item from the menu. This cannot be undone.
        </p>
        <button
          onClick={handleDelete}
          disabled={loading || deleting}
          className="bg-red-50 text-red-700 border border-red-200 px-4 py-2 rounded-md text-sm font-medium hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {deleting ? 'Deleting...' : 'Delete Item'}
        </button>
      </div>
    </div>
  )
}
