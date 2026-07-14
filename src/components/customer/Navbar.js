'use client'

import Link from 'next/link'
import { useCart } from '@/context/CartContext'

export default function Navbar() {
  const { totalItems } = useCart()

  return (
    <header className="bg-[#F7F2E7] border-b border-[#3E2C22]/10">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-semibold text-[#2B2420] text-lg">
          Brew Corner
        </Link>
        <nav className="flex items-center gap-6 text-sm text-[#2B2420]">
          <Link href="/menu" className="hover:text-[#E3A008] transition-colors">
            Menu
          </Link>
          <Link href="/cart" className="relative hover:text-[#E3A008] transition-colors">
            Cart
            {totalItems > 0 && (
              <span className="ml-1.5 bg-[#E3A008] text-white text-xs font-semibold rounded-full px-1.5 py-0.5">
                {totalItems}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  )
}