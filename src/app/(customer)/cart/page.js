'use client'

import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import { formatPrice } from '@/lib/formatPrice'

export default function CartPage() {
  const { items, updateQuantity, removeItem, totalPrice } = useCart()

  const toAmount = (n) => Number(n) || 0

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-16 text-center">
        <h1 className="font-semibold text-2xl text-[#2B2420] mb-3">Your cart is empty</h1>
        <p className="text-[#5c5248] mb-6">Add something delicious from the menu.</p>
        <Link
          href="/menu"
          className="inline-block bg-[#2B2420] text-white px-5 py-2.5 rounded-md text-sm font-medium hover:bg-[#3E2C22] transition-colors"
        >
          Browse Menu
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="font-semibold text-2xl text-[#2B2420] mb-8">Your Cart</h1>

      <div className="space-y-4 mb-8">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-4 bg-[#FFFDF8] border border-[#3E2C22]/10 rounded-lg p-4"
          >
            <div className="w-16 h-16 rounded-md bg-[#EDE6D6] overflow-hidden shrink-0">
              {item.image_url ? (
                <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
              ) : null}
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-medium text-[#2B2420] truncate">{item.name}</p>
              <p className="text-sm text-[#5c5248]">{formatPrice(toAmount(item.price))} each</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                className="w-8 h-8 rounded-md border border-[#3E2C22]/20 text-[#2B2420] hover:bg-[#F0EBE0] transition-colors"
                aria-label={`Decrease quantity of ${item.name}`}
              >
                −
              </button>
              <span className="w-6 text-center text-[#2B2420]">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="w-8 h-8 rounded-md border border-[#3E2C22]/20 text-[#2B2420] hover:bg-[#F0EBE0] transition-colors"
                aria-label={`Increase quantity of ${item.name}`}
              >
                +
              </button>
            </div>

            <p className="w-16 text-right font-medium text-[#2B2420] shrink-0">
              {formatPrice(toAmount(item.price) * item.quantity)}
            </p>

            <button
              onClick={() => removeItem(item.id)}
              className="text-sm text-red-600 hover:underline shrink-0"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between border-t border-[#3E2C22]/15 pt-6">
        <span className="text-[#5c5248]">Subtotal</span>
        <span className="text-xl font-semibold text-[#2B2420]">{formatPrice(toAmount(totalPrice))}</span>
      </div>
      <p className="text-xs text-[#5c5248] mt-1 mb-6">
        Delivery fee (if applicable) calculated at checkout.
      </p>

      <Link
        href="/checkout"
        className="block text-center bg-[#2B2420] text-white py-3 rounded-md font-medium hover:bg-[#3E2C22] transition-colors"
      >
        Proceed to Checkout
      </Link>
    </div>
  )
}