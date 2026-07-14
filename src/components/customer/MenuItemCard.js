'use client'

import { useState } from 'react'
import { useCart } from '@/context/CartContext'
import { formatPrice } from '@/lib/formatPrice'

export default function MenuItemCard({ item }) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)

  function handleAdd() {
    addItem(item)
    setAdded(true)
    setTimeout(() => setAdded(false), 1200)
  }

  return (
    <div className="bg-[#FFFDF8] rounded-xl overflow-hidden border border-[#3E2C22]/10 hover:border-[#3E2C22]/25 transition-colors">
      <div className="aspect-[4/3] bg-[#EDE6D6] overflow-hidden">
        {item.image_url ? (
          <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#3E2C22]/30 text-sm">
            No photo yet
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-baseline justify-between gap-2 mb-1">
          <h3 className="font-semibold text-[#2B2420]">{item.name}</h3>
          <span className="italic text-[#E3A008] text-lg shrink-0">{formatPrice(item.price)}</span>
        </div>
        {item.description && (
          <p className="text-sm text-[#5c5248] leading-snug mb-3">{item.description}</p>
        )}
        <button
          onClick={handleAdd}
          className="w-full bg-[#2B2420] text-white text-sm font-medium rounded-md py-2 hover:bg-[#3E2C22] transition-colors"
        >
          {added ? 'Added ✓' : 'Add to Cart'}
        </button>
      </div>
    </div>
  )
}