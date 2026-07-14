'use client'

import { createContext, useContext, useEffect, useState } from 'react'

const CartContext = createContext(undefined)

export function CartProvider({ children }) {
  const [items, setItems] = useState([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load cart from localStorage once, on first mount
  useEffect(() => {
    const stored = localStorage.getItem('brewcorner_cart')
    if (stored) {
      try {
        setItems(JSON.parse(stored))
      } catch {
        // ignore corrupted stored data
      }
    }
    setIsLoaded(true)
  }, [])

  // Persist cart to localStorage whenever it changes
  useEffect(() => {
    if (!isLoaded) return
    localStorage.setItem('brewcorner_cart', JSON.stringify(items))
  }, [items, isLoaded])

  function addItem(menuItem) {
    setItems((current) => {
      const existing = current.find((i) => i.id === menuItem.id)
      if (existing) {
        return current.map((i) =>
          i.id === menuItem.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      }
      return [
        ...current,
        {
          id: menuItem.id,
          name: menuItem.name,
          price: menuItem.price,
          image_url: menuItem.image_url,
          quantity: 1,
        },
      ]
    })
  }

  function removeItem(id) {
    setItems((current) => current.filter((i) => i.id !== id))
  }

  function updateQuantity(id, quantity) {
    if (quantity < 1) {
      removeItem(id)
      return
    }
    setItems((current) =>
      current.map((i) => (i.id === id ? { ...i, quantity } : i))
    )
  }

  function clearCart() {
    setItems([])
  }

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0)
  const totalPrice = items.reduce((sum, i) => sum + i.quantity * i.price, 0)

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}