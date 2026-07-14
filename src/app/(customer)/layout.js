import { CartProvider } from '@/context/CartContext'
import Navbar from '@/components/customer/Navbar'

export default function CustomerLayout({ children }) {
  return (
    <CartProvider>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1">{children}</main>
        {/* Footer will go here later */}
      </div>
    </CartProvider>
  )
}